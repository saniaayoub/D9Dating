import 'react-native-gesture-handler';
import {KeyboardAvoidingView, Platform, Alert} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {NativeBaseProvider, Box} from 'native-base';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MyStatusBar from './src/Components/StatusBar';
import {useSelector, useDispatch} from 'react-redux';
import {setTheme, setUserToken, setExist, setFToken} from './src/Redux/actions';
import RNBootSplash from 'react-native-bootsplash';
import BottomTabs from './src/Navigation/BottomTabs';
import AuthStack from './src/Navigation/Stacks/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosconfig from './src/Providers/axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import socket from './src/utils/socket';
// import PushNotification from 'react-native-push-notification';
import SplashScreen from 'react-native-splash-screen';
import * as RootNavigation from './RootNavigation';
import {navigationRef} from './RootNavigation';

const App = ({navigation}) => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.reducer.userToken);
  const theme = useSelector(state => state.reducer.theme);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken, 'fcmToken');
      dispatch(setFToken(fcmToken));
    }
  };

  useEffect(() => {
    requestUserPermission();
    checkToken();
    // // Initialize push notifications
    // PushNotification.configure({
    //   onNotification: function(notification) {
    //     console.log('NOTIFICATION:', notification);
    //   },
    // });
    // // Request permission to send push notifications
    // PushNotification.requestPermissions();
  }, []);

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async task
      getToken();
    };

    init().finally(async () => {
      if (Platform.OS == 'ios') {
        await RNBootSplash.hide({fade: true, duration: 500});
      }

      console.log('Bootsplash has been hidden successfully');
    });
  }, []);

  const getToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    let exist = await AsyncStorage.getItem('already');
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);

    console.log('app', token);
    dispatch(setExist(exist));
    setThemeMode(token);
    if (token != '' || token != null) {
      socket.auth = {username: userData?.email};
      socket.connect();
    }
    dispatch(setUserToken(token));
  };

  const setThemeMode = async token => {
    let SP = await AsyncStorage.getItem('id');

    axiosconfig
      .get(`user_view/${SP}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        console.log('data1', res.data);

        if (
          res?.data?.user_details?.theme_mode == null ||
          res?.data?.user_details?.theme_mode == '' ||
          res?.data?.user_details?.theme_mode == 0
        ) {
          dispatch(setTheme('dark'));
        } else {
          dispatch(setTheme('light'));
        }
        if (Platform.OS == 'android') {
          SplashScreen.hide();
        }
      })
      .catch(err => {
        if (Platform.OS == 'android') {
          SplashScreen.hide();
        }
        // setLoader(false);
        console.log('error', err);
        // showToast(err.response);
      });
  };

  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <MyStatusBar backgroundColor="#000" barStyle="light-content" />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <NavigationContainer ref={navigationRef}>
            {userToken === null ? <AuthStack /> : <BottomTabs />}
          </NavigationContainer>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
};

export default App;
