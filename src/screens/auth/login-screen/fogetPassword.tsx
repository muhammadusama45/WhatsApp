import {
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {memo, useState} from 'react';
import {Input} from '../../../components';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store';

import Topbar from '../../../components/topbar/topbar';
import {forgetPassword} from '../../../redux/slice/auth/action/forgot-password';
import {ScrollView} from 'react-native';

interface IProps {
  navigation: any;
}

const ForgetPassword = memo(({navigation}: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading} = useSelector((state: RootState) => state.auth);

  const [email, setemail] = useState('');
  const handleForgetPassword = () => {
    dispatch(forgetPassword({email}));
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={{flex: 1}}>
      <Topbar text="Forget Password" />
      <ScrollView style={{height: '100%'}} contentContainerStyle={{flex: 1}}>
        <View style={{margin: 10}}>
          <Input
            placeholder="Enter Your Email"
            onChangeText={setemail}
            value={email.toLowerCase()}
          />
          <TouchableOpacity
            onPress={handleForgetPassword}
            style={styles.resetEmailBtn}>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                color={'white'}
                style={{backgroundColor: 'transparent', alignSelf: 'center'}}
              />
            ) : (
              <Text style={{fontSize: 15, color: 'white'}}>
                Send Reset Email"
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Btn}
            onPress={() => {
              navigation.replace('Login');
            }}>
            <Text style={{fontSize: 15, color: 'white'}}>Login Instead</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
export default ForgetPassword;
const styles = StyleSheet.create({
  Btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    margin: 10,
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
  },
  resetEmailBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    margin: 10,
    backgroundColor: 'red',
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
  },
});
