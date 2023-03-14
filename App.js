import 'react-native-gesture-handler';
import {KeyboardAvoidingView} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider, Box} from 'native-base';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MyStatusBar from './src/Components/StatusBar';
import {useSelector, useDispatch} from 'react-redux';
import {setTheme, setUserToken} from './src/Redux/actions';
import RNBootSplash from 'react-native-bootsplash';
import BottomTabs from './src/Navigation/BottomTabs';
import AuthStack from './src/Navigation/Stacks/AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import PushNotification from 'react-native-push-notification';

const App = () => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.reducer.userToken);

  useEffect(() => {
    // const init = async () => {
    // …do multiple sync or async task
    getToken()
    dispatch(setTheme('dark'));
    // };

    // init().finally(async () => {
    //   await RNBootSplash.hide({fade: true, duration: 500});
    //   console.log('Bootsplash has been hidden successfully');
    // });
  }, []);

  const getToken = async()=>{
   let  token =  await AsyncStorage.getItem('userToken')
   dispatch(setUserToken(token))
  }

  // PushNotification.configure({
  //   // (optional) Called when Token is generated (iOS and Android)
  //   onRegister: function (token) {
  //     console.log('TOKEN:', token);
  //   },

  //   // (required) Called when a remote is received or opened, or local notification is opened
  //   onNotification: function (notification) {
  //     console.log('NOTIFICATION:', notification);

  //     // process the notification

  //     // (required) Called when a remote is received or opened, or local notification is opened
  //     notification.finish(PushNotificationIOS.FetchResult.NoData);
  //   },

  //   // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  //   onAction: function (notification) {
  //     console.log('ACTION:', notification.action);
  //     console.log('NOTIFICATION:', notification);

  //     // process the action
  //   },

  //   // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  //   onRegistrationError: function (err) {
  //     console.error(err.message, err);
  //   },

  //   // IOS ONLY (optional): default: all - Permissions to register.
  //   permissions: {
  //     alert: true,
  //     badge: true,
  //     sound: true,
  //   },

  //   // Should the initial notification be popped automatically
  //   // default: true
  //   popInitialNotification: true,

  //   /**
  //    * (optional) default: true
  //    * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //    * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //    * - if you are not using remote notification or do not have Firebase installed, use this:
  //    *     requestPermissions: Platform.OS === 'ios'
  //    */
  //   requestPermissions: true,
  // });

  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <MyStatusBar backgroundColor="#000" barStyle="light-content" />
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <NavigationContainer>
            {userToken === null ? <AuthStack /> : <BottomTabs />}
          </NavigationContainer>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
};

export default App;

// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   PermissionsAndroid,
//   Platform,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import PhotoEditor from 'react-native-photo-editor';
// import RNFS from 'react-native-fs';
// import RNFetchBlob from 'rn-fetch-blob';
// import ImagePicker, {
//   launchCamera,
//   launchImageLibrary,
// } from 'react-native-image-picker';
// import RNBootSplash from 'react-native-bootsplash';

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       path: require('./assets/photo.jpg'),
//     };
//   }
//   _onPress = () => {
//     PhotoEditor.Edit({
//       path: RNFS.DocumentDirectoryPath + '/photo.jpg',
//       stickers: [
//         'sticker0',
//         'sticker1',
//         'sticker2',
//         'sticker3',
//         'sticker4',
//         'sticker5',
//         'sticker6',
//         'sticker7',
//         'sticker8',
//         'sticker9',
//         'sticker10',
//       ],
//       // hiddenControls: [
//       //   'clear',
//       //   'crop',
//       //   'draw',
//       //   'save',
//       //   'share',
//       //   'sticker',
//       //   'text',
//       // ],
//       colors: undefined,
//       onDone: res => {
//         console.log('on done', res);
//         this.setState({path: `file://${res}`});
//       },
//       onCancel: () => {
//         console.log('on cancel');
//       },
//     });
//   };

//   requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs camera permission',
//           },
//         );
//         // If CAMERA Permission is granted
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     } else return true;
//   };

//   requestExternalWritePermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'External Storage Write Permission',
//             message: 'App needs write permission',
//           },
//         );
//         // If WRITE_EXTERNAL_STORAGE Permission is granted
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         alert('Write permission err', err);
//       }
//       return false;
//     } else return true;
//   };

