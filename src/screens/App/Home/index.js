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
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
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
import { ScrollView } from 'react-native';
import Fun from '../../../assets/images/svg/fun.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import SearchDropDown from '../../../Components/SearchDropDown';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import RNFS from 'react-native-fs';
import Loader from '../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosconfig from '../../../provider/axios';
import { useIsFocused } from '@react-navigation/native';
import { setGroup, setStories } from '../../../Redux/actions';

const Groups = [
  { id: 'Group 1', color: 'blue' },
  { id: 'Group 2', color: 'green' },
  { id: 'Group 3', color: 'red' },
  { id: 'Group 4', color: 'yellow' },
  { id: 'Group 5', color: 'orange' },
  { id: 'Group 6', color: 'brown' },
  { id: 'Group 7', color: 'pink' },
  { id: 'Group 8', color: 'purple' },
  { id: 'Group 9', color: 'blue' },
];

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const isFocused = useIsFocused();
  const theme = useSelector(state => state.reducer.theme);
  const userToken = useSelector(state => state.reducer.userToken);
  const groups = useSelector(state => state.reducer.group);
  const Stories = useSelector(state => state.reducer.stories);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [myData1, setMyData1] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [path, setPath] = useState(null);
  const [myStories, setMyStories] = useState([]);
  const [storyCircle, setStoryCircle] = useState('green');
  const [loader, setLoader] = useState(false);
  const [posts, setPosts] = useState([]);
  const [userID, setUserID] = useState('');
  const [comment, setComment] = useState('');
  const [current, setCurrent] = useState('');
  const [otherStories, setOtherStories] = useState([]);
  const [storyImage, setStoryImage] = useState('');
  const [postId, setPostId] = useState(null);
  const [text, setText] = useState(null);
