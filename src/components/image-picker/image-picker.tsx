import React, {useEffect, useState} from 'react';
import {Image, View, Text, TouchableOpacity} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';

import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';

const ImagePicker = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showBox, setShowBox] = useState(false);
  const {uid} = useSelector((state: RootState) => state.auth);

  const handleBox = () => {
    setShowBox(!showBox);
  };

  const handleImagePicked = async (uri: any | null) => {
    if (uri) {
      const imageUrl = await uploadImage(uri, uid);
      console.log('Uploaded image URL:', imageUrl);
      if (imageUrl) {
        await saveImageUrlToUser(uid, imageUrl);
        setShowBox(false);
      }
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.3 as PhotoQuality,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
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
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri ?? null);
        await handleImagePicked(uri);
      }
    });
  };

  const saveImageUrlToUser = async (uid: string, imageUrl: string) => {
    try {
      await database()
        .ref(`users/${uid}`)
        .update({
          profileImageUrl: imageUrl,
        })
        .then(async () => {
          const promiseArr: Promise<FirebaseDatabaseTypes.DataSnapshot>[] = [];
          const conectionRef = database().ref(`users/${uid}/connections`);
          const allSnap = await conectionRef.once('value');
          allSnap.forEach(snap => {
            if (snap !== null) {
              if (snap.exists()) {
                fetchPromise(snap, promiseArr);
              }
            }
            return undefined;
          });

          const promiseResponse = await Promise.all(promiseArr);
          promiseResponse.forEach(res => {
            const chatId = res.val() ? Object.keys(res.val()) : '';
            chatId
              ? res.ref.child(chatId[0]).update({image: imageUrl})
              : undefined;
          });
        });
      console.log('Image URL saved successfully');
    } catch (error) {
      console.error('Failed to save image URL:', error);
    }
  };

  const fetchPromise = (
    snap: any,
    promises: Promise<FirebaseDatabaseTypes.DataSnapshot>[],
  ) => {
    const secondUserId = snap.child('secondUser').val();
    const socondConectionRef = database().ref(
      `users/${secondUserId}/connections`,
    );
    const allSecondUser = socondConectionRef
      .orderByChild('secondUser')
      .equalTo(uid)
      .once('value');

    promises.push(allSecondUser);
  };

  const uploadImage = async (uri: string, uid: string) => {
    if (!uri) return null;
    console.log(uri);

    const timestamp = Date.now();
    const filename = `${uid}_${timestamp}_${uri.split('/').pop()}`;

    //const filename = `${uri.split('/').pop()}`;
    console.log(filename, 'filename');
    const reference = storage().ref(`file/${uid}/${filename}`);
    console.log(reference, 'reference');

    const task = reference.putFile(uri);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    console.log(task, 'task');

    try {
      await task;
      const url = await reference.getDownloadURL();
      console.log(url);
      return url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      const snapshot = await database().ref(`users/${uid}`).once('value');
      const data = snapshot.val();
      if (data && data.profileImageUrl) {
        setImageUri(data.profileImageUrl);
        console.log(data.profileImageUrl);
      }
    };

    fetchImage();
  }, [uid]);

  return (
    <View
      style={{
        marginTop: 10,
        width: 200,
        height: 200,
        borderRadius: 110,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
      }}>
      <Image
        source={
          imageUri
            ? {uri: imageUri}
            : require('../../assets/list-images/man1.png')
        }
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          zIndex: 10000,
        }}
      />

      <TouchableOpacity
        onPress={handleBox}
        style={{
          position: 'absolute',
          bottom: 5,
          alignSelf: 'center',
          padding: 5,
          zIndex: 10000,
        }}>
        <Ionicons name="camera" size={50} color={'white'} />
      </TouchableOpacity>
      {showBox && (
        <View
          style={{
            width: 300,
            height: 200,
            borderRadius: 20,
            zIndex: 100000,
            marginTop: 10,
            backgroundColor: 'white',
            position: 'absolute',
            top: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}>
          <Text style={{fontSize: 18, marginBottom: 10, fontWeight: 'bold'}}>
            Upload Image less than 1MB
          </Text>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              marginBottom: 10,
              alignItems: 'center',
              zIndex: 20000,
              height: 48,
              padding: 10,
              backgroundColor: 'blue',
              marginHorizontal: 10,
              borderRadius: 10,
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={pickImage}>
            <Text style={{fontSize: 18, color: 'white'}}>Pick an Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 48,
              padding: 10,
              backgroundColor: 'blue',
              marginHorizontal: 10,
              borderRadius: 10,
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={captureImage}>
            <Text style={{fontSize: 18, color: 'white'}}>Capture an Image</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImagePicker;
