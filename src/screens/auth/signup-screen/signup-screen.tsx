import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {stylesSignup} from './styles';
import {Input} from '../../../components';
import MaleFemale from '../../../components/male-female-button';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../redux/store';
import {SignUp} from '../../../redux/slice/auth/action/signup';

interface ISignupProps {
  navigation: any;
}
const SignupScreen = memo(({navigation}: ISignupProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setname] = useState('');
  const [gender, setGender] = useState<string>('');
  const [surname, setsurname] = useState('');
  const [email, setemail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [password, setpassword] = useState('');
  const {isAuth, loading, error} = useSelector(
    (state: RootState) => state.auth,
  );

  const handleSignUp = async () => {
    if (name === '') {
      Alert.alert('please enter your name');
    } else if (surname === '') {
      Alert.alert('please enter your surname');
    } else if (email === '') {
      Alert.alert('enter your email');
    } else if (confirmEmail === '') {
      Alert.alert('enter confirm your email');
    } else if (email != confirmEmail) {
      Alert.alert('Error', 'Email addresses do not match.');
    } else if (password === '') {
      Alert.alert('password field is empty');
    } else if (gender === '') {
      Alert.alert('gender not selected');
    } else {
      dispatch(SignUp({name, surname, email, confirmEmail, password, gender}));
      console.log(name, surname, email);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {loading ? (
        <ActivityIndicator size={'large'} color={'blue'} />
      ) : (
        <>
          <View style={{}}>
            <Text style={stylesSignup.topbar}>facebook</Text>
            <Text style={stylesSignup.signup}>Sign Up</Text>
            <Text style={stylesSignup.freetext}>
              It's free and always will be
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Input
                  placeholder="First Name"
                  value={name}
                  onChangeText={setname}
                />
              </View>
              <View style={{flex: 1}}>
                <Input
                  placeholder="Surname"
                  value={surname}
                  onChangeText={setsurname}
                />
              </View>
            </View>
            <Input
              placeholder="Email address"
              value={email}
              onChangeText={setemail}
            />
            <Input
              placeholder="Confirm email address"
              value={confirmEmail}
              onChangeText={setConfirmEmail}
            />
            <Input
              placeholder="New password"
              value={password}
              onChangeText={setpassword}
              secureTextEntry={true}
            />

            <View>
              <MaleFemale selectedGender={gender} onGenderSelect={setGender} />
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 10}}>
              <Text style={{color: '#808080'}}>
                By clicking Sign Up, you agree to our
              </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={{color: 'blue'}}>Terms</Text>
              </TouchableOpacity>
              <Text style={{color: '#808080'}}> and that you have</Text>
            </View>
            <View style={{flexDirection: 'row', marginLeft: 10}}>
              <Text style={{color: '#808080'}}>read our </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={{color: 'blue'}}>Data Policy</Text>
              </TouchableOpacity>
              <Text style={{color: '#808080'}}>, including our </Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={{color: 'blue'}}>Cookie Use</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleSignUp}
              style={{marginHorizontal: 10, marginTop: 20}}>
              <Text style={stylesSignup.signupbtn}>Sign Up</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{marginRight: 10, fontSize: 16, color: '#808080'}}>
                Have an account?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}
                style={{}}>
                <Text style={{fontSize: 16, color: 'blue'}}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
});
export default SignupScreen;
