import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import Topbar from '../../../components/topbar/topbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import {navigate} from '../../../../root-navigation';
import _ from 'lodash';
import {RootState} from '../../../redux/store';
import {
  clearInbox,
  setSingleChat,
  setSingleChatForNameandImage,
  setVisibleData,
} from '../../../redux/slice/auth/inbox-slice';
import moment from 'moment';
import {clearChat} from '../../../redux/slice/auth/chat-slice';
import {Icon} from 'react-native-paper';

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
}

interface User {
  name: string;
  image: string;
}

interface IProps {
  navigation: any;
}

const InboxScreen = memo(({}: IProps) => {
  // const [visibleData, setVisibleData] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {uid, name} = useSelector((state: RootState) => state.auth);
  const {visibleData} = useSelector((state: RootState) => state.inbox);
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

  // const imageRef = database()
  //   .ref(`user/${uid}`)
  //   .child('connections')
  //   .orderByChild('image');

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
      chatList.unshift(inboxObject(childSnapshot));
      return undefined;
    });
    return chatList;
  };

  const inboxObject = (childSnapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    //console.log(childSnapshot, 'jsjnfjdsff');

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
    inboxRef.limitToLast(1).on('child_added', snapshot => {
      if (snapshot?.exists()) {
        dispatch(setSingleChat(inboxObject(snapshot)));
      }
    });
    inboxRef.limitToLast(1).on('child_changed', snapshot => {
      if (snapshot?.exists()) {
        dispatch(setSingleChat(inboxObject(snapshot)));
      }
    });
    inboxNameRef.on('child_changed', snapshot => {
      if (snapshot?.exists()) {
        dispatch(setSingleChatForNameandImage(inboxObject(snapshot)));
      }
    });
    //   imageRef.on('child_changed', snapshot =>
    //     {
    //     if (snapshot?.exists()) {
    //       dispatch(setSingleChatForName(inboxObject(snapshot)));
    //     }
    //   }
    // );
  };

  const loadMoreChats = () => {
    if (hasMore && !loading) {
      setLoading(true);
      setPage(prevPage => prevPage + 1);
    }
  };

  //const key = database().ref(`chats/${ch}`).child('connections')
  const [longPressedItemId, setLongPressedItemId] = useState<ChatItem>();

  const renderItem = ({item}: {item: ChatItem}) => {
    const recipientUid = item.secondUser;
    // const userRef1 = `${uid}_${recipientUid}`;
    // const userRef2 = `${recipientUid}_${uid}`;
    // const chatRoomRef1 = database().ref(`chats/${userRef1}/`);
    // const chatRoomRef2 = database().ref(`chats/${userRef2}/`);

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
            // messages: item.message,
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
            <Text style={styles.timeText}>{item.lastTime}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.messageText} numberOfLines={1}>
              {item.lastMsg}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={'black'}
              size={25}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const deleteChat = (chat: ChatItem) => {
    database()
      .ref(`users/${uid}/connections`)
      .child(`${uid}_${chat.secondUser}`)
      .update({chatVisible: database.ServerValue.TIMESTAMP});
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
              deleteChat(longPressedItemId);
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
            //onPress={handleSaveName}
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
        onEndReached={loadMoreChats} // Trigger load more on end reached
        onEndReachedThreshold={0.5} // Adjust the threshold as needed

        // ListFooterComponent={() =>
        //   loading ? <Text style={styles.loadingText}>Loading.....</Text> : null
        // }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    zIndex: 500,
  },
  listContainer: {
    zIndex: 500,
    padding: 10,
  },
  mainView: {
    zIndex: 500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 10,
    shadowRadius: 5.5,
    shadowOpacity: 0.32,
  },
  row: {
    zIndex: 500,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: 'grey',
  },
  messageText: {
    fontSize: 16,
    color: 'black',

    flex: 1,
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
  },
  fab: {
    backgroundColor: 'blue',
    height: 60,
    width: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
