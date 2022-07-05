import * as React from 'react';
import { Text, View, StyleSheet, Alert, Modal, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import DatePicker from 'react-native-date-picker'
import * as MediaLibrary from 'expo-media-library';
import { Loading } from './Loading';
import { AppStorage } from '../services/AppStorage';
import * as Notifications from 'expo-notifications';
import { registerForNotificationsAsync } from './Notification';

type SaveModalProps = {
    isVisible: boolean,
    setVisible: (val: boolean) => void,
    uri: string,
}

export const SaveModal = ({ isVisible, setVisible, uri }: SaveModalProps) => {
    const [title, setTitle] = useState('')
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [dateOpen, setDateOpen] = useState(false)
    const [permissionsStatus, requestPermission] = MediaLibrary.usePermissions();
    const [isLoading, setLoading] = useState(false)

    const onPressSave = async () => {
        setLoading(true)
        await requestPermission()
        if (!permissionsStatus?.granted) {
            console.error('failed to get permissions')
            return
        }
        const asset = await MediaLibrary.createAssetAsync(uri)
        await AppStorage.saveVideo(asset)
        if (date) {
            await registerForNotificationsAsync()
            await schedulePushNotification(date)
        }
        setVisible(false)
        setLoading(false)
    }

    return <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setVisible(false);
        }}>
        {isLoading && <Loading />}
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>
                <TextInput style={styles.modalText} value={title} onChangeText={setTitle} />
                <TouchableOpacity onPress={() => {
                    if (date === undefined) setDate(new Date())
                    setDateOpen(true)
                }}>
                    <TextInput value={date ? date.toString() : 'None'} />
                </TouchableOpacity>
                {date && <DatePicker
                    modal
                    open={dateOpen}
                    date={date}
                    onConfirm={(date) => {
                        setDateOpen(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setDateOpen(false)
                    }}
                />}
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setVisible(false)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={onPressSave}>
                    <Text style={styles.textStyle}>Save</Text>
                </Pressable>
            </View>
        </View>
    </Modal>

}

async function schedulePushNotification(date: Date) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
    });
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
})  
