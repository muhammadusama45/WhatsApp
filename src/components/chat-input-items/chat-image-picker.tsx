import React, {useEffect, useState} from 'react';
import {Image, View, Text, TouchableOpacity} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

interface IProps {
  currentChatId: String;
  handleSend: (
    myMessage: string,
    firebaseImageUrl?: string,
    isImage?: boolean,
  ) => Promise<void>;
}

const ChatImagePicker = ({currentChatId, handleSend}: IProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const {uid} = useSelector((state: RootState) => state.auth);

  const handleImagePicked = async (uri: any | null) => {
    if (uri) {
      const imageUrl = await uploadImage(uri, uid);

      if (imageUrl) {
        handleSend('', imageUrl, true);
      }
    }
  };
  const uploadImage = async (uri: string, uid: string) => {
    if (!uri) return null;
    //('uri ====> ', uri);
    //('currentChatId ====> ', currentChatId);
    console.log('uri=>>>>>>>>>', uri);

    const filename = `${uri.split('/').pop()}`;

    console.log(filename, 'filename');
    const reference = storage().ref(`${filename}`);
    //(reference, 'reference');

    const task = reference.putFile(uri);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    //(task, 'task');

    try {
      await task;
      const url = await reference.getDownloadURL();
      await downloadAndCacheImage(url, `${filename}`);
      console.log('urlllllllll=>>>>', url);
      //(url);
      return url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  };

  const downloadAndCacheImage = async (imageUrl: any, filename: any) => {
    try {
      const splitPath = imageUrl
        .substring(imageUrl.lastIndexOf('-'))
        .split('-')[1];
      console.log('splitPath', splitPath);
      const filePath = `${RNFS.DocumentDirectoryPath}/${splitPath}.jpg`;
      console.log('filePath', filePath);

      const fileExists = await RNFS.exists(filePath);
      console.log('fileExists', fileExists);
      if (!fileExists) {
        RNFS.downloadFile({
          fromUrl: imageUrl,
          toFile: filePath,
        }).promise.then(() => {});
      }

      return `file://${filePath}`;
    } catch (error) {
      console.error('Error caching image locally:', error);
      return imageUrl;
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.3 as PhotoQuality,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        //('User cancelled image picker');
      } else if (response.errorCode) {
        //('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri ?? null);
        await handleImagePicked(uri);
      }
    });
  };

  const captureImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.3 as PhotoQuality,
    };

    launchCamera(options, async response => {
      if (response.didCancel) {
        //('User cancelled image picker');
      } else if (response.errorCode) {
        //('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri ?? null);
        await handleImagePicked(uri);
      }
    });
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => {}}>
        <MaterialCommunityIcons
          name="paperclip"
          color={'black'}
          size={30}
          style={{marginRight: 10}}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={pickImage}>
        <MaterialIcons
          name="insert-photo"
          color={'black'}
          size={30}
          style={{marginRight: 10}}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={captureImage}>
        <MaterialCommunityIcons
          name="camera-image"
          color={'black'}
          size={30}
          style={{marginRight: 20}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatImagePicker;
