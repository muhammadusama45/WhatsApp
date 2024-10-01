import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import _ from 'lodash';
import moment from 'moment';
import React, {memo, useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {navigate} from '../../../../root-navigation';
import Topbar from '../../../components/topbar/topbar';
import {clearChat} from '../../../redux/slice/auth/chat-slice';
import {
  clearInbox,
  setRemovedChat,
  setSingleChat,
  setSingleChatForNameandImage,
  setVisibleData,
} from '../../../redux/slice/auth/inbox-slice';
import {RootState} from '../../../redux/store';
import {styles} from './styles';

interface ChatMessage {
  name: string;
  text: string;
  timeStamp: number;
  receiverUid: string;
  senderUid: string;
}

interface ChatRoom {
  lastmsgtime: number;
  lastmessagekey: string;
  lastmsg: string;
  lastmsgsender: string;
  chatID: string;
  lastreceiverUid: string;
}

interface Chat {
  [key: string]: {
    messages: {[key: string]: ChatMessage};
    chatRoom: {[key: string]: ChatRoom};
  };
}

interface ChatItem {
  id: string;
  name: string;
  lastMsg: string;
  lastTime: any;
  secondUser: string;
  image: any;
  chatVisible: number;
  unreadCount: number;
}

interface User {
  name: string;
  image: string;
}

interface IProps {
  navigation?: any;
}

const InboxScreen = memo(({}: IProps) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {uid, name} = useSelector((state: RootState) => state.auth);
  const {visibleData} = useSelector((state: RootState) => state.inbox);
  const [longPressedItemId, setLongPressedItemId] = useState<ChatItem>();
  const currentUserUid = uid;
  const dispatch = useDispatch();

  const inboxRef = database()
    .ref(`users/${uid}`)
    .child('connections')
    .orderByChild('lastmsgtime');

  const inboxNameRef = database()
    .ref(`users/${uid}`)
    .child('connections')
    .orderByChild('chatName');

  const inboxRemoveRef = database()
    .ref(`users/${uid}`)
    .child('connections')
    .orderByChild('isRemove');

  useEffect(() => {
    dispatch(clearInbox());
    fetchChats(page);

    return () => {
      inboxRef?.off();
    };
  }, []);

  const inboxMapper = (
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
  ): Array<ChatItem> => {
    const chatList: Array<ChatItem> = [];
    snapshot?.forEach(childSnapshot => {
      if (childSnapshot.child('isRemove').val() == false) {
        chatList.unshift(inboxObject(childSnapshot));
        return undefined;
      }
    });
    return chatList;
  };

  const inboxObject = (childSnapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    return {
      id: childSnapshot.key ?? '',
      name: childSnapshot.child('chatName').val(),
      lastMsg: childSnapshot.child('lastmsg').val(),
      lastTime: moment(childSnapshot.child('lastmsgtime').val()).format(
        'hh:mm A',
      ),
      secondUser: childSnapshot.child('secondUser').val(),
      image: childSnapshot.child('image').val(),
      chatVisible: childSnapshot.child('chatVisible').val(),
      unreadCount: childSnapshot.child('unreadCount').val(),
    };
  };

  const fetchChats = async (pageNumber: number) => {
    setLoading(true);
    try {
      let chatList: Array<ChatItem> = [];
      await inboxRef.once('value').then(snapshot => {
        if (snapshot?.exists()) {
          chatList = inboxMapper(snapshot);
          dispatch(setVisibleData(_.uniqBy([...chatList], 'id')));
        }
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
    inboxRef.limitToLast(1).on('child_added', async snapshot => {
      if (snapshot?.exists() && snapshot.child('isRemove').val() == false) {
        dispatch(setSingleChat(inboxObject(snapshot)));
      }
    });
    inboxRef.on('child_changed', async snapshot => {
      if (snapshot?.exists() && snapshot.child('isRemove').val() == false) {
        const newChat = inboxObject(snapshot);
        dispatch(setSingleChat(inboxObject(snapshot)));
      }
    });

    inboxNameRef.on('child_changed', snapshot => {
      if (snapshot?.exists() && snapshot.child('isRemove').val() == false) {
        dispatch(setSingleChatForNameandImage(inboxObject(snapshot)));
      }
    });
    inboxRemoveRef.on('child_changed', snapshot => {
      if (snapshot?.exists() && snapshot.child('isRemove').val() == true) {
        dispatch(setRemovedChat(inboxObject(snapshot)));
      }
    });
  };

  const loadMoreChats = () => {
    if (hasMore && !loading) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = ({item}: {item: ChatItem}) => {
    const recipientUid = item.secondUser;

    const onLong = () => {
      console.log(item);
      if (item) {
        setLongPressedItemId(item);
      }
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.mainView}
        onLongPress={onLong}
        onPress={() => {
          dispatch(clearChat([]));

          navigate('Chat', {
            chatName: item.name,
            imageIcon: item.image,
            currentUserUId: currentUserUid,
            recipientUid: recipientUid,
            chatId: item.id,
            chatVisible: item.chatVisible,
          });
        }}>
        <View style={{width: 48, height: 48, borderRadius: 24, zIndex: 500}}>
          <Image
            source={
              item.image
                ? {uri: item.image}
                : require('../../../assets/list-images/man1.png')
            }
            style={{width: 48, height: 48, borderRadius: 24}}
          />
        </View>

        <View style={{flex: 1, zIndex: 500}}>
          <View style={styles.row}>
            <Text style={styles.nameText}>{item.name}</Text>
            {item.lastTime != 'Invalid date' && item.lastMsg != '' && (
              <Text style={styles.timeText}>{item.lastTime}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.messageText} numberOfLines={1}>
              {item.lastMsg}
            </Text>

            {item?.unreadCount > 0 && (
              <View
                style={{
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  backgroundColor: 'red',
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const clearMessages = async (chat: ChatItem) => {
    try {
      await database()
        .ref(`users/${uid}/connections`)
        .child(`${uid}_${chat.secondUser}`)
        .update({
          chatVisible: database.ServerValue.TIMESTAMP,
          lastmsg: '',
          unreadCount: 0,
        });
      console.log('Message Cleared');
      setLongPressedItemId(undefined);
    } catch (error) {
      console.error('Error clearing messages:', error);
      throw error;
    }
  };

  const deleteChat = async (chat: ChatItem) => {
    try {
      await clearMessages(chat);
      setTimeout(() => {
        database()
          .ref(`users/${uid}/connections`)
          .child(`${uid}_${chat.secondUser}`)
          .update({isRemove: true});
      }, 1000);
      setLongPressedItemId(undefined);
    } catch (error) {
      console.error('Error deleting Message', error);
      throw error;
    }
  };

  const closeLongPress = () => {
    setLongPressedItemId(undefined);
  };

  return (
    <View style={styles.container}>
      <Topbar text="Inbox" />

      {longPressedItemId && (
        <View
          style={{
            width: 300,
            height: 200,
            borderRadius: 20,
            //marginTop: 10,
            backgroundColor: 'white',
            position: 'absolute',
            alignSelf: 'center',
            top: '40%',
            //justifyContent: 'center',
            //alignItems: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.8,
            shadowRadius: 2,
            zIndex: 10000,
          }}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              //backgroundColor: 'green',
              padding: 10,
            }}
            onPress={closeLongPress}>
            <AntDesign name="closecircleo" size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              clearMessages(longPressedItemId);
            }}
            style={{
              backgroundColor: 'blue',
              padding: 10,
              borderRadius: 10,
              alignSelf: 'center',
              marginBottom: 10,
            }}>
            <Text style={{color: 'white', fontSize: 18}}>Clear Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteChat(longPressedItemId)}
            style={{
              backgroundColor: 'blue',
              padding: 10,
              borderRadius: 10,
              alignSelf: 'center',
            }}>
            <Text style={{color: 'white', fontSize: 18}}>Delete chat</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={visibleData}
        renderItem={renderItem}
        keyExtractor={item => item.id ?? ''}
        onEndReached={loadMoreChats}
        onEndReachedThreshold={0.5}
      />

      <TouchableOpacity
        onPress={() => {
          navigate('Contacts');
        }}
        style={styles.fab}>
        <AntDesign name="contacts" size={30} color={'white'} />
      </TouchableOpacity>
    </View>
  );
});

export default InboxScreen;
