import {View, Text, SafeAreaView, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppNavigator from './src/navigations/app-navigator';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MenuProvider>
          <StatusBar backgroundColor={'blue'} />
          <SafeAreaView style={{backgroundColor: 'blue', flex: 1}}>
            <AppNavigator />
          </SafeAreaView>
        </MenuProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
