/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import store from './src/Redux/Store';
import PushNotification from 'react-native-push-notification';

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// PushNotification.configure({
//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);
//   },
//   requestPermissions: true,
// });

AppRegistry.registerComponent(appName, () => ReduxApp);
