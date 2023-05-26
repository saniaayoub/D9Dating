import 'react-native-gesture-handler';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  Text,
} from 'react-native';
import React, {useEffect} from 'react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {NativeBaseProvider, Box, useToast} from 'native-base';
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
import {AppState} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {moderateScale} from 'react-native-size-matters';

const App = ({navigation}) => {
  const dispatch = useDispatch();
  const toast = useToast();
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
      // console.log(fcmToken, 'fcmToken');
      dispatch(setFToken(fcmToken));
    }
  };

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // console.log('Notification permission granted');
          await AsyncStorage.setItem('permission', 'granted');
        } else {
          // console.log('Notification permission denied');
          await AsyncStorage.setItem('permission', 'denied');
        }
      } else {
        const status = await request(PERMISSIONS.IOS.NOTIFICATIONS);
        if (status === RESULTS.GRANTED) {
          await AsyncStorage.setItem('permission', 'granted');

          // console.log('Notification permission granted');
        } else {
          await AsyncStorage.setItem('permission', 'denied');
          // console.log('Notification permission denied');
        }
      }
    } catch (error) {
      console.log('Error requesting notification permission: ', error);
    }
  };

  useEffect(() => {
    // alert('hi');
    checkNotPer();
  }, []);

  const checkNotPer = async () => {
    const checkPermission = await AsyncStorage.getItem('permission');
    askForPermission(checkPermission);
  };

  const askForPermission = checkPermission => {
    if (checkPermission == 'granted') {
    } else {
      const checkAndRequestNotificationPermission = async () => {
        try {
          const status = await check(
            Platform.OS === 'android'
              ? PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
              : PERMISSIONS.IOS.NOTIFICATIONS,
          );
          if (status === RESULTS.GRANTED) {
            // console.log('status', status);
            await AsyncStorage.setItem('permission', 'granted');
            console.log('Notification permission already granted');
          } else {
            await requestNotificationPermission();
          }
        } catch (error) {
          console.log('Error checking notification permission: ', error);
        }
      };

      checkAndRequestNotificationPermission();
    }
  };
  useEffect(() => {
    // Replace with your server URL
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    // socket.on('private_message', ({content, from, time}) => {
    //   toast.show({
    //     title: 'Hello world1',
    //     placement: 'top',
    //     render: () => {
    //       return (
    //         <TouchableOpacity
    //           style={{
    //             borderRadius: moderateScale(10, 0.1),
    //             paddingVertical: moderateScale(10, 0.1),
    //             paddingHorizontal: moderateScale(15, 0.1),
    //             backgroundColor: '#FFD700',
    //             flexDirection: 'row',
    //           }}
    //           onPress={() => {
    //             console.log('not logging');
    //           }}>
    //           <Icon name={'envelope'} color={'#000'} size={18} />
    //           <Text style={{color: '#000', marginLeft: moderateScale(10, 0.1)}}>
    //             You have a new message
    //           </Text>
    //         </TouchableOpacity>
    //       );
    //     },
    //   });
    // });

    socket.on('disconnect', reason => {
      console.log('Socket disconnected');
      console.log('Reason:', reason);
      updateLastSeen();
    });
    socket.on('error', error => {
      console.error('Socket error:', error);
    });
    socket.on('connect_error', error => {
      console.log('Connection error:', error);
    });
    // Clean up the socket on component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    requestUserPermission();
    checkToken();
  }, []);

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async task
      getToken();
    };

    init().finally(async () => {
      if (Platform.OS == 'ios') {
        await RNBootSplash.hide({fade: true, duration: 500});
      } else {
        SplashScreen.hide();
      }
    });
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        console.log('App is in the foreground');
      } else {
        console.log('App is in the background');
        updateLastSeen();
      }
    };

    AppState.addEventListener('change', handleAppStateChange);

    // Clean up the event listener on component unmount
    // return () => {
    //   AppState.removeEventListener('change', handleAppStateChange);
    // };
  }, []);
  const updateLastSeen = async () => {
    let token = await AsyncStorage.getItem('userToken');
    if (token) {
      await axiosconfig
        .post(
          `last-seen`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(res => {
          console.log('last seen', res.data);
        })
        .catch(err => {
          console.log(err, 'last seen err1');
        });
    }
  };

  const getToken = async () => {
    let token = await AsyncStorage.getItem('userToken');
    let exist = await AsyncStorage.getItem('already');
    let userData = await AsyncStorage.getItem('userData');
    userData = JSON.parse(userData);
    // console.log(token);
    dispatch(setExist(exist));
    setThemeMode(token);
    if (token) {
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
          console.log('close splash');
          // SplashScreen.hide();
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
