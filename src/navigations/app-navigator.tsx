import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {useSelector} from 'react-redux';
import {isReadyRef, navigationRef, routeNameRef} from '../../navigation-helper';
import {RootState} from '../redux/store';
import {
  Chatscreen,
  ContactScreen,
  ForgetPassword,
  HomeScreen,
  LoginScreen,
  ProfileScreen,
  Signup,
} from '../screens';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current?.getCurrentRoute()?.name;
        isReadyRef.current = true;
      }}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        {isAuth ? (
          <Stack.Screen name="BottomTab" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="Forget" component={ForgetPassword} />
          </>
        )}
        <Stack.Screen name="Chat" component={Chatscreen} />
        <Stack.Screen name="Contacts" component={ContactScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default AppNavigator;
