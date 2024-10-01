import React, {memo, useEffect, useRef, useState} from 'react';
import database, {
  child,
  firebase,
  FirebaseDatabaseTypes,
} from '@react-native-firebase/database';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
} from 'react-native';
import {Formik} from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/store';
import _ from 'lodash';
import moment from 'moment';
import {
  addAllMessage,
  addMessage,
  clearChat,
  updateMessage,
} from '../../../redux/slice/auth/chat-slice';
import uuid from 'react-native-uuid';
import {useIsFocused} from '@react-navigation/native';

interface IMessage {
  id: string;
  text: string;
  senderUid: string;
  timeStamp: any;
  receiverUid: string;
  status: string;
  keyId: string;
}
interface chatRoom {
  lastmsgtime: any;
  lastmsg: string;
  chatName: string;
  secondUser: string;
  image: any;
  chatVisible?: number;
  isRemove: boolean;
  unreadCount?: number;
  // senderImage: any;
  // receiverImage: any;
}

interface IProps {
  route: any;
  navigation: any;
}

//React.FC used for type checking of props
//route.params used for passing data between screens
//memo prevents from re renderinng except which props have changed

const Chatscreen: React.FC<IProps> = memo(({route, navigation}: IProps) => {
  const {
    chatName,
    imageIcon,
    recipientUid,
    currentUserUId,
    chatVisible,
    fromContact,
    chatId,
  } = route.params;
  const [isMessageSent, setIsMessageSent] = useState<boolean>(true);
  const [displayText, setDisplayText] = useState<IMessage[]>([]);
  const {name} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const {allMessages} = useSelector((state: RootState) => state.chat);
  const isFocused = useIsFocused();

  const userRef1 = `${currentUserUId}_${recipientUid}`;
  const userRef2 = `${recipientUid}_${currentUserUId}`;
  const chatRoomRef1 = database().ref(`chats/${userRef1}`);
  const chatRoomRef2 = database().ref(`chats/${userRef2}`);

  const flatListRef = useRef<FlatList<IMessage>>(null);
  // const generateChatId = (uid1: any, uid2: any) => {
  //   return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  // };
  // const chatId = generateChatId(currentUserUId, recipientUid);

  const handleNewMessages = (messages: Array<IMessage>) => {
    dispatch(addAllMessage(messages));
  };
  const AddNewMessages = (message: any) => {
    dispatch(addMessage(message));
  };
  const AddUpdateMessages = (message: any) => {
    dispatch(updateMessage(message));
  };

  const chatObj = (childSnapshot: FirebaseDatabaseTypes.DataSnapshot) => {
    return {
      id: childSnapshot.child('id').val(),
      text: childSnapshot.child('text').val(),
      senderUid: childSnapshot.child('senderUid').val(),
      timeStamp: moment(childSnapshot.child('timeStamp').val()).format(
        'hh:mm A',
      ),
      receiverUid: childSnapshot.child('receiverUid').val(),
      status: childSnapshot.child('status').val(),
      keyId: childSnapshot.key ?? '',
    };
  };
  const chatRef = database().ref(`chats/${userRef1}`);
  const chatRef2 = database().ref(`chats/${userRef2}`);

  const chatMapper = (
    snapshot: FirebaseDatabaseTypes.DataSnapshot,
  ): Array<IMessage> => {
    const chatList: Array<IMessage> = [];
    snapshot?.forEach(childSnapshot => {
      chatList.unshift(chatObj(childSnapshot));
      return undefined;
    });
    return chatList;
  };

  const readCount = () => {
    database()
      .ref('users')
      .child(currentUserUId)
      .child('connections')
      .child(chatId)
      .child('unreadCount')
      .set(0);
  };

  useEffect(() => {
    const messagesRef = database().ref(`chats/${userRef1}`);
    const messagesRef2 = database().ref(`chats/${userRef2}`);
    if (!fromContact) {
      readCount();
    }
    messagesRef
      .orderByChild('timeStamp')
      .startAt(chatVisible ?? null)
      .once('value', snapshot => {
        if (snapshot?.exists()) {
          handleNewMessages(chatMapper(snapshot));
        } else {
          messagesRef2
            .orderByChild('timeStamp')
            .startAt(chatVisible ?? null)
            .once('value', snapshot => {
              if (snapshot?.exists()) {
                handleNewMessages(chatMapper(snapshot));
              }
            });
        }
        messagesRef
          ?.orderByChild('timeStamp')
          .startAt(chatVisible ?? null)
          .limitToLast(1)
          .on('child_added', snap => {
            if (snap?.exists()) {
              if (snap.child('senderUid').val() == currentUserUId) {
                AddUpdateMessages(chatObj(snap));
              } else {
                AddNewMessages(chatObj(snap));
                liveMessageStatusUpdate(chatObj(snap), userRef1);
              }
            }
          });

        messagesRef2
          ?.orderByChild('timeStamp')
          .startAt(chatVisible ?? null)
          .limitToLast(1)
          .on('child_added', snap => {
            if (snap?.exists()) {
              if (snap.child('senderUid').val() == currentUserUId) {
                AddUpdateMessages(chatObj(snap));
              } else {
                AddNewMessages(chatObj(snap));
                liveMessageStatusUpdate(chatObj(snap), userRef2);
              }
            }
          });
      });
    return () => {
      if (!fromContact) {
        readCount();
      }
      dispatch(clearChat([]));
      messagesRef.off();
      messagesRef2?.off();
    };
  }, []);

  const handleSend = async (myMessage: string) => {
    //trim() removes white spaces from the beginnig and endinng of the string thus prevents from sending blank messages
    //=== strict equality operator used to compare two values it will return true if both have same value and have same type otherwise it will false
    if (myMessage.trim() === '') return;
    const senderSnapshot = await database()
      .ref(`users/${currentUserUId}`)
      .once('value');
    const receiverSnapshot = await database()
      .ref(`users/${recipientUid}`)
      .once('value');

    const senderImage = senderSnapshot.val()?.profileImageUrl || '';
    const receiverImage = receiverSnapshot.val()?.profileImageUrl || '';
    const messageRef1 = database()
      .ref(`users/${currentUserUId}/connections`)
      .child(userRef1);
    const messageRef2 = database()
      .ref(`users/${recipientUid}/connections`)
      .child(userRef2);

    //Purpose: This line creates a new message object that will be added to the list of messages.
    //id: Date.now().toString(): Generates a unique identifier for the message using the used for creating unnique ids an than converted into sting
    //current timestamp (in milliseconds). This ensures that each message has a distinct ID.
    //text: myMessage: Sets the content of the message to the current value of myMessage.

    const newMessage: any = {
      id: uuid.v4().toString(),
      chatId: currentUserUId ? chatRef.key : recipientUid ? chatRef2.key : null,
      timeStamp: firebase?.database?.ServerValue?.TIMESTAMP,
      text: myMessage,
      senderUid: currentUserUId,
      receiverUid: recipientUid,
      status: 'true',
    };
    const chatRoomSender: chatRoom = {
      lastmsgtime: firebase?.database?.ServerValue?.TIMESTAMP,
      lastmsg: myMessage,
      chatName: chatName,
      secondUser: recipientUid,
      image: receiverImage,
      isRemove: false,
    };
    const chatRoomReceiver: chatRoom = {
      lastmsgtime: firebase?.database?.ServerValue?.TIMESTAMP,
      lastmsg: myMessage,
      chatName: name,
      secondUser: currentUserUId,
      image: senderImage,
      isRemove: false,
      unreadCount: 1,
    };

    AddNewMessages({
      ...newMessage,
      timeStamp: moment(new Date()).format('hh:mm A'),
      status: 'false',
    });

    messageRef1.once('value').then(snap => {
      if (snap.exists()) {
        messageRef1.child('lastmsg').set(myMessage);
        // if (fromContact) {
        messageRef1.child('isRemove').set(false);
        // }
        messageRef1
          .child('lastmsgtime')
          .set(firebase?.database?.ServerValue?.TIMESTAMP);
        messageRef2.once('value').then(snap => {
          if (snap.exists()) {
            messageRef2.child('lastmsg').set(myMessage);
            messageRef2
              .child('unreadCount')
              .set(snap.child('unreadCount').val() + 1);
            // if (fromContact) {
            messageRef2.child('isRemove').set(false);
            // }
            messageRef2
              .child('lastmsgtime')
              .set(firebase?.database?.ServerValue?.TIMESTAMP);
            updateNewMsg(newMessage);
          } else {
            messageRef2.set(chatRoomReceiver).then(res => {
              updateNewMsg(newMessage);
            });
          }
        });
      } else {
        messageRef1.set(chatRoomSender).then(() => {
          messageRef2.once('value').then(snap => {
            if (snap.exists()) {
              messageRef2.child('lastmsg').set(myMessage);
              messageRef2
                .child('unreadCount')
                .set(snap.child('unreadCount').val() + 1);
              // if (fromContact) {
              messageRef2.child('isRemove').set(false);
              // }
              messageRef2
                .child('lastmsgtime')
                .set(firebase?.database?.ServerValue?.TIMESTAMP);
              updateNewMsg(newMessage);
            } else {
              messageRef2.set(chatRoomReceiver).then(res => {
                updateNewMsg(newMessage);
              });
            }
          });
        });
      }
    });
    setIsMessageSent(true);
    //update the list of messages with new messages
    //prevMessages => [newMessage, ...prevMessages]:
    // The callback function passed to setDisplayText receives the previous state (prevMessages).
    //It creates a new array where the new message (newMessage) is added at the beginning of the list,
    //followed by the previous messages.
    //...spreadOperator(used for copying and merging of arrays and objects)
    //Arrays: Unpacks or spreads elements of an array into another array.
    //Objects: Unpacks or spreads properties of an object into another object.
    //...prevMessages: The spread operator takes all elements of the
    //prevMessages array and expands them into individual elements within the new array.

    //setDisplayText(prevMessages => [newMessage, ...prevMessages]);

    //this line clears the input field
    // setMyMessage('');
    //console.log('message==>>', myMessage);

    //Purpose: This line ensures that the FlatList component scrolls to the top to show the most recent message.
    //scrollTooffset is a method provided by flatlist component
    //offset:0 means scrolling to the top while animated:true means scroll action will be animated
    //Use Case: This is often used to ensure that the latest message or item in the list is visible when a new item is added
    flatListRef.current?.scrollToOffset({offset: 0, animated: true});
  };

  const updateNewMsg = (newMessage: any) => {
    chatRoomRef1?.once('value')?.then(async snapshot => {
      let messagekey1: any;
      let messagekey2: any;

      if (snapshot?.exists()) {
        messagekey1 = chatRoomRef1?.push();
        messagekey1.set(newMessage).then(() => {});
        console.log(messagekey1, 'key1');
      } else {
        messagekey2 = chatRoomRef2?.push();
        messagekey2.set(newMessage).then(() => {});
        console.log(messagekey2, 'key2');
      }
    });
  };

  const updateMessageStatusToRead = async () => {
    const unreadMessagesSnapshot = await chatRef
      .orderByChild('status')
      .equalTo('true')
      .once('value');

    unreadMessagesSnapshot.forEach(messageSnapshot => {
      if (messageSnapshot.exists()) {
        const messageData = messageSnapshot.val();

        if (messageData.senderUid !== currentUserUId) {
          messageSnapshot.ref.update({status: 'read'});

          const updatedMessage = {
            ...messageData,
            timeStamp: moment(new Date()).format('hh:mm A'),
          };

          dispatch(updateMessage(updatedMessage));
          return undefined;
        }
      }
    });
  };
  const updateMessageStatusToRead2 = async () => {
    const unreadMessagesSnapshot = await chatRef2
      .orderByChild('status')
      .equalTo('true')
      .once('value');

    unreadMessagesSnapshot.forEach(messageSnapshot => {
      if (messageSnapshot.exists()) {
        const messageData = messageSnapshot.val();
        if (messageData.senderUid !== currentUserUId) {
          messageSnapshot.ref.update({status: 'read'});

          const updatedMessage = {
            ...messageSnapshot.val(),
            timeStamp: moment(new Date()).format('hh:mm A'),
          };

          dispatch(updateMessage(updatedMessage));
          return undefined;
        }
      }
    });
  };

  const liveMessageStatusUpdate = async (
    chatObj: IMessage,
    userRef: string,
  ) => {
    const liveMsgRef = database().ref(`chats/${userRef}`);
    liveMsgRef.child(chatObj?.keyId).child('status').set('read');
  };

  const onMessageChanged = (snapshot: any) => {
    const updatedMessage = {
      ...snapshot.val(),
      timeStamp: moment(new Date()).format('hh:mm A'),
    };

    dispatch(updateMessage(updatedMessage));
  };
  useEffect(() => {
    if (isFocused) {
      updateMessageStatusToRead();
      updateMessageStatusToRead2();
      const onChildChanged = chatRef.on('child_changed', onMessageChanged);
      const onChildChanged2 = chatRef2.on('child_changed', onMessageChanged);
      // const onMessageChange = chatRef.on('child_changed', async snapshot => {
      //   const updatedMessage1 = {
      //     ...snapshot.val(),
      //     timeStamp: moment(new Date()).format('hh:mm A'),
      //   };

      //   dispatch(updateMessage(updatedMessage1));
      // });

      // const onMessageChange2 = chatRef2.on('child_changed', async snapshot => {
      //   const updatedMessage2 = {
      //     ...snapshot.val(),
      //     timeStamp: moment(new Date()).format('hh:mm A'),
      //   };

      //dispatch(updateMessage(updatedMessage2));
      return () => {
        chatRef.off('child_changed', onChildChanged);
        chatRef2.off('child_changed', onChildChanged2);
      };
    }
  }, [isFocused, dispatch, userRef1, userRef2]);

  const renderItem = ({item}: {item: IMessage}) => {
    const isSender = item.senderUid === currentUserUId;

    let statusIcon;

    if (item.status === 'false') {
      statusIcon = (
        <EvilIcons style={styles.sendStatus} name="clock" size={20} />
      );
    } else if (item.status === 'true') {
      statusIcon = (
        <Ionicons
          style={styles.sendStatus}
          name="checkmark-outline"
          size={20}
        />
      );
    } else if (item.status === 'read') {
      statusIcon = (
        <Ionicons
          style={styles.sendreadStatus}
          name="checkmark-done-outline"
          size={20}
        />
      );
    }
    return (
      <View
        key={item.id}
        style={[
          styles.messageContainer,
          isSender ? styles.senderMessage : styles.receiverMessage,
        ]}>
        <Text style={[isSender ? styles.sendMessage : styles.receiveMessage]}>
          {item.text}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {item.timeStamp != 'false' && (
            <Text style={[isSender ? styles.sendTime : styles.receiveTime]}>
              {item.timeStamp}
            </Text>
          )}
          <View
            style={{
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isSender && statusIcon}
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons name="arrow-left" color="#fff" size={25} />
          <Image source={{uri: imageIcon}} style={styles.image} />
        </TouchableOpacity>
        <View style={{flex: 1, paddingHorizontal: 10}}>
          <Text
            style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}
            numberOfLines={1}>
            {chatName}
          </Text>
        </View>
      </View>

      <FlatList<any>
        ref={flatListRef}
        data={_.uniqBy(allMessages, 'id')}
        renderItem={renderItem}
        keyExtractor={item => item.id ?? ''}
        inverted
        contentContainerStyle={styles.messagesContainer}
      />

      <Formik
        initialValues={{message: ''}}
        onSubmit={(values, {resetForm}) => {
          resetForm();
          handleSend(values.message);
          setIsMessageSent(false);
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message"
                value={values.message}
                onChangeText={handleChange('message')}
                onBlur={handleBlur('message')}
                multiline={true}
              />
            </View>
            <TouchableOpacity
              disabled={!isMessageSent}
              onPress={() => handleSubmit()}
              style={styles.sendButton}>
              <MaterialCommunityIcons name="send" size={25} color={'white'} />
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    //flexDirection:"row",
    //backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    maxWidth: '70%',
    //alignSelf: 'flex-end',
  },
  senderMessage: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  receiverMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
    color: 'black',
  },

  sendMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  receiveMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  inputWrapper: {
    flexDirection: 'row',
    padding: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    //backgroundColor:'pink',
    maxHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textInput: {
    flex: 1,
    maxHeight: 90,
    paddingHorizontal: 10,
    fontSize: 15,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    height: 48,
    width: 48,
    backgroundColor: 'blue',
    // padding: 5,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sendTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  receiveTime: {
    fontSize: 14,

    fontWeight: '500',

    color: 'black',
  },
  sendStatus: {
    color: 'white',
  },
  receivestatus: {
    color: 'black',
  },
  receivereadstatus: {
    color: 'blue',
  },
  sendreadStatus: {
    color: 'blue',
  },
});

export default Chatscreen;
