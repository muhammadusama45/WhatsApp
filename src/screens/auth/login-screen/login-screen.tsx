import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ButtonPrimary, Input} from '../../../components';
import {styleslogin} from './styles';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {navigate} from '../../../../root-navigation';
import {handleLogin} from '../../../redux/slice/auth/action/login';
import {AppDispatch, RootState} from '../../../redux/store';

interface IProps {
  navigation: any;
}
const LoginScreen = memo(({navigation}: IProps) => {
  const [email, setmyemail] = useState<string>('usamaanwar745@gmail.com');
  const [password, setmypassword] = useState<string>('123456');
  const [secure, onsecure] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const {isAuth, loading, error} = useSelector(
    (state: RootState) => state.auth,
  );

  const submit = () => {
    if (email === '' || password === '') {
      Alert.alert('Please enter email and password!');
    }
    dispatch(handleLogin({email, password}));
  };

  const handleSecure = () => {
    onsecure(toggle => !toggle);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      style={{flex: 1}}>
      <ScrollView style={{height: '100%'}} contentContainerStyle={{flex: 1}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <Image
            source={require('../../../assets/fb-image/facebook.png')}
            style={{
              height: 80,
              width: 80,
            }}
          />
        </View>

        <View style={{flex: 1.5}}>
          <Input
            placeholder="Mobile number or email address"
            value={email.toLowerCase()}
            onChangeText={setmyemail}
            children={
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialCommunityIcons name={'email'} size={25} />
              </View>
            }
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setmypassword}
            secureTextEntry={secure}
            children={
              <TouchableOpacity
                onPress={handleSecure}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <MaterialCommunityIcon
                  name={secure ? 'eye-off' : 'eye'}
                  size={25}
                />
              </TouchableOpacity>
            }
          />
          {/* <TouchableOpacity onPress={submit} style={styleslogin.loginBtn}>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                color={'white'}
                style={{backgroundColor: 'transparent', alignSelf: 'center'}}
              />
            ) : (
              <Text style={styleslogin.loginbtnText}>Log in</Text>
            )}
          </TouchableOpacity> */}
          <ButtonPrimary
            loading={loading}
            title="Login"
            onPress={() => {
              submit();
            }}
          />

          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={() => navigate('Forget')}>
            <Text
              style={{
                fontSize: 18,
                margin: 10,
                fontWeight: '600',
                color: 'blue',
              }}>
              Forgotten Password?
            </Text>
          </TouchableOpacity>
        </View>

        <ButtonPrimary
          title="Create new account"
          textStyle={{color: 'blue'}}
          style={{backgroundColor: 'white', marginBottom: 10}}
          onPress={() => navigate('Signup')}
        />

        {/* <TouchableOpacity
          onPress={() => navigate('Signup')}
          style={styleslogin.createbtn}>
          <Text style={styleslogin.createbtnText}>Create new account</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
});
export default LoginScreen;
