import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { deleteSong } from '../services/songSlice';
import Icon, { DownloadedIcon } from './Icon';
import { api } from '../services/api';
import { Video } from '../types';
import { ORANGE_COLOUR } from '../constants';

export const DeleteButton = ({ song }: {song: Video}) => {
	const dispatch = useDispatch()

	const deleteDownload = async () => {
		console.debug(`Deleting downloaded file (id=${song.id})`)
		try {
			await api.deleteSong(song)
			dispatch(deleteSong(song.id))
			console.debug(`Deletion success (id=${song.id})`)
		} catch (e) {
			console.error(e)
		}

	}

	const onClick = () => {
		deleteDownload()
	}

	return <View style={styles.right}>
		<TouchableOpacity onPress={onClick}>
			<Icon name='trash-alt' family='FontAwesome5' color={ORANGE_COLOUR}/>
		</TouchableOpacity>
	</View>
}

const styles = StyleSheet.create({
	left: {},
	middle: {
		flex: 1,
		height: 80,
		marginLeft: 10,
		marginRight: 20,
		justifyContent: 'space-between',
	},
	right: {
		marginRight: 20
	},
});
