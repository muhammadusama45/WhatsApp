import {View, Text, SafeAreaView, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import AppNavigator from './src/navigations/app-navigator';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MenuProvider>
          <StatusBar backgroundColor={'red'} />
          <SafeAreaView style={{backgroundColor: 'red', flex: 1}}>
            <AppNavigator />
          </SafeAreaView>
        </MenuProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
