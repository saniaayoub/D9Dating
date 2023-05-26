import {StyleSheet, Platform, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {moderateScale} from 'react-native-size-matters';
import HomeStack from '../Stacks/HomeStack';
import MessageStack from '../Stacks/MessageStack';
import CreatePost from '../../screens/App/CreatePost';
import CreatePostStack from '../Stacks/CreatePostStack';
import ProfileStack from '../Stacks/ProfileStack';
import Notification from '../Stacks/NotificationStack';
import Icon from 'react-native-vector-icons/Octicons';
import ChatIcon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Home from 'react-native-vector-icons/Foundation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: Platform.OS !== 'ios',
        tabBarStyle: [
          {
            display: 'flex',
            backgroundColor: '#343434',
            width: '100%',
            height:
              Platform.OS == 'ios'
                ? moderateScale(90, 0.1)
                : moderateScale(53, 0.1),
            borderTopLeftRadius: moderateScale(15, 0.1),
            borderTopRightRadius: moderateScale(15, 0.1),
            elevation: 0,
            position: 'absolute',
          },
          null,
        ],

        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name={'HomeStack'}
        component={HomeStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Home
                name="home"
                color={focused ? '#FFD700' : '#F8F8F8'}
                solid
                size={moderateScale(24, 0.1)}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'MessageStack'}
        component={MessageStack}
        options={{
          tabBarStyle: {
            display: 'none',
          },
          tabBarVisible: false,

          tabBarIcon: ({focused}) => (
            <View>
              <ChatIcon
                name="md-chatbubble-ellipses"
                color={focused ? '#FFD700' : '#F8F8F8'}
                solid
                size={moderateScale(22, 0.1)}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'CreatePostStack'}
        component={CreatePostStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.addTab}>
              <Icon
                name="plus"
                color={'#F8F8F8'}
                solid
                size={moderateScale(30, 0.1)}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'Notification'}
        component={Notification}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <AntDesign
                name="heart"
                color={focused ? '#FFD700' : '#F8F8F8'}
                solid
                size={moderateScale(22, 0.1)}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={'ProfileStack'}
        component={ProfileStack}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <FontAwesome5
                name="user"
                color={focused ? '#FFD700' : '#F8F8F8'}
                solid
                size={moderateScale(22, 0.1)}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  addTab: {
    backgroundColor: '#FFD700',
    // padding: moderateScale(10, 0.1),
    width: moderateScale(50, 0.1),
    height: moderateScale(50, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(50, 0.1),
    borderRadius: moderateScale(25, 0.1),
  },
});
