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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

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
  const theme = useSelector(state => state.reducer.theme);
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
  useEffect(() => {
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
  }, [myStories]);

  var lastTap = null;
  const handleDoubleTap = index => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      toggleLike(index);
    } else {
      lastTap = now;
    }
  };
  const toggleLike = index => {
    console.log('hello');
    data[index].post.liked = !data[index].post.liked;
    setData1(data);
    setRefresh(data[index].post.liked);
    console.log(data[index].post.liked);
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

  const renderItem = elem => {
    return (
      <View style={s.col}>
        <View style={s.header}>
          <View style={s.dp}>
            <Image
              source={{uri: elem.item.user_image}}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
          <View style={[s.col, {flex: 0.9, marginTop: moderateScale(5, 0.1)}]}>
            <TouchableOpacity onPress={() => navigation.navigate('ViewUser')}>
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.user_name}
              </Text>
            </TouchableOpacity>
            <Text style={[s.textRegular, {color: textColor}]}>
              {elem?.item?.post?.location}
            </Text>
          </View>
          <View style={[s.options]}>
            <Menu
              w="150"
              borderWidth={moderateScale(1, 0.1)}
              borderColor={'grey'}
              backgroundColor={color}
              // alignItems={'center'}
              // justifyContent={'center'}
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
          <TouchableWithoutFeedback onPress={() => handleDoubleTap(elem.index)}>
            <Image
              source={elem?.item?.post?.image}
              width={undefined}
              height={undefined}
              resizeMode={'contain'}
              style={{width: '100%'}}
            />
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => {
              toggleLike(elem.index);
              // console.log(data[elem.index].post.liked);
            }}
            style={s.likes}
          >
            <Text style={s.likesCount}> {elem?.item?.post?.likes}</Text>

            <Icon
              name="heart"
              size={moderateScale(12, 0.1)}
              solid
              color={elem?.item?.post?.liked === true ? 'yellow' : '#fff'}
            />
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <Text style={[s.name, {color: textColor}]}>
            {elem?.item?.user_name}
          </Text>
          <Text style={[s.textRegular, {color: textColor}]}>
            {elem?.item?.post?.caption}
          </Text>
        </View>
      </View>
    );
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
        setLoader(true);
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
    setLoader(false);
  };

  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {/* {storyImage ? (
        <Editor
          images={images}
          onPressCreate={e => console.log(e)} // In the logs you will receive an object with settings for changed images and the settings of the editor itself .If the image has not been changed, the original data will be returned.
          onPressGoBack={() => navigation.goBack()} // By clicking on the back button, you can return to the previous page or close the modal window
          initialSettingsForBackend={null} // If you pass here an object with settings for the image and the editor, then you can start editing from the last edit
        />
      ) : (
        <> */}

      <View style={[s.container, s.col, {backgroundColor: color}]}>
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
          data={data1}
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
