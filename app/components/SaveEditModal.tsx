import * as React from 'react';
import { Text, View, StyleSheet, Alert, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker'
import * as MediaLibrary from 'expo-media-library';
import { Loading } from './Loading';
import * as Notifications from 'expo-notifications';
import { registerForNotificationsAsync } from './Notification';
import { AtLeast, MyVideo } from '../types';
import { useDispatch } from 'react-redux';
import { upsertMedia } from '../services/mediaSlice';
import { Button, Checkbox } from 'react-native-paper';
import { clearSelectedMedia } from '../services/selectedMediaSlice';
import { useNavigation } from '@react-navigation/native';

type SaveEditModalProps = {
    isVisible: boolean,
    setVisible: (val: boolean) => void,
    video: AtLeast<MyVideo, 'uri'>
}

export const SaveEditModal = ({ isVisible, setVisible, video }: SaveEditModalProps) => {
    const [title, setTitle] = useState(video.title || '')
    const [date, setDate] = useState<Date | undefined>(video.notificationDate)
    const [dateOpen, setDateOpen] = useState(false)
    const [permissionsStatus, requestPermission] = MediaLibrary.usePermissions();
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const navigation = useNavigation();

    console.debug(`Rendering modal`)

    const onPressSave = async () => {
        setLoading(true)
        await requestPermission()
        if (!permissionsStatus?.granted) {
            console.error('failed to get permissions')
            return
        }
        const [asset, _, notificationId] = await Promise.all([
            MediaLibrary.createAssetAsync(video.uri),
            deleteOldNotification(video),
            registerForNotification()
        ])
        dispatch(upsertMedia({ ...asset, notificationDate: date, notificationId, title }))
        setLoading(false)
        setVisible(false)

        navigation.goBack()
    }

    return <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
            setVisible(false);
        }}>
        {isLoading && <Loading />}
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={{ ...styles.titleLabel }}>Title</Text>
                <TextInput style={styles.titleTextInput} value={title} onChangeText={setTitle} autoFocus />
                <View style={styles.notificationRow}>
                    <Text style={{}} >Notification</Text>
                    <Checkbox
                        status={date ? 'checked' : 'unchecked'}
                        onPress={() => setDate(date ? undefined : new Date())}
                    />
                </View>
                {date && <DatePicker date={date} onDateChange={setDate} />}
                <View style={styles.buttonContainer}>
                    <Button style={styles.button} color={'blue'} mode='contained' onPress={onPressSave}>Save</Button>
                    <Button style={styles.button} color={'gray'} mode='outlined' onPress={() => setVisible(false)}>Cancel</Button>
                </View>
            </View>
        </View>
    </Modal>

}

async function schedulePushNotification(date: Date): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
}

const deleteOldNotification = async (oldVideo: AtLeast<MyVideo, 'uri'>) => {
    if (oldVideo.notificationId && oldVideo.notificationDate) {
        await Notifications.cancelScheduledNotificationAsync(oldVideo.notificationId);
    }
}

const registerForNotification = async (notificationDate?: Date) => {
    if (notificationDate) {
        await registerForNotificationsAsync()
        return schedulePushNotification(notificationDate)
    }
    return Promise.resolve(undefined)
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        opacity: 0.8,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        minWidth: 200,
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
    titleLabel: {
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'left',
        fontSize: 15,
        alignSelf: 'stretch',
    },
    titleTextInput: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize: 15,
        alignSelf: 'stretch',
        // backgroundColor: '#AF9696'
    },
    notificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        justifyContent: 'space-between'
    },
    buttonContainer: {
        alignSelf: 'stretch'
    },
})  