//   requestExternalReadPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           {
//             title: 'External Storage Read Permission',
//             message: 'App needs write permission',
//           },
//         );
//         // If WRITE_EXTERNAL_STORAGE Permission is granted
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         alert('Read permission err', err);
//       }
//       return false;
//     } else return true;
//   };

//   captureImage = async type => {
//     let options = {
//       mediaType: type,
//       maxWidth: 300,
//       maxHeight: 550,
//       quality: 1,
//       videoQuality: 'low',
//       durationLimit: 30, //Video max duration in seconds
//       saveToPhotos: true,
//     };
//     let isCameraPermitted = await this.requestCameraPermission();
//     let isStoragePermitted = await this.requestExternalWritePermission();
//     let isReadStoragePermitted = await this.requestExternalReadPermission();

//     if (isCameraPermitted && isStoragePermitted && isReadStoragePermitted) {
//       launchCamera(options, response => {
//         console.log('Response = ', response);

//         if (response.didCancel) {
//           alert('User cancelled camera picker');
//           return;
//         } else if (response.errorCode == 'camera_unavailable') {
//           alert('Camera not available on device');
//           return;
//         } else if (response.errorCode == 'permission') {
//           alert('Permission not satisfied');
//           return;
//         } else if (response.errorCode == 'others') {
//           alert(response.errorMessage);
//           return;
//         }
//         let source = response;
//         console.log(source.assets[0].uri, 'uri');
//         // setStoryImage(true);
//         // refRBSheet.current.close();
//         // openEditor(source);
//         this.convert(source);
//       });
//     } else {
//       console.log(
//         'err',
//         isCameraPermitted,
//         isStoragePermitted,
//         isReadStoragePermitted,
//       );
//     }
//   };

//   chooseFile = async type => {
//     var options = {
//       title: 'Select Image',
//       customButtons: [
//         {
//           name: 'customOptionKey',
//           title: 'Choose file from Custom Option',
//         },
//       ],
//       storageOptions: {
//         skipBackup: true,
//         path: 'images',
//       },
//     };
//     launchImageLibrary(options, res => {
//       console.log('Response = ', res);
//       if (res.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (res.error) {
//         console.log('ImagePicker Error: ', res.error);
//       } else if (res.customButton) {
//         console.log('User tapped custom button: ', res.customButton);
//         alert(res.customButton);
//       } else {
//         let source = res;
//         console.log(source.assets[0].uri, 'uri');
//         // setStoryImage(source.assets[0].uri);
//         // refRBSheet.current.close();
//         this.convert(source);
//         // setStoryImage(true);
//       }
//     });
//   };

//   componentDidMount() {
//     const init = async () => {
//       // …do multiple sync or async task
//       // dispatch(setUserToken('sania'));
//       // dispatch(setTheme('dark'));
//     };

//     init().finally(async () => {
//       await RNBootSplash.hide({fade: true, duration: 500});
//       console.log('Bootsplash has been hidden successfully');
//     });
//     let photoPath = RNFS.DocumentDirectoryPath + '/photo.jpg';
//     let binaryFile = Image.resolveAssetSource(require('./assets/photo.jpg'));

//     RNFetchBlob.config({fileCache: true})
//       .fetch('GET', binaryFile.uri)
//       .then(resp => {
//         RNFS.moveFile(resp.path(), photoPath)
//           .then(() => {
//             console.log('FILE WRITTEN!');
//           })
//           .catch(err => {
//             console.log(err.message);
//           });
//       })
//       .catch(err => {
//         console.log(err.message);
//       });
//   }
//   convert = source => {
//     let photoPath = RNFS.DocumentDirectoryPath + '/photo.jpg';
//     let binaryFile = Image.resolveAssetSource(require('./assets/photo.jpg'));

//     RNFS.moveFile(source.assets[0].uri, photoPath)
//       .then(() => {
//         console.log('FILE WRITTEN!');
//         this._onPress();
//       })
//       .catch(err => {
//         console.log(err.message);
//       });
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <TouchableOpacity onPress={() => this.captureImage('photo')}>
//           <Text>Click</Text>
//         </TouchableOpacity>
//         <View style={{width: 300, height: 300}}>
//           <Image
//             source={
//               this.state.path == 1 ? this.state.path : {uri: this.state.path}
//             }
//             resizeMode={'contain'}
//             width={undefined}
//             height={undefined}
//             style={{width: 300, height: 300}}
//           />
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
// });
