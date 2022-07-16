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
import { Button } from 'react-native-paper';

type SaveEditModalProps = {
    isVisible: boolean,
    setVisible: (val: boolean) => void,
    video: AtLeast<MyVideo, 'uri'>
}

export const SaveEditModal = ({ isVisible, setVisible, video }: SaveEditModalProps) => {
    const [editingTitle, setTitle] = useState(video.title || '')
    const [editingDate, setDate] = useState<Date | undefined>(video.notificationDate)
    const [dateOpen, setDateOpen] = useState(false)
    const [permissionsStatus, requestPermission] = MediaLibrary.usePermissions();
    const [isLoading, setLoading] = useState(false)
    const dispatch = useDispatch()

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
        dispatch(upsertMedia({ ...asset, notificationDate: editingDate, notificationId }))
        setVisible(false)
        setLoading(false)
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
                <Text style={{ ...styles.modalText, ...styles.titleText }} >Save Video</Text>
                <TextInput style={styles.modalText} value={editingTitle} onChangeText={setTitle} />
                <TouchableOpacity onPress={() => {
                    if (editingDate === undefined) setDate(new Date())
                    setDateOpen(true)
                }}>
                    <TextInput value={editingDate ? editingDate.toString() : 'None'} />
                </TouchableOpacity>
                {editingDate && <DatePicker
                    modal
                    open={dateOpen}
                    date={editingDate}
                    onConfirm={(newDate) => {
                        setDate(newDate)
                        setDateOpen(false)
                    }}
                    onCancel={() => {
                        setDateOpen(false)
                    }}
                />}
                <Button color={'blue'} mode='contained' onPress={onPressSave}>Save</Button>
                <Button color={'gray'} mode='outlined' onPress={() => setVisible(false)}>Cancel</Button>
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
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
})  
