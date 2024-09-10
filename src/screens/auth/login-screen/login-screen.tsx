import React, {memo, useId, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {styleslogin} from './styles';
import {Input} from '../../../components';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';

import {AppDispatch, RootState} from '../../../redux/store';
import ForgetPassword from './fogetPassword';
import {handleLogin} from '../../../redux/slice/auth/action/login';
interface IProps {
  navigation: any;
}
const LoginScreen = memo(({navigation}: IProps) => {
  const [email, setmyemail] = useState<string>('usamaanwar745@gmail.com');
  const [password, setmypassword] = useState<string>('123456');
  //const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {isAuth, loading, error} = useSelector(
    (state: RootState) => state.auth,
  );
  //console.log(authdata);
  const submit = () => {
    if (email === '' || password === '') {
      Alert.alert('Please enter email and password!');
    }
    dispatch(handleLogin({email, password}));
  };
  //try and catch used to handle any errors

  //console.log('User Loged In!');

  // } catch (error) {
  //console.error('Error logging in:', error);
  // Alert.alert('Error', 'Invalid email or password. Please try again.');
  // }
  // setLoading(false);
  //  }
  //  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
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
            value={email}
            onChangeText={setmyemail}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setmypassword}
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={submit} style={styleslogin.loginBtn}>
            {loading ? (
              <ActivityIndicator
                size={'small'}
                color={'white'}
                style={{backgroundColor: 'transparent', alignSelf: 'center'}}
              />
            ) : (
              <Text style={styleslogin.loginbtnText}>Log in</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={() => navigation.navigate('Forget')}>
            <Text
              style={{
                fontSize: 18,
                margin: 10,
                fontWeight: '600',
                color: 'black',
              }}>
              Forgotten Password?
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styleslogin.createbtn}>
          <Text style={styleslogin.createbtnText}>Create new account</Text>
        </TouchableOpacity>
      </>
    </View>
  );
});
export default LoginScreen;