const [funPostsData, setFunPostsData] = useState('')
  // const [myStories, setMyStories] = useState('')
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [dataSource, setDataSource] = useState([]);
  const [filtered, setFiltered] = useState(dataSource);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    dispatch(setGroup(Groups));
    getPosts();
    getID();
    funPosts()
    console.log(Stories, 'sstostst');
    // getStory();
    // getStories();
  
  }, [isFocused]);

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
        console.log('Posts', JSON.stringify(res.data.post_friends));
        console.log('Other Stories', JSON.stringify(res?.data?.stories));

        setPosts(res?.data?.post_friends);
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
        console.log('public post', JSON.stringify(res?.data?.post_public));
        const data = res?.data?.post_public;

        setFunPostsData(res?.data?.post_public);
        
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };
  const report = async () => {
    setLoader(true);
    const data = {
      post_id: postId,
      text: text,
    };
    await axiosconfig
      .post('post-report', data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log('Posts', res.data);
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
  const hide = async () => {
    setLoader(true);
    await axiosconfig
      .get(`post_action/${postId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log('Posts', res.data);
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
        user_image: elem.image,
        group: elem.group,
        user_name: elem.name,
        stories: elem.stories,
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
        // console.log(source)
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

  const _onPress = async (imageToeEdit) => {
    setTimeout(() => {
      console.log(imageToeEdit, 'eitors');

      try {
        PhotoEditor.Edit({
          path: Platform.OS == 'ios' ? imageToeEdit : RNFS.DocumentDirectoryPath + '/photo.jpg',
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
            convertToBase64(`file://${res}`);
            let temp = Stories[0].stories;
            temp.push({
              story_id: Stories[0]?.stories?.length + 1,
              story_image: `file://${res}`,
              swipeText: 'Custom swipe text for this story',
              // onPress: () => console.log('story 1 swiped'),
            });
            // setLoader(true);
            setMyStories(temp);
            dispatch(setStories([{...Stories[0], stories: temp}]));
            setStoryCircle('green');
            // addStory(myStories);
          },
          onCancel: () => {
            console.log('on cancel');
          },
        });
      } catch (err) {
        console.log(err)
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
        setStoryImage(base64);
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
      setLoader(false);
      return;
    }
    const data = {
      story_id: Stories[0]?.stories?.length + 1,
      image: base64,
      swipe_text: 'Custom swipe text for this story',
      privacy_option: '1',
    };
    await axiosconfig
      .post(`story_store`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log('data', JSON.stringify(res.data));
        // setComment('');
        // getPosts();
        // setRefresh(!refresh);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // Alert.alert(err);
      });
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
    if (
      elem?.item?.privacy_option == '3' &&
      elem?.item?.user?.id != Stories[0].user_id
    ) {
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
            style={[s.dp, { borderColor: getColor(elem?.item?.user?.group) }]}
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
          <View style={[s.col, { flex: 0.9, marginTop: moderateScale(5, 0.1) }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ViewUser', { post: elem.item })}
            >
              <Text style={[s.name, s.nameBold, { color: textColor }]}>
                {elem?.item?.user?.name} {elem?.item?.user?.last_name}
              </Text>
            </TouchableOpacity>
            <Text style={[s.textRegular, { color: textColor }]}>
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
              <Menu.Item onPress={() => hide()}>
                <View style={s.optionView}>
                  <Icon
                    name={'eye-slash'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    // style={{marginRight: moderateScale(10, 0.1)}}
                    style={{ flex: 0.3 }}
                  />
                  <Text style={[s.optionBtns, { color: textColor }]}>Hide</Text>
                </View>
              </Menu.Item>

              {userID == elem?.item?.user?.id ? (
                <>
                  <Menu.Item
                    onPress={() =>
                      navigation.navigate('createPost', {
                        elem: elem?.item,
                        screen: 'Home',
                      })
                    }
                  >
                    <View style={s.optionView}>
                      <MaterialIcons
                        name={'edit'}
                        color={textColor}
                        size={moderateScale(13, 0.1)}
                        style={{ flex: 0.3 }}
                      />
                      <Text style={[s.optionBtns, { color: textColor }]}>
                        Edit
                      </Text>
                    </View>
                  </Menu.Item>
                </>
              ) : null}
              <Menu.Item
                onPress={() => {
                  refRBSheet1.current.open();
                  setPostId(elem?.item?.id);
                }}
              >
                <View style={s.optionView}>
                  <MaterialIcons
                    name={'report'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    style={{ flex: 0.3 }}
                  />
                  <Text style={[s.optionBtns, { color: textColor }]}>Report</Text>
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
              source={{ uri: elem?.item?.image }}
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
          <Text style={[s.name, { color: textColor }]}>
            {elem?.item?.user?.name} {elem?.item?.user?.last_name}
          </Text>
          <Text style={[s.textRegular, { color: textColor }]}>
            {elem?.item?.caption}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Comments', { post: elem?.item });
            }}
          >
            <Text style={[s.textRegular, { color: 'grey', marginVertical: 0 }]}>
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
                    source={{ uri: elem?.item?.user?.image }}
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
                  style={{ marginRight: moderateScale(15, 0.1) }}
                >
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
    <SafeAreaView style={{ display: 'flex', flex: 1, backgroundColor: color }}>
      <View style={[s.container, s.col, { backgroundColor: color }]}>
        {loader ? <Loader /> : null}
        <ScrollView
          scrollEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // alignItems: 'center',
            marginTop: moderateScale(10, 0.1),
            flexDirection: 'row',
          }}
        >
          {Stories[0]?.stories?.length ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.open();
                }}
                style={[
                  s.addBtn,
                  { borderColor: color, bottom: moderateScale(15, 0.1) },
                ]}
              >
                <Icon
                  name={'plus'}
                  size={moderateScale(14, 0.1)}
                  solid
                  color={'blue'}
                />
              </TouchableOpacity>
              <InstaStory
                data={Stories}
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
                      onPressIn={() => {
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
            </View>
          ) : (
            <>
              <View style={s.myStory}>
                <Image
                  source={{
                    uri: Stories[0]?.user_image
                      ? Stories[0]?.user_image
                      : dummyImage,
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
                <Text style={[s.userName, { color: textColor }]}>Your Story</Text>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet.current.open();
                  }}
                  style={[s.addBtn, { borderColor: color }]}
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
          {otherStories?.length > 0 ? (
            <InstaStory
              data={otherStories}
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
          ) : null}
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
            {funPostsData?  (<Text style={s.count}>{funPostsData?.length}</Text>): (null)}
            
          </View>
          <Text style={[s.funText, { color: textColor }]}>Fun Interaction</Text>
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
              onPressIn={() => captureImage('photo')}
            >
              <View style={{ flexDirection: 'row' }}>
                <Ionicons name="camera" style={s.capturebtnicon} />
                <Text style={s.capturebtntxt}>Open Camera</Text>
              </View>
            </Button>
            <Button
              transparent
              style={s.capturebtn}
              onPressIn={() => chooseFile('photo')}
            >
              <View style={{ flexDirection: 'row' }}>
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
            backgroundColor: '#222222',
          },
        }}
      >
        {loader ? <Loader /> : null}
        <View
          style={{
            alignSelf: 'center',
            marginBottom: moderateScale(10, 0.1),
          }}
        >
          {/* {loader ? <Loader /> : null} */}
          <Text style={[s.rb, { color: textColor }]}>Report</Text>
        </View>
        <View
          style={{
            paddingHorizontal: moderateScale(13, 0.1),
          }}
        >
          <View style={[s.hv]}>
            <Text style={[s.hv, { color: textColor }]}>
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
          <View style={{ display: 'flex' }}>
            <TouchableOpacity style={s.list}>
              <View>
                <Text style={[s.listTxt, { color: textColor }]}></Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('i just dont like it');
                report();
              }}
              style={s.list}
            >
              <View>
                <Text style={[s.listTxt, { color: textColor }]}>
                  i just don't like it
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('its spam');
                report();
              }}
              style={s.list}
            >
              <View>
                <Text style={[s.listTxt, { color: textColor }]}>it's spam</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Nudity or sexual activity');
                report();
              }}
              style={s.list}
            >
              <View>
                <Text style={[s.listTxt, { color: textColor }]}>
                  Nudity or sexual activity
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Hate speech or symbols');
                report();
              }}
              style={s.list}
            >
              <View>
                <Text style={[s.listTxt, { color: textColor }]}>
                  Hate speech or symbols
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Violence or dangerous orgnisations');
                report();
              }}
              style={s.list}
            >
              <View>
                <Text style={[s.listTxt, { color: textColor }]}>
                  Violence or dangerous orgnisations
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setText('Bullying or harrasment');
                report();
              }}
              style={s.list}
            >
              <View>
                <Text style={[s.listTxt, { color: textColor }]}>
                  Bullying or harrasment
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
      {/* </>
      )} */}
    </SafeAreaView>
  );
};

export default Home;
