import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {navigate, replace} from '../../../../../root-navigation';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import _, {repeat} from 'lodash';
import {SearchBar} from '@rneui/themed';
import auth from '@react-native-firebase/auth';

interface IProps {
  navigation: any;
}
interface IHeader {
  title: string;
  //imgUrl: any;
}

const ContactScreen = memo(({navigation}: IProps) => {
  const [visibledata, setvisibledata] = useState<any[]>([]);
  const [loading, setloading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [currentUserImage, setCurrentUserImage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);
  const ref: FirebaseDatabaseTypes.Reference = database().ref();
  const Query = () => {
    const databaseQuery = ref.child('users').orderByKey().limitToFirst(12);

    if (visibledata?.length > 0)
      return databaseQuery.startAt(visibledata[visibledata?.length - 1]?.id);
    return databaseQuery;
  };

  const fetchUsers = () => {
    Query()
      .once('value')
      .then(snapshot => {
        const users = snapshot.val();
        const paginationData = Object.keys(users).map(key => ({
          id: key,
          name: users[key].name || 'No Name',
          image: users[key].profileImageUrl,
        }));
        if (
          paginationData[paginationData?.length - 1]?.id !=
          visibledata[paginationData?.length - 1]?.id
        ) {
          setvisibledata(_.uniqBy([...visibledata, ...paginationData], 'id'));
        }
        const currentUser = paginationData.find(
          user => user.id === currentUserUid,
        );
        if (currentUser) {
          setCurrentUserImage(currentUser?.image);
        }
        setloading(false);
        setRefresh(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setloading(false);
        setRefresh(false);
      });
    // if (refresh) return;
    // if (visibledata?.length < 10) return;
    // // setloading(true);
    // setRefresh(true);
    // fetchUsers();

    // setTimeout(() => {
    //   const newlength = additionalitems + datalength;
    //   console.log('new length:', newlength);
    //   const newData = array.slice(0, newlength);
    //   setRefresh(false);
    //   setloading(false);
    //   setdatalength(newlength);
    //   setvisibledata(newData);
    // }, 1000);
  };
  const [image, setimage] = useState(null);
  const currentUserUid = auth().currentUser?.uid;
  //console.log(currentUserUid);

  const fetchImage = async (currentUserUid: any) => {
    try {
      const snapshot = await database()
        .ref(`users/${currentUserUid}/profileImageUrl`)
        .once('value');

      if (snapshot.exists()) {
        const imageUrl = snapshot.val();
        return imageUrl;
      } else {
        console.log('No image found');
        return null;
      }
    } catch (error) {
      console.log('error fetching in image', error);
      return null;
    }
  };

  useEffect(() => {
    const getimage = async () => {
      const imageUrl = await fetchImage(currentUserUid);
      console.log(imageUrl);
      setimage(imageUrl);
    };
    getimage();
  }, [currentUserUid]);

  const ContactHeader = ({title}: IHeader) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack('BottomTab');
          }}>
          <Ionicons
            name="arrow-back-outline"
            size={30}
            color="white"
            style={styles.icon}
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.text}>{title}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            replace('Profile', {fromContactScreen: true});
          }}
          style={{
            // backgroundColor: 'red',
            width: 30,
            height: 30,
            borderRadius: 15,
            marginLeft: 10,
          }}>
          <Image
            source={
              image
                ? {uri: image}
                : require('../../../../assets/list-images/man1.png')
            }
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              //backgroundColor: 'green',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        key={item?.id}
        style={styles.mainView}
        onPress={() => {
          console.log();
          database()
            .ref('users')
            .child(currentUserUid ?? '')
            .child('connections')
            .child(`${currentUserUid}_${item.id}`)
            .child('chatVisible')
            .once('value')
            .then(snap => {
              if (snap.exists()) {
                navigate('Chat', {
                  chatName: item.name,
                  imageIcon: item.image,
                  currentUserUId: currentUserUid,
                  recipientUid: item.id,
                  fromContact: true,
                  chatVisible: snap.val(),
                });
              } else {
                navigate('Chat', {
                  chatName: item.name,
                  imageIcon: item.image,
                  currentUserUId: currentUserUid,
                  recipientUid: item.id,
                  fromContact: true,
                });
              }
            });
        }}>
        <Image
          source={
            item.image
              ? {uri: item.image}
              : require('../../../../assets/list-images/man1.png')
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            //  backgroundColor: 'green',
            marginRight: 5,
          }}
        />
        <Text
          numberOfLines={1}
          style={{
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  //The filter method creates a new array with all elements
  //that pass the test implemented by the provided function.
  //lowercase func converts every name to  lowercase to make it case insensitive
  //includes checks item.name converted to lowercase contains the search text.
  const filteredData = visibledata.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ContactHeader title="Contacts" />
      <SearchBar
        placeholder="Search contacts"
        onChangeText={setSearch}
        value={search}
        containerStyle={{
          backgroundColor: 'white',
          marginHorizontal: 10,
          marginVertical: 10,
          borderRadius: 10,
          borderTopWidth: 0,
          justifyContent: 'center',
          borderBottomWidth: 0,
          height: 50,
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        inputContainerStyle={{
          backgroundColor: 'white',
          height: 25,
        }}
        inputStyle={{}}
        style={{}}
      />
      <FlatList
        ItemSeparatorComponent={() => (
          <View style={{backgroundColor: 'grey', height: 0.5}} />
        )}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 10,
          //flexGrow:1
        }}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item?.id.toString()}
        onEndReached={fetchUsers}
        ListFooterComponent={() =>
          loading ? (
            <Text style={{fontSize: 20, textAlign: 'center'}}>
              Loading.....
            </Text>
          ) : null
        }
      />
    </View>
  );
});

export default ContactScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //backgroundColor: 'green',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 5,
    //height: 200,
    backgroundColor: 'white',
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
});
