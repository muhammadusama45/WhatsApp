import React, {memo, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';

import {styles} from './styles';
import {useSelector, useDispatch} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  increment,
  decrement,
  start,
  stop,
  reset,
  ticking,
} from '../../../redux/slice/main/counter-slice/counter-slice';
import {RootState} from '../../../redux/store';
import auth from '@react-native-firebase/auth';
import {Logout} from '../../../redux/slice/auth/auth-slice';
import ImagePicker from '../../../components/image-picker/image-picker';
import {updateName} from '../../../redux/slice/auth/auth-slice';
import {goBack, navigate} from '../../../../root-navigation';

interface IProps {
  navigation: any;
  route: any;
}

const ProfileScreen = memo(({navigation, route}: IProps) => {
  const {name, uid} = useSelector((state: RootState) => state.auth);
  const [showBox, setShowBox] = useState(false);
  const [newName, setNewName] = useState(name);

  const updateNamefirebase = async (newName: string, uid: string) => {
    try {
      await database()
        .ref(`users/${uid}/`)
        .update({
          name: newName,
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
              ? res.ref.child(chatId[0]).update({chatName: newName})
              : undefined;
          });
        });

      console.log('new name saved successfully');
    } catch (error) {
      console.error('Failed to save new name:', error);
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

  const handleSaveName = () => {
    if (uid) {
      updateNamefirebase(newName, uid)
        .then(() => {
          dispatch(updateName(newName));
          setShowBox(false);
        })
        .catch(error => {
          console.error('Failed to update name:', error);
        });
    } else {
      console.error('User ID is not available');
    }
  };

  const handleBox = () => {
    setShowBox(!showBox);
  };

  //console.log('authdata---', authdata);

  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await auth().signOut();
      dispatch(Logout({}));
      console.log('User signed out!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // const {value, seconds, isRunning} = useSelector(
  //   (state: RootState) => state.counter,
  // );

  // useEffect(() => {
  //   if (isRunning) {
  //     let interval = setInterval(() => {
  //       dispatch(ticking());
  //     }, 1000);
  //     return () => {
  //       if (interval) clearInterval(interval);
  //     };
  //   }
  // });

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View>
        <Topbar navigation={navigation} route={route} />
        <ImagePicker />

        <TouchableOpacity
          onPress={handleBox}
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            // flex: 1,
            //backgroundColor: 'green',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
            {name} is Logged In!
          </Text>
          <AntDesign name="edit" size={35} style={{marginLeft: 5}} />
        </TouchableOpacity>
        {showBox && (
          <View
            style={{
              width: 300,
              height: 200,
              borderRadius: 20,
              //marginTop: 10,
              backgroundColor: 'white',
              position: 'absolute',
              alignSelf: 'center',
              top: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.8,
              shadowRadius: 2,
              zIndex: 999,
            }}>
            <View
              style={{
                justifyContent: 'center',
                backgroundColor: '#fff',
                paddingHorizontal: 10,
                height: 48,
                width: '80%',
                marginBottom: 10,
                marginHorizontal: 10,
                borderRadius: 10,
                //fontSize: 20,
                //fontWeight:"bold",
                shadowColor: 'black',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 2,
              }}>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                placeholder="Enter your new name"
                style={{marginHorizontal: 10}}
              />
            </View>

            <TouchableOpacity
              onPress={handleSaveName}
              style={{
                backgroundColor: 'blue',
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{color: 'white'}}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={{fontSize: 18, color: 'white'}}>Logout</Text>
      </TouchableOpacity>

      {/* <View>
        <Text>{value}</Text>

        <Button
          title="increment"
          onPress={() => dispatch(increment())}></Button>
        <Button
          title="decrement"
          onPress={() => dispatch(decrement())}></Button>

        <Text>Timer:{seconds}</Text>

        <Button title="Start" onPress={() => dispatch(start())}></Button>
        <Button title="Stop" onPress={() => dispatch(stop())}></Button>
        <Button title="Reset" onPress={() => dispatch(reset())}></Button>
      </View> */}
    </View>
  );
});

export default ProfileScreen;

const Topbar = ({navigation, route}: any) => {
  const showBackButton = route?.params?.fromContactScreen ?? false;
  return (
    <View style={stylestop.container}>
      {showBackButton && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            //backgroundColor: 'green',
            flexDirection: 'row',
          }}>
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color="white"
            style={stylestop.icon}
          />
        </TouchableOpacity>
      )}

      <Text style={[showBackButton ? stylestop.text : stylestop.text2]}>
        Profile
      </Text>
    </View>
  );
};

const stylestop = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 20,
    flex: 1,
    //backgroundColor: 'red',
    fontWeight: 'bold',
    color: 'white',
    paddingRight: 30,
    marginHorizontal: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  text2: {
    fontSize: 20,
    flex: 1,
    //backgroundColor: 'red',
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  icon: {
    height: 30,
    width: 30,
  },
});
