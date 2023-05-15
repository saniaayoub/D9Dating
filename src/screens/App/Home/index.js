import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import PhotoEditor from 'react-native-photo-editor';
import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import {Input, Button, Stack, Menu, Pressable} from 'native-base';
import socket from '../../../utils/socket';
import Stories from '../../../Stories/App';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native';
import Fun from '../../../assets/images/svg/fun.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Antdesign from 'react-native-vector-icons/AntDesign';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import RNFS from 'react-native-fs';
import Loader from '../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosconfig from '../../../provider/axios';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {setOrganization, setStories, addUsers} from '../../../Redux/actions';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from '../../../../RootNavigation';
import {navigationRef} from '../../../../RootNavigation';
const Organization = [
  {id: 'Alpha Phi Alpha Fraternity, Inc.', color: 'blue'},
  {id: 'Alpha Kappa Alpha Sorority Inc.', color: 'green'},
  {id: 'Omega Psi Phi Fraternity, Inc.', color: 'red'},
  {id: 'Delta Sigma Theta Sorority Inc.', color: 'yellow'},
  {id: 'Kappa Alpha Psi Fraternity, Inc.', color: 'orange'},
  {id: 'Sigma Gamma Rho Sorority Inc.', color: 'brown'},
  {id: 'Phi Beta Sigma Fraternity, Inc.', color: 'pink'},
  {id: 'Zeta Phi Beta Sorority Inc.', color: 'purple'},
  {id: 'Iota Phi Theta Fraternity, Inc.', color: 'blue'},
];

