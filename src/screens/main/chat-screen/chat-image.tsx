import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';

interface IMessage {
  id: string;
  text: string;
  senderUid: string;
  timeStamp: any;
  timeDay: any;
  receiverUid: string;
  status: string;
  keyId: string;
}
interface IProps {
  item: IMessage;
  chatId: string;
  isSender: boolean;
}

const ChatImage = ({item, chatId, isSender}: IProps) => {
  const [localImagePath, setLocalImagePath] = useState<string | null>(null);

  const splitPath = item.text
    .substring(item.text.lastIndexOf('-'))
    .split('-')[1];
  const filename = `${RNFS.DocumentDirectoryPath}/${splitPath}.jpg`;

  const {uid} = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (isSender) {
      downloadAndCacheImage();
    }
  }, []);

  const downloadAndCacheImage = async () => {
    try {
      const splitPath = item.text
        .substring(item.text.lastIndexOf('-'))
        .split('-')[1];
      const filePath = `${RNFS.DocumentDirectoryPath}/${splitPath}.jpg`;
      console.log(splitPath);
      console.log(filePath);

      const fileExists = await RNFS.exists(filePath);
      console.log(filePath);

      if (!fileExists) {
        RNFS.downloadFile({
          fromUrl: item.text,
          toFile: filePath,
        }).promise.then(() => {
          setLocalImagePath(`file://${filePath}`);
        });
      }
      console.log(filePath);
    } catch (error) {
      console.error('Error caching image locally:', error);
    }
  };
  useEffect(() => {
    const checkCachedImage = async () => {
      const splitPath = item.text
        .substring(item.text.lastIndexOf('-'))
        .split('-')[1];
      const filePath = `${RNFS.DocumentDirectoryPath}/${splitPath}.jpg`;

      const fileExists = await RNFS.exists(filePath);

      if (fileExists) {
        setLocalImagePath(`file://${filePath}`);
      }
    };

    checkCachedImage();
  }, [item.text]);

  return (
    <>
      {filename && (
        <View>
          {localImagePath ? (
            <Image
              source={{
                uri: localImagePath ?? (localImagePath || item.text),
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginVertical: 5,
                //backgroundColor: 'red',
              }}
            />
          ) : (
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginVertical: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {uid === item.receiverUid && (
                <Image
                  blurRadius={10}
                  source={{
                    uri: item.text,
                  }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 10,
                    marginVertical: 5,
                    //backgroundColor: 'red',
                  }}
                />
              )}
              {uid === item.senderUid && (
                <ActivityIndicator
                  size={'small'}
                  color={'white'}></ActivityIndicator>
              )}
            </View>
          )}
          {uid === item.receiverUid && !localImagePath && (
            <>
              {/* <Image
                blurRadius={100}
                source={{
                  uri: item.text,
                }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 10,
                  marginVertical: 5,
                  //backgroundColor: 'red',
                }}
              /> */}
              <TouchableOpacity
                onPress={downloadAndCacheImage}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                  width: 60,
                  borderRadius: 30,
                  borderWidth: 2,
                  position: 'absolute',
                  left: 70,
                  top: 90,
                }}>
                <MaterialCommunityIcons name="download" size={50} />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </>
  );
};

export default ChatImage;
