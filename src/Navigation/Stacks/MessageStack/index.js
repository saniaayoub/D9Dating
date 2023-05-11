import {createStackNavigator} from '@react-navigation/stack';
import Message from '../../../screens/App/Message/index1';
import Chat from '../../../screens/App/Message/Chat/index2';
import ViewUser from '../../../screens/App/Home/ViewUser';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from '../../../../RootNavigation';
import {navigationRef} from '../../../../RootNavigation';
const Stack = createStackNavigator();

const MessageStack = () => {
  // useEffect(() => {
  //   // Assume a message-notification contains a "type" property in the data payload of the screen to open

  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background msg stack:',
  //       remoteMessage.notification,
  //     );
  //     RootNavigation.navigate(remoteMessage.data.screen);
  //   });

  //   // Check whether an initial notification is available
  //   messaging()
  //     .getInitialNotification()
  //     .then(remoteMessage => {
  //       if (remoteMessage) {
  //         console.log(
  //           'Notification caused app to open from quit msg stack:',
  //           remoteMessage.notification,
  //         );
  //         RootNavigation.navigate(remoteMessage.data.screen);
  //         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
  //       }
  //       // setLoading(false);
  //     });
  // }, []);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="ViewUser" component={ViewUser} />
    </Stack.Navigator>
  );
};

export default MessageStack;
