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
} from 'react-native';
import PhotoEditor from 'react-native-photo-editor';
import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import InstaStory from 'react-native-insta-story';
import {
  Input,
  Button,
  Stack,
  Menu,
  Pressable,
  HStack,
  Spinner,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native';
import Fun from '../../../assets/images/svg/fun.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import RNFS from 'react-native-fs';
import Loader from '../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosconfig from '../../../provider/axios';
import {useIsFocused} from '@react-navigation/native';
import {setGroup} from '../../../Redux/actions';

const Groups = [
  {id: 'Group 1', color: 'blue'},
  {id: 'Group 2', color: 'green'},
  {id: 'Group 3', color: 'red'},
  {id: 'Group 4', color: 'yellow'},
  {id: 'Group 5', color: 'orange'},
  {id: 'Group 6', color: 'brown'},
  {id: 'Group 7', color: 'pink'},
  {id: 'Group 8', color: 'purple'},
  {id: 'Group 9', color: 'blue'},
];
const myData = [
  {
    user_id: 1,
    user_image:
      'https://images.unsplash.com/photo-1616267624976-b45d3a7bac73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTl8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Your Story',
    post: {
      image: require('../../../assets/images/png/dp.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [],
  },
];
const data = [
  {
    user_id: 1,
    user_image:
      'https://images.unsplash.com/photo-1602545164910-81aecfd1413d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60g',
    user_name: 'Ahmet Çağlar Durmuş',
    post: {
      image: require('../../../assets/images/png/dp.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [
      {
        story_id: 1,
        story_image:
          'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
      },
    ],
  },
  {
    user_id: 2,
    user_image:
      'https://images.unsplash.com/photo-1627067324578-61af969907fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Test User',
    post: {
      image: require('../../../assets/images/png/dp.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: false,
    },
    stories: [
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 3,
    post: {
      image: require('../../../assets/images/png/dp.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: false,
    },
    user_image:
      'https://images.unsplash.com/photo-1592861394788-2935b53de467?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Test User',
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 4,
    user_image:
      'https://plus.unsplash.com/premium_photo-1664124888904-435121e89c74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Test User',
    post: {
      image: require('../../../assets/images/png/dp.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 5,
    user_image:
      'https://images.unsplash.com/photo-1602545164910-81aecfd1413d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60g',
    user_name: 'Test User',
    post: {
      image: require('../../../assets/images/png/dp.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
  const theme = useSelector(state => state.reducer.theme);
  const userToken = useSelector(state => state.reducer.userToken);
  const groups = useSelector(state => state.reducer.group);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';

  const [myData1, setMyData1] = useState(myData);
  const [searchText, setSearchText] = useState('');
  const [data1, setData1] = useState(data);
  const [refresh, setRefresh] = useState(true);
  const [path, setPath] = useState(null);
  const [myStories, setMyStories] = useState([]);
  const [storyCircle, setStoryCircle] = useState('green');
  const [loader, setLoader] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userID, setUserID] = useState('');
  const [comment, setComment] = useState('');
  const [current, setCurrent] = useState('');
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );

  useEffect(() => {
    dispatch(setGroup(Groups));
    getPosts();
    getID();
    // getStories();
    // console.log(loginId, 'dataaa');
    // let photoPath = RNFS.DocumentDirectoryPath + '/photo.jpg';
    // let binaryFile = Image.resolveAssetSource(
    //   require('../../../assets/images/jpg/photo.jpg'),
    // );
    // RNFetchBlob.config({fileCache: true})
    //   .fetch('GET', binaryFile.uri)
    //   .then(resp => {
    //     RNFS.moveFile(resp.path(), photoPath)
    //       .then(() => {
    //         console.log('FILE WRITTEN!');
    //       })
    //       .catch(err => {
    //         console.log(err.message);
    //       });
    //   })
    //   .catch(err => {
    //     console.log(err.message);
    //   });
  }, [myStories, isFocused]);

  const getID = async () => {
    const id = await AsyncStorage.getItem('id');
    setUserID(id);
  };

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
        console.log('data', JSON.stringify(res.data));
        setPosts(res?.data?.post_friends);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
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
        console.log('data', JSON.stringify(res.data));
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
    console.log('hello');
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
      maxWidth: 300,
      maxHeight: 550,
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
        convert(source);
        // setStoryImage(true);
      }
    });
  };

  const getColor = id => {
    let color;
    groups?.forEach(elem => {
      if (elem.id == id) {
        color = elem.color;
      }
    });
    return color;
  };

  const onPress = () => {
    PhotoEditor.Edit({
      path: RNFS.DocumentDirectoryPath + '/photo.jpg',
      stickers: [
        'sticker0',
        'sticker1',
        'sticker2',
        'sticker3',
        'sticker4',
        'sticker5',
        'sticker6',
        'sticker7',
        'sticker8',
        'sticker9',
        'sticker10',
      ],
      // hiddenControls: [
      //   'clear',
      //   'crop',
      //   'draw',
      //   'save',
      //   'share',
      //   'sticker',
      //   'text',
      // ],
      colors: undefined,
      onDone: res => {
        console.log('on done', res);
        setPath(`file://${res}`);
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
      },
      onCancel: () => {
        console.log('on cancel');
      },
    });
  };

  const convert = source => {
    let photoPath = RNFS.DocumentDirectoryPath + '/photo.jpg';
    // let binaryFile = Image.resolveAssetSource(require('./assets/photo.jpg'));

    RNFS.moveFile(source.assets[0].uri, photoPath)
      .then(() => {
        console.log('FILE WRITTEN!');
        onPress();
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const addStory = story => {
    setMyData1([
      {
        ...myData1[0],
        stories: story,
      },
    ]);
    // setLoader(false);
  };

  const addComment = async (id, index) => {
    setLoader(true);
    console.log('hisss', id);
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
        console.log('data', JSON.stringify(res.data));
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

  const renderItem = elem => {
    // if (elem?.item?.privacy_option == '3') {
    //   return; //hide friends' only me posts
    // }

    //check if the user already liked the post
    let liked = false;
    elem?.item?.post_likes?.forEach(t => {
      if (t?.user_id == userID) {
        liked = true;
      }
    });
    console.log(liked);
    return (
      <View style={s.col}>
        <View style={s.header}>
          <View
            style={[s.dp, {borderColor: getColor(elem?.item?.user?.group)}]}
          >
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
            <TouchableOpacity onPress={() => navigation.navigate('ViewUser')}>
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.user?.name}
              </Text>
            </TouchableOpacity>
            <Text style={[s.textRegular, {color: textColor}]}>
              {elem?.item?.user?.location}
            </Text>
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
                    }}
                  >
                    <Entypo
                      name={'dots-three-vertical'}
                      color={textColor}
                      size={moderateScale(15, 0.1)}
                    />
                  </Pressable>
                );
              }}
            >
              <Menu.Item onPress={() => {}}>
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
              <Menu.Item onPress={() => {}}>
                <View style={s.optionView}>
                  <MaterialIcons
                    name={'report'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns, {color: textColor}]}>Report</Text>
                </View>
              </Menu.Item>
            </Menu>
          </View>
        </View>
        <View style={s.img}>
          <TouchableWithoutFeedback
            onPress={() => handleDoubleTap(elem?.item?.id, elem?.index)}
          >
            <Image
              source={{uri: elem?.item?.image}}
              width={undefined}
              height={undefined}
              resizeMode={'cover'}
              style={{
                width: '95%',
                height: moderateScale(270, 0.1),
                borderRadius: moderateScale(10, 0.1),
                paddingHorizontal: moderateScale(10, 0.1),
                alignSelf: 'center',
              }}
            />
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => {
              hitLike(elem?.item?.id, elem?.index);
              // console.log(data[elem.index].post.liked);
            }}
            style={s.likes}
          >
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
          <Text style={[s.name, {color: textColor}]}>
            {elem?.item?.user?.name}
          </Text>
          <Text style={[s.textRegular, {color: textColor}]}>
            {elem?.item?.caption}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Comments', {post: elem?.item});
            }}
          >
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
                  ]}
                >
                  <Image
                    source={{uri: elem?.item?.user?.image}}
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
                  style={{marginRight: moderateScale(10, 0.1)}}
                >
                  <Feather
                    name={'send'}
                    size={moderateScale(15, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
              // value={fname}
              onEndEditing={() => {
                // setDisable1(!disable1);
              }}
              // isReadOnly={!disable1}
              // isFocused={disable1}
              placeholder="Add Comment ..."
              placeholderTextColor={'grey'}
              value={current == elem.index ? comment : ''}
              onChangeText={text => {
                setCurrent(elem.index);
                setComment(text);
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      <View style={[s.container, s.col, {backgroundColor: color}]}>
        {loader ? <Loader /> : null}
        <View style={s.searchContainer}>
          <Input
            placeholder="Search Here"
            placeholderTextColor={'#B9B9B9'}
            onChangeText={text => setSearchText(text)}
            value={searchText}
            marginTop={moderateScale(10, 0.1)}
            w={'95%'}
            h={moderateScale(37, 0.1)}
            variant="rounded"
            InputLeftElement={
              <View style={{paddingLeft: 10}}>
                <Icon
                  name="search"
                  size={moderateScale(25, 0.1)}
                  color={'#B9B9B9'}
                />
              </View>
            }
            InputRightElement={
              <TouchableOpacity
                // onPress={() => handleCancel()}
                style={{paddingRight: 10}}
              >
                {searchText ? (
                  <Entypo
                    name={'cross'}
                    size={moderateScale(20, 0.1)}
                    color={'#B9B9B9'}
                  />
                ) : null}
              </TouchableOpacity>
            }
            color={'#fff'}
            backgroundColor={'#595757'}
          />
        </View>
        <ScrollView
          scrollEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {myStories.length > 0 ? (
            <>
              <InstaStory
                data={myData1}
                duration={10}
                onStart={item => setStoryCircle('grey')}
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
                    }}
                  >
                    <Button
                      variant={'link'}
                      onPress={() => {
                        refRBSheet.current.open();
                      }}
                    >
                      <Icon
                        name={'plus'}
                        size={moderateScale(14, 0.1)}
                        solid
                        color={'#fff'}
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
              />
            </>
          ) : (
            <>
              <View style={s.myStory}>
                <Image
                  source={{
                    uri:
                      'https://images.unsplash.com/photo-1616267624976-b45d3a7bac73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTl8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
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
                <Text style={[s.userName, {color: textColor}]}>Your Story</Text>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.open();
                  }}
                  style={[s.addBtn, {borderColor: color}]}
                >
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

          <InstaStory
            data={data}
            duration={10}
            onStart={item => console.log(item)}
            onClose={item => console.log('close: ', item)}
            showAvatarText={true}
            avatarTextStyle={{
              color: textColor,
              marginBottom: moderateScale(34, 0.1),
            }}
            pressedBorderColor={'grey'}
            unPressedBorderColor={'green'}
            customSwipeUpComponent={
              <View>
                <Text>Swipe</Text>
              </View>
            }
            style={{
              marginTop: moderateScale(5, 0.1),
            }}
          />
        </ScrollView>

        <TouchableOpacity
          style={s.funView}
          onPress={() => navigation.navigate('FunInteraction')}
        >
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
            ]}
          >
            <Text style={s.count}>5</Text>
          </View>
          <Text style={[s.funText, {color: textColor}]}>Fun Interaction</Text>
        </TouchableOpacity>

        <FlatList
          data={posts}
          renderItem={(elem, index) => renderItem(elem)}
          keyExtractor={(elem, index) => {
            index.toString();
          }}
          extraData={refresh}
        />
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
        }}
      >
        <View
          style={{
            marginVertical: moderateScale(30, 0.1),
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <Stack
            direction={{
              base: 'column',
              md: 'row',
            }}
            space={4}
          >
            <Button
              transparent
              style={s.capturebtn}
              onPress={() => captureImage('photo')}
            >
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="camera" style={s.capturebtnicon} />
                <Text style={s.capturebtntxt}>Open Camera</Text>
              </View>
            </Button>
            <Button
              transparent
              style={s.capturebtn}
              onPress={() => chooseFile('photo')}
            >
              <View style={{flexDirection: 'row'}}>
                <Ionicons name="md-image-outline" style={s.capturebtnicon} />
                <Text style={s.capturebtntxt}>Open Gallery</Text>
              </View>
            </Button>
          </Stack>
        </View>
      </RBSheet>
      {/* </>
      )} */}
    </SafeAreaView>
  );
};

export default Home;

//  {optionsModal && elem.index == selectedIndex ? (
//         <View style={[s.modal, {backgroundColor: color}]}>
//           <Button
//             backgroundColor={color}
//             margin={0}
//             padding={0}
//             variant={'link'}
//             justifyContent={'flex-start'}
//           >
//             <View
//               style={[s.optionView, {marginVertical: moderateScale(5, 0.1)}]}
//             >
//               <Icon
//                 name={'eye-slash'}
//                 color={textColor}
//                 solid
//                 size={moderateScale(12, 0.1)}
//               />
//               <Text style={[s.optionBtns, {color: textColor}]}>Hide</Text>
//             </View>
//           </Button>
//           <Button
//             backgroundColor={color}
//             margin={0}
//             padding={0}
//             variant={'link'}
//             justifyContent={'flex-start'}
//           >
//             <View style={s.optionView}>
//               <MaterialIcons
//                 name={'report'}
//                 color={textColor}
//                 size={moderateScale(13, 0.1)}
//               />
//               <Text style={[s.optionBtns, {color: textColor}]}>Report</Text>
//             </View>
//           </Button>
//         </View>
//       ) : null}
