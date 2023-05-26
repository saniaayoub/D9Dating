import {createStackNavigator} from '@react-navigation/stack';
import Home from '../../../screens/App/Home';
import ViewUser from '../../../screens/App/Home/ViewUser/index';
import FunInteraction from '../../../screens/App/Home/FunInteraction';
import Test from '../../../screens/App/Home/Test';
import Comments from '../../../screens/App/Home/Comments';
import CreatePost from '../../../screens/App/CreatePost';
import Map from '../../../screens/Auth/Register/Map';
import Message from '../../../screens/App/Message/chatList';
import Likes from '../../../screens/App/Home/Likes';
import * as RootNavigation from '../../../../RootNavigation';
import {navigationRef} from '../../../../RootNavigation';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import socket from '../../../utils/socket';
import {TouchableOpacity, Text} from 'react-native';
import {useToast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {moderateScale} from 'react-native-size-matters';

const Stack = createStackNavigator();

const HomeStack = () => {
  const toast = useToast();
  useEffect(() => {
    socket.on('private_message', ({content, from, time}) => {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <TouchableOpacity
              style={{
                borderRadius: moderateScale(10, 0.1),
                paddingVertical: moderateScale(10, 0.1),
                paddingHorizontal: moderateScale(15, 0.1),
                backgroundColor: '#FFD700',
                flexDirection: 'row',
              }}
              onPress={() => {
                RootNavigation.navigate('MessageStack');
              }}>
              <Icon name={'envelope'} color={'#000'} size={18} />
              <Text style={{color: '#000', marginLeft: moderateScale(10, 0.1)}}>
                You have a new message
              </Text>
            </TouchableOpacity>
          );
        },
      });
    });
  }, [socket]);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const granted = await AsyncStorage.getItem('permission');
    console.log(granted, 'check before');
    if (granted == 'granted') {
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state00:',
          remoteMessage.notification,
        );
        RootNavigation.navigate(remoteMessage.data.screen, {
          data: remoteMessage.data,
        });
      });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              'Notification caused app to open from quit state0o:',
              remoteMessage.notification,
            );
            RootNavigation.navigate(remoteMessage.data.screen, {
              data: remoteMessage.data,
            });
            // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          }
        });
    } else {
      console.log("don't send notification");
    }
  };

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewUser" component={ViewUser} />
      <Stack.Screen name="FunInteraction" component={FunInteraction} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="Likes" component={Likes} />
      <Stack.Screen name="Test" component={Test} />
      <Stack.Screen name="createPost" component={CreatePost} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

export default HomeStack;
