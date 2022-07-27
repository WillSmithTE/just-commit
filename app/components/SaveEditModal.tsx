import * as React from 'react';
import { Text, View, StyleSheet, Platform, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import DatePicker from 'react-native-date-picker'
import * as MediaLibrary from 'expo-media-library';
import { Loading } from './Loading';
import * as Notifications from 'expo-notifications';
import { registerForNotificationsAsync } from './Notification';
import { AtLeast, isMyVideo, MyVideo } from '../types';
import { useDispatch } from 'react-redux';
import { upsertMedia } from '../services/mediaSlice';
import { Button, IconButton, Modal, TextInput, } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from './Icon';
import { isDevice } from 'expo-device';

type SaveEditModalProps = {
    isVisible: boolean,
    setVisible: (val: boolean) => void,
    video: AtLeast<MyVideo, 'uri'>
}

const isDebug = false

export const SaveEditModal = ({ isVisible, setVisible, video }: SaveEditModalProps) => {
    const [title, setTitle] = useState(video.title || '')
    const [date, setDate] = useState<Date | undefined>(video.notificationDate ? new Date(video.notificationDate) : undefined)
    const [dateOpen, setDateOpen] = useState(false)
    const [permissionsStatus, requestPermission] = MediaLibrary.usePermissions();
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const isNewMode = () => isMyVideo(video)

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

        let mediaToSave
        if (isMyVideo(video)) mediaToSave = video
        else {
            mediaToSave = await MediaLibrary.createAssetAsync(video.uri)
            video.notificationId && await deleteOldNotification(video.notificationId)
            if (Platform.OS === 'ios' && isDevice) mediaToSave.uri = convertLocalIdentifierToAssetLibrary(mediaToSave.uri, 'mov')
        }
        mediaToSave = {
            ...mediaToSave,
            notificationDate: dateToSave?.getTime(),
            title,
        }
        let notificationId = undefined
        if (mediaToSave.notificationDate) notificationId = await registerForNotification(mediaToSave)
        dispatch(upsertMedia({ ...mediaToSave, notificationId, }))
        setVisible(false)
        setLoading(false)

        navigation.goBack()
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
        <TextInput underlineColor='purple' mode='flat' label={'Name (optional)'}
            style={styles.titleTextInput} value={title} onChangeText={setTitle} autoComplete='off'
            theme={{
                colors: {
                    placeholder: 'purple', text: 'black', primary: 'purple',
                    background: '#003489'
                }
            }} />
        <View style={styles.notificationRow}>
            <Button mode='outlined' icon='bell-outline' style={styles.notificationButton} onPress={() => {
                if (date === undefined) setDate(new Date())
                setDateOpen(true)
            }}>{date ? date.toLocaleString() : 'Add notification'}</Button>
            {date && <IconButton icon="close" size={35} onPress={() => setDate(undefined)} />}
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
        <View style={styles.buttonContainer}>
            <Button style={styles.button} color={'blue'} mode='contained' onPress={onPressSave}>Save</Button>
            <Button style={styles.button} color={'gray'} mode='outlined' onPress={() => setVisible(false)}>Cancel</Button>
        </View>
    </Modal>

}

const deleteOldNotification = async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
}

const registerForNotification = async (media: MyVideo) => {
    console.debug(`registering for notification (date=${media.notificationDate}`)
    await registerForNotificationsAsync()
    return schedulePushNotification(media)
}

async function schedulePushNotification(media: MyVideo): Promise<string> {
    return media.notificationDate ? await Notifications.scheduleNotificationAsync({
        content: {
            title: media.title ? `Reminder: ${media.title}` : "You've been reminded!",
            body: 'Come on, watch your vid now. You got this 💃 🕺',
            data: { media },
        },
        trigger: { date: media.notificationDate },
    }) : Promise.reject()
}

export const convertLocalIdentifierToAssetLibrary = (uri: string, ext: string) => {
    const withoutPh = uri.replace('ph://', '')
    const hash = withoutPh.split('/')[0];
    return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;
};

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
        opacity: 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 30,
        alignItems: 'center',
        // minWidth: 200,
    },
    button: {
        borderRadius: 5,
        // padding: 10,
        marginBottom: 15,
        // width: '80%',
        // elevation: 2,
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
        marginBottom: 15,
        textAlign: 'left',
        alignSelf: 'stretch',
        backgroundColor: '#f9f9f9',
    },
    notificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        justifyContent: 'space-between',
        alignSelf: 'stretch',
    },
    buttonContainer: {
        alignSelf: 'stretch'
    },
    notificationButton: {
        flex: 1,
    }
})  
