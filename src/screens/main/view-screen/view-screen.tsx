import React, {memo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../../../redux/store';
import {FlatList, Text, TouchableOpacity, View, Image} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SearchBar} from '@rneui/themed';
import {styles} from './style';

interface IProps {}
const mapTopStateProps = (state: RootState) => {
  return {};
};

const data = [
  {
    id: '1',
    title: 'Sunset Over Beach',
    image: 'https://example.com/images/sunset-beach.jpg',
    time: '10:30 AM',
  },
  {
    id: '2',
    title: 'Mountain Landscape',
    image: 'https://example.com/images/mountain-landscape.jpg',
    time: '11:45 AM',
  },
  {
    id: '3',
    title: 'City Skyline',
    image: 'https://example.com/images/city-skyline.jpg',
    time: '1:15 PM',
  },
  {
    id: '4',
    title: 'Forest Trail',
    image: 'https://example.com/images/forest-trail.jpg',
    time: '3:00 PM',
  },
  {
    id: '5',
    title: 'Desert Dunes',
    image: 'https://example.com/images/desert-dunes.jpg',
    time: '5:25 PM',
  },
];

const renderItem = ({item}: {item: (typeof data)[0]}) => {
  return (
    <TouchableOpacity key={item.id} style={styles.mainView} onPress={() => {}}>
      <View
        style={{width: 48, height: 48, borderRadius: 24, overflow: 'hidden'}}>
        <Image
          source={{uri: item.image}}
          style={{width: '100%', height: '100%'}}
        />
      </View>

      <View style={{flex: 1, marginLeft: 10}}>
        <View style={styles.row}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.title}
          </Text>

          <MaterialIcons name="keyboard-arrow-right" size={30} />
        </View>

        <View style={styles.row}>
          <Text style={styles.timeText} numberOfLines={1}>
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ViewScreen = memo(() => {
  const [search, setSearch] = useState('');

  return (
    <View>
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
      />
      <TouchableOpacity
        style={{
          marginTop: 20,
          marginRight: 20,
          backgroundColor: 'blue',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-end',
          borderRadius: 8,
          shadowColor: 'black',
          elevation: 5,
          shadowRadius: 10,
          shadowOpacity: 0.3,
          shadowOffset: {
            height: 4,
            width: 5,
          },
        }}
        onPress={() => {}}>
        <Text style={{color: 'white'}}>+ Add</Text>
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
});

export default connect(mapTopStateProps)(ViewScreen);
