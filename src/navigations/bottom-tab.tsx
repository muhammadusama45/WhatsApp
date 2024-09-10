import * as React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {InboxScreen, PatientScreen, ProfileScreen} from '../screens';
const Tab = createMaterialBottomTabNavigator();
const MyTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Inbox"
      activeColor="blue"
      //labelStyle= {{ fontSize: 12 }}
      //style={{ backgroundColor: 'tomato' }}
    >
      <Tab.Screen
        name="Inbox"
        component={InboxScreen}
        options={{
          tabBarLabel: 'Inbox',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="chat" color={color} size={26} />
          ),
        }}
      />

      <Tab.Screen
        name="Patient"
        component={PatientScreen}
        options={{
          tabBarLabel: 'Patients',
          tabBarIcon: ({color}) => (
            <FontAwesome5 name="hospital-user" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
export default MyTabs;
