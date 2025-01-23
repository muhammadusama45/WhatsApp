import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import RNFS from 'react-native-fs';
import {RootState} from '../../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {setLocalImage} from '../../../redux/slice/auth/inbox-slice';

interface ChatItem {
  image: string;
  secondUser: string;
  id: string;
}

interface InboxImage {
  item: ChatItem;
}

const InboxImage = ({item}: InboxImage) => {
  const [localImagePath, setLocalImagePath] = useState<string | null>(null);

  const {uid} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (item?.image.includes('https://')) {
      downloadAndCacheImage();
    }
  }, [item.image]);
  const downloadAndCacheImage = async () => {
    try {
      const splitPath = item.image
        .substring(item.image.lastIndexOf('-'))
        .split('-')[1];
      const filePath = `${RNFS.DocumentDirectoryPath}/${splitPath}.jpg`;

      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        await RNFS.downloadFile({
          fromUrl: item.image,
          toFile: filePath,
        }).promise;
        setLocalImagePath(`file://${filePath}`);
        dispatch(setLocalImage({url: `file://${filePath}`, id: item.id}));
        console.log(filePath, 'Inbox file path');
      } else {
        setLocalImagePath(`file://${filePath}`);
        dispatch(setLocalImage({url: `file://${filePath}`, id: item.id}));
      }
    } catch (error) {
      console.error('Error caching image locally:', error);
    }
  };

  return (
    <>
      {localImagePath && (
        <Image
          source={
            localImagePath
              ? {uri: localImagePath}
              : require('../../../assets/list-images/man1.png')
          }
          style={{width: 48, height: 48, borderRadius: 24}}
        />
      )}
    </>
  );
};

export default InboxImage;
