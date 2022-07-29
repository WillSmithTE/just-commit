import * as React from 'react';
import { Text, View, StyleSheet, Platform, Alert, NativeModules, TouchableOpacity, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import DatePicker from 'react-native-date-picker'
import * as MediaLibrary from 'expo-media-library';
import { Loading } from './Loading';
import * as Notifications from 'expo-notifications';
import { registerForNotificationsAsync } from './Notification';
import { AtLeast, AtLeast2, isMyVideo, MyMedia } from '../types';
import { useDispatch } from 'react-redux';
import { upsertMedia } from '../services/mediaSlice';
import { Button, IconButton, Modal, Portal, RadioButton, } from 'react-native-paper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { isDevice } from 'expo-device';
import { showMessage } from 'react-native-flash-message';
import { Feature, useFeature } from '../hooks/useFeature';

type SaveEditModalProps = {
    isVisible: boolean,
    setVisible: (val: boolean) => void,
    media: AtLeast2<MyMedia, 'uri', 'type'>,
}

const isDebug = false

export const SaveEditModal = ({ isVisible, setVisible, media }: SaveEditModalProps) => {
    const [title, setTitle] = useState(media.title || '')
    const [date, setDate] = useState<Date | undefined>(media.deadline ? new Date(media.deadline.date) : undefined)
    const [dateOpen, setDateOpen] = useState(false)
    const [permissionsStatus, requestPermission] = MediaLibrary.usePermissions();
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const isNewMode = () => isMyVideo(media)
    const [repeat, setRepeat] = useState<string>(media.repeat?.label ?? repeatOptions[0].label)
    const [repeatOpen, setRepeatOpen] = useState(false)
    const isFocused = useIsFocused();
    const isRecordV2 = useFeature(Feature.FULL_RECORD_SCREEN)

    const onPressSave = async () => {
        setLoading(true)
        const permissionsresponse = await requestPermission()
        if (!permissionsresponse?.granted) {
            console.error(`failed to get permissions (permissionStatus=${JSON.stringify(permissionsStatus)}`)
            setLoading(false)
            return
        }
        let dateToSave = undefined
        if (date || !isDebug) dateToSave = date
        else {
            const now = new Date()
            now.setSeconds(now.getSeconds() + 20)
            dateToSave = now
        }

        let mediaLibAsset: MediaLibrary.Asset
        if (isMyVideo(media)) mediaLibAsset = media // if in edit mode
        else {
            mediaLibAsset = await MediaLibrary.createAssetAsync(media.uri)
            console.log(JSON.stringify({ newLibAsset: mediaLibAsset }, null, 2))
            media.deadline && await deleteOldNotification(media.deadline.id)
            if (Platform.OS === 'ios' && isDevice) mediaLibAsset.uri = convertLocalIdentifierToAssetLibrary(mediaLibAsset.uri, 'mov')
        }
        const deadline = date ?
            {
                id: await registerForNotification(mediaLibAsset.id, date.getTime(), title),
                date: date.getTime()
            } : undefined
        const mediaToSave = {
            ...mediaLibAsset,
            deadline,
            title,
            type: media.type,
        }
        dispatch(upsertMedia(mediaToSave))
        setVisible(false)
        setLoading(false)

        isRecordV2 ? navigation.navigate('Root') : navigation.goBack()
    }

    return <Modal
        dismissable
        visible={isVisible}
        onDismiss={() => {
            setVisible(false);
        }}
        style={styles.modal}
        contentContainerStyle={styles.modalView}>
        {isLoading && <Loading />}
        <TextInput placeholder='Add title'
            style={styles.titleTextInput} value={title} onChangeText={setTitle} autoComplete='off' autoFocus />
        <View style={styles.row}>
            <Button mode='outlined' icon='bell-outline' style={styles.button} onPress={() => {
                if (NativeModules.RNDatePicker) {
                    if (date === undefined) setDate(new Date())
                    setDateOpen(true)
                } else {
                    showMessage({ message: 'Need a native install for that, sorry', type: 'info' })
                }
            }}>{date ? date.toLocaleString() : 'Add deadline'}</Button>
            {date && <IconButton icon="close" size={35} onPress={() => setDate(undefined)} />}
        </View>
        <View style={styles.row}>
            <Button mode='outlined' icon='arrow-u-right-top' style={styles.button} onPress={() => setRepeatOpen(true)}>
                {repeat ?? 'Does not repeat'}
            </Button>
        </View>
        {date && <DatePicker
            modal
            open={dateOpen}
            date={date}
            onConfirm={(date) => {
                setDateOpen(false)
                setDate(date)
            }}
            onCancel={() => setDateOpen(false)}
        />}
        {isFocused && <RepeatPicker {...{ repeat, setRepeat, repeatOpen, setRepeatOpen }} />}
        {/* <View style={styles.buttonContainer}> */}
        <View style={styles.row}>

            <Button style={styles.button} color={'blue'} mode='contained' onPress={onPressSave}>Save</Button>
        </View>
        <View style={styles.row}>

            <Button style={styles.button} color={'gray'} mode='outlined' onPress={() => setVisible(false)}>Cancel</Button>
        </View>
    </Modal>

}

type RepeatPickerProps = {
    repeat: string,
    setRepeat: (repeat: string) => void,
    repeatOpen: boolean,
    setRepeatOpen: (open: boolean) => void,
}
const RepeatPicker = ({ repeat, setRepeat, repeatOpen, setRepeatOpen }: RepeatPickerProps) => {
    return <Portal>
        <Modal visible={repeatOpen} onDismiss={() => setRepeatOpen(false)} contentContainerStyle={styles.repeatModalContainer}>
            {repeatOptions.map(({ label }, i) =>
                <TouchableOpacity style={{ flexDirection: 'row' }} key={i} onPress={() => { setRepeat(label); setRepeatOpen(false) }}>
                    <RadioButton.Android value={label} status={repeat === label ? 'checked' : 'unchecked'} uncheckedColor='#777a78' />
                    <Text style={{ color: 'black', alignSelf: 'center' }}>{label}</Text>
                </TouchableOpacity>
            )}
        </Modal>
    </Portal>
}

const deleteOldNotification = async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}

