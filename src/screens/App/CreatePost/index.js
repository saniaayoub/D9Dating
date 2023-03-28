import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import {setTheme} from '../../../Redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import Header from '../../../Components/Header';
import Vector from '../../../assets/images/png/Vector.png';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button, Stack, Menu, Pressable, Input} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../Components/Loader';
import {useIsFocused} from '@react-navigation/native';

import {
  launchCamera,
  launchImageLibrary,
  showImagePicker,
} from 'react-native-image-picker';
import axiosconfig from '../../../provider/axios';
import RNFS from 'react-native-fs';

// import DropDownPicker from 'react-native-dropdown-picker';

const CreatePost = ({navigation, route}) => {
  const privacy = route?.params?.elem?.user?.post_privacy;

  useEffect(() => {
    if (privacy == '1') {
      setStory('Public');
    } else if (privacy == '2') {
      setStory('Friends');
    } else {
      setStory('Only Me');
    }
    console.log('aaaaa');
  }, []);

  const theme = useSelector(state => state.reducer.theme);
  const [filePath, setFilePath] = useState(
    route?.params?.screen == 'Home' || 'funInteraction'
      ? route?.params?.elem?.image
      : [],
  );
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState('globe');
  const [caption, setCaption] = useState(
    route?.params?.screen == 'Home' || 'funInteraction'
      ? route?.params?.elem?.caption
      : // : route?.params?.screen == 'map'
        // ? route?.params?.item.caption
        '',
  );
  const [story, setStory] = useState('Public');
  const [loader, setLoader] = useState(false);
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState([]);
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );

  const [value, setValue] = useState([
    {
      label: 'Public',
      value: '1',
      icon: () => (
        <Entypo
          name={'globe'}
          color={Textcolor}
          size={moderateScale(15, 0.1)}
        />
      ),
    },
    {
      label: 'Freinds',
      value: '2',
      icon: () => (
        <Icon
          name={'user-friends'}
          color={Textcolor}
          size={moderateScale(15, 0.1)}
        />
      ),
    },
    {
      label: 'Only me',
      value: '3',
      icon: () => (
        <Entypo name={'lock'} color={Textcolor} size={moderateScale(15, 0.1)} />
      ),
    },
  ]);
  const Textcolor = theme === 'dark' ? '#fff' : '#222222';
  const color = theme === 'dark' ? '#222222' : '#fff';
  const userToken = useSelector(state => state.reducer.userToken);
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const postLocation = useSelector(state => state.reducer.postLocation);
  const [location, setLocation] = useState(
    route?.params?.screen == 'Home' || 'funInteraction'
      ? route?.params?.elem?.location
      : [postLocation],
  );
  console.log(postLocation, 'postLocation');
  console.log(location, 'location');

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
    if (isCameraPermitted && isStoragePermitted) {
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

        convertImage(response.assets[0].uri);
        refRBSheet.current.close();
        console.log(filePath, 'image');
      });
    }
  };

  const convertImage = async image => {
    await RNFS.readFile(image, 'base64')
      .then(res => {
        let base64 = `data:image/png;base64,${res}`;
        setFilePath(base64);
      })
      .catch(err => {
        console.log(err);
      });
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
        console.log(source.assets[0].uri, 'uri');

        convertImage(source.assets[0].uri);
        console.log(filePath, 'filepath');
        refRBSheet.current.close();
      }
    });
  };
  const onsubmit = () => {
    console.log(userToken);
    if (caption == '') {
      alert('please fill given fields');
      return;
    }
    if (filePath == '') {
      alert('please fill given fields');
      return;
    } else {
      let data = {
        image: filePath,
        caption: caption,
        privacy_option:
          story == 'Public' ? '1' : story == 'Friends' ? '2' : '3',
        location:
          route?.params?.screen == 'Home' || 'funInteraction'
            ? route?.params?.elem?.location
            : postLocation,
      };
      console.log(data, 'dataaaa');
      // setLoader(true);
      axiosconfig
        .post(
          route?.params?.screen == 'Home'
            ? `post_update/${route.params.elem.id}`
            : 'post_store',
          data,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        )
        .then(res => {
          // setLoader(false);
          alert(res?.data?.message);
          console.log(res, 'post');
          setFilePath('');
          setCaption('');
          navigation.navigate('Home');
        })
        .catch(err => {
          // setLoader(false);
          console.log(err, 'aaa');
          Alert.alert(err?.response?.data?.message);
        });
    }
  };
  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    console.log('get data ');
    let SP = await AsyncStorage.getItem('id');
    setLoader(true);
    axiosconfig
      .get(`user_view/${SP}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data user', res?.data?.user_details);
        setUserData(res?.data?.user_details);
        // if (res.data.user_details) {
        //   setData(res.data.user_details);
        // }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };
  return (
    <View
      style={{flex: 1, backgroundColor: theme == 'dark' ? '#222222' : '#fff'}}
    >
      <View style={[s.container]}>
        <View>
          <Header navigation={navigation} />
        </View>
        <View style={s.row}>
          <View style={{flex: 0.2}}>
            <Image
              style={s.headerImage}
              source={{uri: userData?.image ? userData?.image : dummyImage}}
            />
          </View>
          <View style={{flex: 0.8, alignSelf: 'center'}}>
            <View>
              <Text style={[s.HeadingTxt, {color: Textcolor}]}>
                {userData?.name}
                {userData?.last_name}
              </Text>
            </View>
            <View style={[s.btn]}>
              <Menu
                w="180"
                borderWidth={moderateScale(1, 0.1)}
                borderBottomColor={'grey'}
                backgroundColor={color}
                // marginRight={moderateScale(5, 0.1)}

                top={moderateScale(24, 0.1)}
                borderColor={Textcolor}
                trigger={triggerProps => {
                  return (
                    <Pressable
                      accessibilityLabel="More options menu"
                      {...triggerProps}
                      style={{
                        flexDirection: 'row',
                        borderColor: 'white',
                        borderWidth: 1,
                        marginVertical: moderateScale(7),
                        borderRadius: moderateScale(8, 0.1),
                        paddingLeft: moderateScale(10, 0.1),
                        width: moderateScale(180, 0.1),
                        height: moderateScale(33, 0.1),
                        // justifyContent:'center',
                        alignItems: 'center',
                      }}
                    >
                      <Entypo
                        name={icon}
                        color={Textcolor}
                        size={moderateScale(15, 0.1)}
                        style={{flex: 0.2}}
                      />
                      <Text style={[s.option, {color: Textcolor, flex: 0.6}]}>
                        {story}
                      </Text>

                      <Entypo
                        style={{flex: 0.2}}
                        name={'chevron-down'}
                        size={moderateScale(25, 0.1)}
                        color={Textcolor}
                      />
                    </Pressable>
                  );
                }}
              >
                <Menu.Item
                  onPress={() => {
                    setStory('Public');
                    setIcon('globe');
                  }}
                >
                  <View style={s.optionView}>
                    <Entypo
                      name={'globe'}
                      color={Textcolor}
                      size={moderateScale(15, 0.1)}
                      style={{marginRight: moderateScale(10, 0.1)}}
                    />
                    <Text style={[s.optionBtns, {color: Textcolor}]}>
                      Public
                    </Text>
                  </View>
                </Menu.Item>
                <Menu.Item
                  onPress={() => {
                    setStory('Friends');
                    setIcon('users');
                  }}
                >
                  <View style={s.optionView}>
                    <Entypo
                      name={'users'}
                      color={Textcolor}
                      size={moderateScale(15, 0.1)}
                      style={{marginRight: moderateScale(10, 0.1)}}
                    />
                    <Text style={[s.optionBtns, {color: Textcolor}]}>
                      Friends
                    </Text>
                  </View>
                </Menu.Item>
                <Menu.Item
                  onPress={() => {
                    setStory('Only Me');
                    setIcon('lock');
                  }}
                >
                  <View style={s.optionView}>
                    <Entypo
                      name={'lock'}
                      color={Textcolor}
                      size={moderateScale(15, 0.1)}
                      style={{marginRight: moderateScale(10, 0.1)}}
                    />
                    <Text style={[s.optionBtns, {color: Textcolor}]}>
                      Only Me
                    </Text>
                  </View>
                </Menu.Item>
              </Menu>
            </View>
          </View>
        </View>
        <View style={[s.mText]}>
          <Input
            variant="unstyled"
            placeholder={'Write a caption....'}
            placeholderTextColor={Textcolor}
            value={caption}
            onChangeText={text => {
              setCaption(text);
            }}
            backgroundColor={color}
            color={Textcolor}
            fontSize={moderateScale(14, 0.1)}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            route?.params?.screen == 'Home' || 'funInteraction'
              ? console.log('aajaj')
              : navigation.navigate('Map', {
                  screen: 'createPost',
                });
          }}
        >
          <View style={[s.mText]}>
            <Input
              variant="unstyled"
              placeholder={'Enter location...'}
              placeholderTextColor={Textcolor}
              isReadOnly
              value={postLocation}
              onChangeText={text => {
                setCaption(text);
              }}
              backgroundColor={color}
              color={Textcolor}
              fontSize={moderateScale(14, 0.1)}
            />
            {/* <Text style={[s.mainText, {color: Textcolor}]}>
            What's on your Mind
          </Text> */}
          </View>
        </TouchableOpacity>
        {/* <View style={[s.location,]}>
          
          <Text style={{color:'red',
          fontSize: moderateScale(18,0.1),
          paddingVertical: moderateScale(7,0.1),
          paddingHorizontal: moderateScale(15,0.1)
          }}>{location ? location : 'Add location'}</Text>
          
        </View> */}
        <View style={[s.imgView, {zIndex: -1}]}>
          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            {filePath?.length != 0 ? (
              <>
                <View style={s.img}>
                  <Image
                    source={{uri: filePath}}
                    style={s.galleryImage}
                  ></Image>
                </View>
              </>
            ) : (
              <>
                <View style={s.img}>
                  <Image
                    style={{
                      width: moderateScale(153, 0.1),
                      height: moderateScale(136, 0.1),
                    }}
                    source={require('../../../assets/images/png/Vector.png')}
                  />
                  <View
                    style={{position: 'absolute', top: moderateScale(100, 0.1)}}
                  >
                    <Ionicons
                      name="add-circle-sharp"
                      size={45}
                      color="#302D2D"
                    />
                  </View>
                </View>
              </>
            )}

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
                      <Ionicons
                        name="md-image-outline"
                        style={s.capturebtnicon}
                      />
                      <Text style={s.capturebtntxt}>Open Gallery</Text>
                    </View>
                  </Button>
                </Stack>
              </View>
            </RBSheet>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onsubmit()}>
          <View style={[s.postBtn, {borderColor: Textcolor}]}>
            <Text style={[s.postTxt, {color: Textcolor}]}>Post</Text>
          </View>
        </TouchableOpacity>
        {open ? (
          <>
            <View
              style={{
                height: moderateScale(50, 0.1),
                width: moderateScale(60, 0.1),
              }}
            ></View>
          </>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default CreatePost;

// const styles = StyleSheet.create({});
