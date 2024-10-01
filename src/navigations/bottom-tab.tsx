import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {InboxScreen, PatientScreen, ProfileScreen} from '../screens';
import {BottomFabBar} from 'rn-wave-bottom-bar';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {size} from 'lodash';

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const tabs = [
    {
      name: 'Inbox',
      component: InboxScreen,
      icon: ({color}: any) => (
        <MaterialCommunityIcons name="chat" color={color} size={26} />
      ),
    },

    {
      name: 'Patient',
      component: PatientScreen,
      icon: ({color}: any) => (
        <FontAwesome5 name="hospital-user" color={color} size={26} />
      ),
    },
    {
      name: 'Profile',
      component: ProfileScreen,
      icon: ({color}: any) => (
        <MaterialCommunityIcons name="account" color={color} size={26} />
      ),
    },
  ];

  return (
    <Tab.Navigator
      initialRouteName="Inbox"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarActiveBackgroundColor: 'blue',
        tabBarInactiveBackgroundColor: 'red',
        // tabBarItemStyle: {
        //   justifyContent: 'center',
        //   alignItems: 'center',
        // },
        // tabBarIconStyle: {
        //   width: 20, // Adjust width of the circle
        //   height: 20, // Adjust height of the circle
        //   backgroundColor: 'green', // Background color for the circle
        //   borderRadius: 10, // Half of width/height to make it circular
        //   justifyContent: 'center', // Center the icon inside the circle
        //   alignItems: 'center', // Center the icon inside the circle
        // },
        // tabBarStyle: {
        //   height: 60, // Adjust the overall height of the tab bar
        //   paddingBottom: 5, // Adjust padding if needed
        // },
        tabBarLabelStyle: {
          fontSize: 12, // Set font size for tab labels
          fontWeight: 'bold',
        },
      }}
      tabBar={props => (
        <BottomFabBar
          mode={'default'}
          isRtl={false}
          focusedButtonStyle={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.41,
            shadowRadius: 9.11,
            elevation: 14,
          }}
          bottomBarContainerStyle={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
          {...props}
        />
      )}>
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarIcon: tab.icon,
            tabBarLabel: tab.name,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default MyTabs;