const registerForNotification = async (id: string, date: number, title?: string) => {
    console.debug(`registering for notification (date=${date}`)
    await registerForNotificationsAsync()
    return schedulePushNotification(id, date, title)
}

async function schedulePushNotification(id: string, date: number, title?: string): Promise<string> {
    return date ? await Notifications.scheduleNotificationAsync({
        content: {
            title: title ? `Reminder: ${title}` : "You've been reminded!",
            body: 'Come on, watch your vid now. You got this 💃 🕺',
            data: { id },
        },
        trigger: { date },
    }) : Promise.reject()
}

export const convertLocalIdentifierToAssetLibrary = (uri: string, ext: string) => {
    const withoutPh = uri.replace('ph://', '')
    const hash = withoutPh.split('/')[0];
    return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
};

const repeatOptions = [
    {
        label: 'Does not repeat',
    },
    {
        label: 'Every day',
    },
    {
        label: 'Every week',
    },
    {
        label: 'Every month',
    },
]

const styles = StyleSheet.create({
    modal: {
        paddingHorizontal: 20,
        paddingBottom: 200,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        opacity: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 30,
        alignItems: 'center',
        // minWidth: 200,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalHeader: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    titleTextInput: {
        fontSize: 25,
        marginBottom: 15,
        textAlign: 'left',
        alignSelf: 'stretch',
        // backgroundColor: '#f9f9f9',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    button: {
        flex: 1,
        borderColor: 'silver',
        borderWidth: .8,
    },
    repeatModalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 25,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    repeatOption: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        color: 'black',
        fontSize: 10
    }
})  