const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();
  const theme = useSelector(state => state.reducer.theme);
  const userToken = useSelector(state => state.reducer.userToken);
  const organizations = useSelector(state => state.reducer.organization);
  const storyID = useSelector(state => state.reducer.storyID);
  const storiesData = useSelector(state => state.reducer.stories);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [refresh, setRefresh] = useState(true);
  const [myStories, setMyStories] = useState([]);
  const [storyCircle, setStoryCircle] = useState('green');
  const [loader, setLoader] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userID, setUserID] = useState('');
  const [comment, setComment] = useState('');
  const [current, setCurrent] = useState('');
  const [otherStories, setOtherStories] = useState([]);
  const [postId, setPostId] = useState(null);
  const [userData, setUserData] = useState('');
  const [funPostsData, setFunPostsData] = useState('');
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const postID = route?.params?.data?.postid;
  console.log(route?.params?.data?.postid, 'postidf');
  useEffect(() => {
    dispatch(setOrganization(Organization));
    console.log('organisation', organizations);
    getID();
    getPosts();
    getStories();
    getData();
    funPosts();
    console.log(storyID, 'setUD');
  }, [isFocused]);
  // useEffect(() => {
  //   // Assume a message-notification contains a "type" property in the data payload of the screen to open

  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     console.log(
  //       'Notification caused app to open from background state2:',
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
  //           'Notification caused app to open from quit state:',
  //           remoteMessage.notification,
  //         );
  //         RootNavigation.navigate(remoteMessage.data.screen);
  //         // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
  //       }
  //       // setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    socket.on('users', users => {
      users.forEach(user => {
        user.self = user.userID === socket.id;
      });
      console.log(users, 'client');
      dispatch(addUsers(users));
    });
  }, []);

  const getID = async () => {
    const id = await AsyncStorage.getItem('id');
    setUserID(id);
    getData(id);
  };

  const getData = async id => {
    // console.log('get data');
    setLoader(true);
    axiosconfig
      .get(`user_view/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data', res.data.user_details);
        setUserData(res?.data?.user_details);
        socket.auth = {username: res?.data?.user_details?.name};
        socket.connect();

        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };
  const matchId = postId => {
    console.log('avg', postId);
    postId.map((post, index) => {
      console.log('post id', post.id, postID);
      if (post.id == postID) {
        console.log('abc');
        const matchedId = post.id;
        console.log(matchedId, index, 'mat');
        if (index !== -1 && flatListRef.current) {
          flatListRef.current.scrollToIndex({index, animated: true});
        }
      } else {
        console.log('false');
      }
    });
  };
  const getItemLayout = (data, index) => ({
    length: 500,
    offset: 500 * index,
    index,
  });

  const getPosts = async () => {
    setLoader(true);
    await axiosconfig
      .get('user_details', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        setPosts(res?.data?.post_friends);
        matchId(res?.data?.post_friends);
        setOtherStoriesData(res?.data?.stories);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  const funPosts = async () => {
    setLoader(true);
    await axiosconfig
      .get('fun-interaction', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('public post', JSON.stringify(res?.data?.post_public));
        const data = res?.data?.post_public;

        setFunPostsData(res?.data?.post_public);

        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };
  const report = async repText => {
    setLoader(true);
    const data = {
      post_id: postId,
      text: repText,
    };
    await axiosconfig
      .post('post-report', data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('Posts', res.data);
        getPosts();
        refRBSheet1.current.close();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };
  const hide = async id => {
    setLoader(true);
    await axiosconfig
      .get(`post_action/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('Posts', res.data);
        getPosts();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  const setOtherStoriesData = data => {
    let temp = [];

    data?.forEach(elem => {
      let tempelem = {
        user_id: elem.id,
        profile: elem.image ? elem?.image : dummyImage,
        group: elem.organization,
        username: elem.name + ' ' + elem.last_name,
        title: elem.name + ' ' + elem.last_name,
        stories: elem.stories.map(item => {
          return {
            id: item.story_id,
            url: item.story_image,
            type: 'image',
            duration: 10,
            isReadMore: true,
            url_readmore: 'https://github.com/iguilhermeluis',
            created: elem.created_at,
          };
        }),
      };
      temp.push(tempelem);
    });
    setOtherStories(temp);
    setLoader(false);
  };

  const hitLike = async (id, index) => {
    setLoader(true);
    await axiosconfig
      .get(`like/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('data', JSON.stringify(res.data));
        toggleLike(index);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  var lastTap = null;
  const handleDoubleTap = (id, index) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      hitLike(id, index);
    } else {
      lastTap = now;
    }
  };

  const toggleLike = index => {
    // console.log('hello');
    getPosts();
    setRefresh(!refresh);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const requestExternalReadPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: Dimensions.get('screen').width,
      maxHeight: moderateScale(370, 0.1),
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    let isReadStoragePermitted = await requestExternalReadPermission();

    if (isCameraPermitted && isStoragePermitted && isReadStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        let source = response;
        console.log(source.assets[0].uri, 'uri');
        // setStoryImage(true);
        refRBSheet.current.close();
        convert(source);
      });
    }
  };

  const chooseFile = async type => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose file from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, res => {
      console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        // console.log(source.assets[0].uri, 'uri');
        // setStoryImage(source.assets[0].uri);
        refRBSheet.current.close();
        // console.log(source)
        convert(source);
        // setStoryImage(true);
      }
    });
  };

  const getColor = id => {
    let color;

    // console.log(id, 'idddg');
    Organization?.forEach(elem => {
      if (elem.id == id) {
        // console.log(id, 'idddg');
        color = elem.color;
      }
    });
    return color;
  };

  const _onPress = async imageToeEdit => {
    setTimeout(() => {
      // console.log(imageToeEdit, 'eitors');

      try {
        PhotoEditor.Edit({
          path:
            Platform.OS == 'ios'
              ? imageToeEdit
              : RNFS.DocumentDirectoryPath + '/photo.jpg',
          // stickers: [
          //   'sticker0',
          //   'sticker1',
          //   'sticker2',
          //   'sticker3',
          //   'sticker4',
          //   'sticker5',
          //   'sticker6',
          //   'sticker7',
          //   'sticker8',
          //   'sticker9',
          //   'sticker10',
          // ],
          hiddenControls: ['save'],
          colors: undefined,
          onDone: res => {
            console.log('on done', res);
            // setPath(`file://${res}`);
            convertToBase64(`file://${res}`);
            let temp = storiesData[0].stories;
            // temp.push({
            //   story_id: Stories[0]?.stories?.length + 1,
            //   story_image: `file://${res}`,
            //   swipeText: 'Custom swipe text for this story',
            //   onPress: () => console.log('story 1 swiped'),
            // });
            temp.push({
              id: storiesData[0]?.stories?.length + 1,
              url: `file://${res}`,
              type: 'image',
              duration: 30,
              isReadMore: true,
              url_readmore: 'https://github.com/iguilhermeluis',
              created: new Date(),
            });

            // setLoader(true);
            setMyStories(temp);
            dispatch(setStories([{...storiesData[0], stories: temp}]));

            // addStory(myStories);
          },
          onCancel: () => {
            console.log('on cancel');
          },
        });
      } catch (err) {
        console.log(err);
      }
    }, 1000);
  };

  const getMyStories = () => {
    let temp = myStories;
    temp.push({
      story_id: myStories.length + 1,
      story_image: `file://${res}`,
      swipeText: 'Custom swipe text for this story',
      onPress: () => console.log('story 1 swiped'),
    });
    // setLoader(true);
    setMyStories(temp);
    setStoryCircle('green');
    addStory(myStories);
  };
  const convert = source => {
    // let binaryFile = Image.resolveAssetSource(require('./assets/photo.jpg'));

    if (Platform.OS == 'ios') {
      _onPress(source.assets[0].uri);
    } else {
      let photoPath = RNFS.DocumentDirectoryPath + '/photo.jpg';
      RNFS.moveFile(source.assets[0].uri, photoPath)
        .then(() => {
          console.log('FILE WRITTEN!');
          _onPress();
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  };

  const convertToBase64 = async image => {
    await RNFS.readFile(image, 'base64')
      .then(res => {
        let base64 = `data:image/png;base64,${res}`;
        // setStoryImage(base64);
        createStory(base64);
      })
      .catch(err => {
        console.log(err);
        // showToast('Profile picture not updated');
        // setLoader(false);
      });
  };

  const createStory = async base64 => {
    setLoader(true);
    if (!base64) {
      s;
      setLoader(false);
      return;
    }
    const data = {
      story_id: storiesData[0]?.stories?.length + 1,
      image: base64,
      swipe_text: 'Custom swipe text for this story',
      privacy_option: '1',
    };

    // const data = {
    //   id: storiesData[0]?.stories?.length + 1,
    //   url: base64,
    //   type: 'image',
    //   duration: 30,
    //   isReadMore: true,
    //   url_readmore: 'https://github.com/iguilhermeluis',
    //   created: new Date(),
    // };
    await axiosconfig
      .post(`story_store`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('data', JSON.stringify(res.data));
        // setComment('');
        setStoryCircle('green');
        getStories();
        // setRefresh(!refresh);
        dispatch(set);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        getStories();
        // Alert.alert(err);
      });
  };

  const addComment = async (id, index) => {
    setLoader(true);
    // console.log('hisss', id);
    if (!comment) {
      setLoader(false);
      return;
    }
    const data = {
      text: comment,
      post_id: id,
    };
    await axiosconfig
      .post(`comment_add`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('data', JSON.stringify(res.data));
        setComment('');
        getPosts();
        setRefresh(!refresh);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        setComment('');
        console.log(err);
        // Alert.alert(err);
      });
  };

  const getStories = async token => {
    setLoader(true);
    await axiosconfig
      .get('story_index', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('storylo', JSON.stringify(res.data?.user));
        createStoryData(res.data?.user, token);
        // console.log(myData1);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'jhjj');
        // showToast(err.response);
      });
  };

  const createStoryData = (data, token) => {
    // console.log('sent data', data);
    // let temp = {
    //   user_id: data.id,
    //   user_image: data.image ? data.image : dummyImage,
    //   organization: data.organization,
    //   user_name: data.name,
    //   stories: data.stories.map(elem => {
    //     return {...elem, onPress: () => console.log('story 1 swiped')};
    //   }),
    // };

    // dispatch(setStories([temp]));
    // setLoader(false);

    console.log('sent data', data);
    let temp = {
      user_id: data.id,
      profile: data.image ? data.image : dummyImage,
      organization: data.organization,
      username: data.name + ' ' + data.last_name,
      title: data.name + ' ' + data.last_name,
      stories: data.stories.map(elem => {
        return {
          id: elem.story_id,
          url: elem.story_image,
          type: 'image',
          duration: 10,
          isReadMore: true,
          url_readmore: 'https://github.com/iguilhermeluis',
          created: data.created_at,
        };
      }),
    };
    dispatch(setStories([temp]));
    setLoader(false);
  };

  const deleteStory = async id => {
    setLoader(true);
    // console.log(id);
    await axiosconfig
      .get(`story_delete/${storyID}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('afterDelete', res?.data?.message);
        Alert.alert(res?.data?.message);
        getStories(userToken);
        id(false);
        // console.log(myData1);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'hhe');
        // showToast(err.response);
      });
  };

  const deletePost = async id => {
    setLoader(true);
    console.log(id);
    await axiosconfig
      .get(`post_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('afterDelete', res?.data?.message);
        Alert.alert(res?.data?.message);
        getPosts(userToken);
        // console.log(myData1);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'hhe');
        // showToast(err.response);
      });
  };

  const deleteAlert = (title, text, id) => {
    //function to make two option alert
    Alert.alert(
      //This is title
      title,
      //This is body text
      text,
      [
        {
          text: 'Yes',
          onPress: () =>
            title == 'Delete Post' ? deletePost(id) : deleteStory(id),
        },
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //on clicking out side, Alert will not dismiss
    );
  };

  const renderItem = elem => {
    if (elem?.item?.privacy_option == '3' && elem?.item?.user?.id != userID) {
      return; //hide friends' only me posts
    }
    //check if the user already liked the post
    let liked = false;
    elem?.item?.post_likes?.forEach(t => {
      if (t?.user_id == userID) {
        liked = true;
      }
    });
    return (
      <View style={s.col}>
        <View style={s.header}>
          <View
            style={[s.dp, {borderColor: getColor(elem?.item?.user?.group)}]}>
            <Image
              source={{
                uri: elem?.item?.user?.image
                  ? elem?.item?.user?.image
                  : dummyImage,
              }}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
          <View style={[s.col, {flex: 0.9, marginTop: moderateScale(5, 0.1)}]}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ViewUser', {post: elem.item})
              }>
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.user?.name} {elem?.item?.user?.last_name}
              </Text>
            </TouchableOpacity>
            {elem?.item?.location ? (
              <>
                <Text style={[s.textRegular, {color: textColor}]}>
                  {elem?.item?.location}
                </Text>
              </>
            ) : null}
          </View>
          <View style={[s.options]}>
            <Menu
              w="150"
              borderWidth={moderateScale(1, 0.1)}
              borderColor={'grey'}
              backgroundColor={color}
              marginRight={moderateScale(15, 0.1)}
              marginTop={moderateScale(25, 0.1)}
              closeOnSelect={true}
              trigger={triggerProps => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                    style={{
                      flexDirection: 'row',
                      right: moderateScale(8, 0.1),
                    }}>
                    <Entypo
                      name={'dots-three-vertical'}
                      color={textColor}
                      size={moderateScale(15, 0.1)}
                    />
                  </Pressable>
                );
              }}>
              <Menu.Item
                onPress={() => {
                  hide(elem?.item?.id);
                }}>
                <View style={s.optionView}>
                  <Icon
                    name={'eye-slash'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    // style={{marginRight: moderateScale(10, 0.1)}}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns, {color: textColor}]}>Hide</Text>
                </View>
              </Menu.Item>

              {userID == elem?.item?.user?.id ? (
                <>
                  <Menu.Item
                    onPress={() =>
                      navigation.navigate('createPost', {
                        elem: elem?.item,
                        from: 'Home',
                      })
                    }>
                    <View style={s.optionView}>
                      <MaterialIcons
                        name={'edit'}
                        color={textColor}
                        size={moderateScale(13, 0.1)}
                        style={{flex: 0.3}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Edit
                      </Text>
                    </View>
                  </Menu.Item>
                </>
              ) : null}
              {userID == elem?.item?.user?.id ? (
                <>
                  <Menu.Item
                    onPress={() =>
                      deleteAlert(
                        'Delete Post',
                        'Are you sure you want to delete this post?',
                        elem?.item?.id,
                      )
                    }>
                    <View style={s.optionView}>
                      <Antdesign
                        name={'delete'}
                        color={textColor}
                        size={moderateScale(13, 0.1)}
                        style={{flex: 0.3}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Delete
                      </Text>
                    </View>
                  </Menu.Item>
                </>
              ) : null}
              <Menu.Item
                onPress={() => {
                  refRBSheet1.current.open();
                  setPostId(elem?.item?.id);
                }}>
                <View style={s.optionView}>
                  <MaterialIcons
                    name={'report'}
                    color="red"
                    size={moderateScale(13, 0.1)}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns]}>Report</Text>
                </View>
              </Menu.Item>
            </Menu>
          </View>
        </View>
        <View style={s.img}>
          <TouchableWithoutFeedback
            onPress={() => handleDoubleTap(elem?.item?.id, elem?.index)}>
            <View style={s.img}>
              <Image
                source={{uri: elem?.item?.image}}
                resizeMode={'cover'}
                style={s.galleryImage}></Image>
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => {
              send();
              hitLike(elem?.item?.id, elem?.index);
              // console.log(data[elem.index].post.liked);
            }}
            style={s.likes}>
            <Text style={s.likesCount}> {elem?.item?.post_likes?.length}</Text>

            <Icon
              name="heart"
              size={moderateScale(12, 0.1)}
              solid
              color={liked === true ? 'yellow' : '#fff'}
            />
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Likes', {data: elem?.item?.post_likes});
            }}
            style={{marginBottom: moderateScale(5, 0.1)}}>
            {elem?.item?.post_likes?.length ? (
              <Text style={[s.name, {color: textColor}]}>
                {`Liked by ${elem?.item?.post_likes[0]?.users?.name} ${elem?.item?.post_likes[0]?.users?.last_name} `}
                {elem?.item?.post_likes?.length - 1
                  ? `and ${elem?.item?.post_likes?.length - 1} other`
                  : null}
              </Text>
            ) : null}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginBottom: moderateScale(5, 0.1),
            }}>
            <Text style={[s.name, {color: textColor}]}>
              {elem?.item?.user?.name}
              {elem?.item?.user?.last_name}{' '}
              <Text style={[s.textRegular, {color: textColor}]}>
                {elem?.item?.caption}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Comments', {post: elem?.item});
            }}>
            <Text style={[s.textRegular, {color: 'grey', marginVertical: 0}]}>
              View all {elem?.item?.post_comments?.length} Comments
            </Text>
          </TouchableOpacity>
          <View style={s.input}>
            <Input
              w="100%"
              variant="unstyled"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View
                  style={[
                    s.smallDp,
                    {
                      borderColor: getColor(elem?.item?.user?.group),
                    },
                  ]}>
                  <Image
                    source={{
                      uri: elem?.item?.user?.image
                        ? elem?.item?.user?.image
                        : dummyImage,
                    }}
                    style={s.dp1}
                    resizeMode={'cover'}
                  />
                </View>
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    addComment(elem?.item?.id, elem?.index);
                  }}
                  style={{marginRight: moderateScale(15, 0.1)}}>
                  <Feather
                    name={'send'}
                    size={moderateScale(20, 0.1)}
                    color={'grey'}
                  />
                </TouchableOpacity>
              }
              // value={fname}
              onEndEditing={() => {
                // setDisable1(!disable1);
              }}
              placeholder="Add Comment ..."
              placeholderTextColor={'grey'}
              value={current == elem.index ? comment : ''}
              onChangeText={text => {
                setCurrent(elem.index);
                setComment(text);
              }}
            />
          </View>
          <View>
            <Text style={[s.textRegular, {color: 'grey', marginVertical: 0}]}>
              {`${new Date(elem?.item?.created_at).toLocaleString()}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <View style={[s.container, s.col, {backgroundColor: color}]}>
        <ScrollView
          scrollEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // alignItems: 'center',
            height: moderateScale(120, 0.1),
            marginVertical: moderateScale(20, 0.1),
            flexDirection: 'row',
          }}>
          {storiesData[0]?.stories?.length ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.open();
                }}
                style={[
                  s.addBtn,
                  {borderColor: color, top: moderateScale(50, 0.1)},
                ]}>
                <Icon
                  name={'plus'}
                  size={moderateScale(14, 0.1)}
                  solid
                  color={'blue'}
                />
              </TouchableOpacity>
              <Stories
                data={storiesData}
                theme={theme}
                deleteFunc={func =>
                  deleteAlert(
                    'Delete Story',
                    'Are you sure you want to delete this story?',
                    func,
                  )
                }
                color={storyCircle}
                setColorFun={setStoryCircle}
                navigation={navigation}
              />
              {/* <InstaStory
                data={Stories}
                duration={10}
                onStart={item => {
                  setStoryCircle('grey');
                  // setStoryID(13);
                  // console.log(item, 'storyryy');
                }}
                customStoryCircleListItem={item => {
                  console.log('hi');
                }}
                onClose={item => console.log('close: ', item)}
                showAvatarText={true}
                avatarTextStyle={{
                  color: textColor,
                  marginBottom: moderateScale(34, 0.1),
                }}
                customSwipeUpComponent={
                  <View
                    style={{
                      backgroundColor: '#000',
                      borderRadius: moderateScale(25, 0.1),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      variant={'link'}
                      onPressIn={() => {
                        deleteAlert(
                          'Delete Story',
                          'Are you sure you want to delete this story?',
                          '15',
                        );
                      }}
                    >
                      <Antdesign
                        name={'delete'}
                        size={moderateScale(20, 0.1)}
                        color={textColor}
                      />
                    </Button>
                  </View>
                }
                style={{
                  marginTop: moderateScale(5, 0.1),
                  marginRight: moderateScale(-15, 0.1),
                }}
                pressedBorderColor={storyCircle}
                unPressedBorderColor={'green'}
              /> */}
            </View>
          ) : (
            <>
              <View style={s.myStory}>
                <Image
                  source={{
                    uri: userData?.image ? userData?.image : dummyImage,
                  }}
                  width={undefined}
                  height={undefined}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: moderateScale(65, 0.1),
                  }}
                  resizeMode={'cover'}
                />
                <Text style={[s.userName, {color: textColor}]}>
                  {userData?.name} {userData?.last_name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.open();
                  }}
                  style={[s.addBtn, {borderColor: color}]}>
                  <Icon
                    name={'plus'}
                    size={moderateScale(14, 0.1)}
                    solid
                    color={'blue'}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          {otherStories?.length > 0 ? (
            <Stories
              data={otherStories}
              theme={theme}
              deleteFunc={() =>
                deleteAlert(
                  'Delete Story',
                  'Are you sure you want to delete this story?',
                )
              }
              navigation={navigation}
            />
          ) : // <InstaStory
          //   data={otherStories}
          //   duration={10}
          //   onStart={item => console.log(item)}
          //   onClose={item => console.log('close: ', item)}
          //   showAvatarText={true}
          //   avatarTextStyle={{
          //     color: textColor,
          //     marginBottom: moderateScale(34, 0.1),
          //   }}
          //   pressedBorderColor={'grey'}
          //   unPressedBorderColor={'green'}
          //   customSwipeUpComponent={
          //     <View>
          //       <Text>Swipe</Text>
          //     </View>
          //   }
          //   style={{
          //     marginTop: moderateScale(5, 0.1),
          //   }}
          // />
          null}
        </ScrollView>

        <TouchableOpacity
          style={s.funView}
          onPress={() => {
            // console.log('aaa');
            navigation.navigate('FunInteraction');
          }}>
          <View style={[s.yellow, s.round]}>
            <Fun
              width={moderateScale(12, 0.1)}
              height={moderateScale(12, 0.1)}
            />
          </View>
          <View
            style={[
              s.yellow,
              s.round2,
              {
                elevation: 30,
                shadowColor: 'black',
              },
            ]}>
            {funPostsData ? (
              <Text style={s.count}>{funPostsData?.length}</Text>
            ) : null}
          </View>
          <Text style={[s.funText, {color: textColor}]}>Fun Interaction</Text>
        </TouchableOpacity>
        <View style={{height: moderateScale(22, 0.1)}}></View>
        {!posts?.length ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginBottom: moderateScale(120, 0.1),
            }}>
            <Text style={[s.textCreate, {color: textColor}]}>
              {`What's on your mind`}{' '}
              {userData?.name ? `${userData?.name}?` : null}
            </Text>
            <TouchableOpacity
              style={s.btn}
              onPress={() => navigation.navigate('createPost')}>
              <View style={s.connected}>
                <Text style={[s.btnTxt]}>Create Post</Text>
                <Icon
                  name={'plus'}
                  size={moderateScale(15, 0.1)}
                  solid
                  color={'#000'}
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={posts}
            renderItem={(elem, index) => renderItem(elem)}
            keyExtractor={(elem, index) => {
              index.toString();
            }}
            extraData={refresh}
            getItemLayout={getItemLayout}
          />
        )}
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            alignItems: 'center',
            height: moderateScale(220),
            borderRadius: moderateScale(20, 0.1),
          },
        }}>
        <View
          style={{
            marginVertical: moderateScale(30, 0.1),
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Stack
            direction={{
              base: 'column',
              md: 'row',
            }}
            space={4}>
            <Button
              transparent
              style={s.capturebtn}
              onPressIn={() => captureImage('photo')}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="camera" style={s.capturebtnicon} />
                <Text style={s.capturebtntxt}>Open Camera</Text>
              </View>
            </Button>
            <Button
              transparent
              style={s.capturebtn}
              onPressIn={() => chooseFile('photo')}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="md-image-outline" style={s.capturebtnicon} />
                <Text style={s.capturebtntxt}>Open Gallery</Text>
              </View>
            </Button>
          </Stack>
        </View>
      </RBSheet>
      <RBSheet
        ref={refRBSheet1}
        closeOnDragDown={true}
        openDuration={250}
        customStyles={{
          container: {
            alignItems: 'center',
            height: moderateScale(480),
            borderRadius: moderateScale(20, 0.1),
            backgroundColor: color,
          },
        }}>
        {loader ? <Loader /> : null}
        <View
          style={{
            alignSelf: 'center',
            marginBottom: moderateScale(10, 0.1),
          }}>
          {/* {loader ? <Loader /> : null} */}
          <Text style={[s.rb, {color: textColor}]}>Report</Text>
        </View>
        <View
          style={{
            paddingHorizontal: moderateScale(13, 0.1),
          }}>
          <View style={[s.hv]}>
            <Text style={[s.hv, {color: textColor}]}>
              Why are you reporting this post?
            </Text>
          </View>
          <View>
            <Text style={[s.txt]}>
              In publishing and graphic design, Lorem ipsum is a placeholder
              text commonly used to demonstrate the visual form of a document or
              a typeface without relying on meaningful content. Lorem ipsum may
              be used as a placeholder before final copy is available
            </Text>
          </View>
          <View style={{display: 'flex'}}>
            <TouchableOpacity style={s.list}>
              <View>
                <Text style={[s.listTxt, {color: textColor}]}></Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('i just dont like it');
                report('i just dont like it');
              }}
              style={s.list}>
              <View>
                <Text style={[s.listTxt, {color: textColor}]}>
                  i just don't like it
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('its spam');
                report('its spam');
              }}
              style={s.list}>
              <View>
                <Text style={[s.listTxt, {color: textColor}]}>it's spam</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Nudity or sexual activity');
                report('Nudity or sexual activity');
              }}
              style={s.list}>
              <View>
                <Text style={[s.listTxt, {color: textColor}]}>
                  Nudity or sexual activity
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Hate speech or symbols');
                report('Hate speech or symbols');
              }}
              style={s.list}>
              <View>
                <Text style={[s.listTxt, {color: textColor}]}>
                  Hate speech or symbols
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Violence or dangerous orgnisations');
                report('Violence or dangerous orgnisations');
              }}
              style={s.list}>
              <View>
                <Text style={[s.listTxt, {color: textColor}]}>
                  Violence or dangerous orgnisations
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Bullying or harrasment');
                report('Bullying or harrasment');
              }}
              style={s.list}>
              <View>
                <Text style={[s.listTxt, {color: textColor}]}>
                  Bullying or harrasment
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Home;
