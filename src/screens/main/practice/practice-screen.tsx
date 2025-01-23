import React, {memo, useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Button} from 'react-native';
import axios from 'axios';
import Topbar from '../../../components/topbar/topbar';
import {TouchableOpacity} from 'react-native';

const PracticeScreen = memo(() => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [postResponse, setPostResponse] = useState<any>(null);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => {
        setData(response.data);
        console.log('data fetched');
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handlePostRequest = () => {
    setPostLoading(true);
    const postData = {
      title: 'Practice',
      body: 'Screen',
      userId: 1,
      name: 'usama',
      job: 'app developer',
    };

    axios
      .post('https://jsonplaceholder.typicode.com/posts', postData)
      .then(response => {
        setPostResponse(response.data);
        console.log('data post');
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setPostLoading(false);
      })
      .finally(() => {
        setPostLoading(false);
      });
  };

  return (
    <View style={{}}>
      <Topbar text="Practice" />
      <View style={styles.container}>
        <Text style={styles.title}>GET Request:</Text>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text>Error: {error.message}</Text>}
        {!loading && !error && (
          <>
            <Text>{data.title}</Text>
            <Text>{data.body}</Text>
          </>
        )}

        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: 'blue',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
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
          onPress={handlePostRequest}>
          <Text style={{color: 'white'}}>Make POST Request</Text>
        </TouchableOpacity>

        {postLoading && (
          <ActivityIndicator
            size="large"
            color="blue"
            style={{marginTop: 20}}
          />
        )}

        {postResponse && !postLoading && (
          <View style={{marginTop: 20}}>
            <Text style={styles.title}>POST Response:</Text>
            <Text>Title: {postResponse.title}</Text>
            <Text>Body: {postResponse.body}</Text>
            <Text>name: {postResponse.name}</Text>
            <Text>job: {postResponse.job}</Text>
            <Text>UserID: {postResponse.userId}</Text>
          </View>
        )}
      </View>
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // postContainer: {
  //   marginTop: 10,
  // },
});

export default PracticeScreen;
