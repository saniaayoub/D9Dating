import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
  Alert,
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import InstaStory from 'react-native-insta-story';
import {Input, Button, Menu, Pressable} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Pin from 'react-native-vector-icons/SimpleLineIcons';
import {ScrollView} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Loader from '../../../../Components/Loader';
import axiosconfig from '../../../../Providers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused} from '@react-navigation/native';
import Antdesign from 'react-native-vector-icons/AntDesign';
import PushNotification from 'react-native-push-notification';
import io from 'socket.io-client';
import socket from '../../../../utils/socket';
import styles from './style';
import {useNavigation, useRoute} from '@react-navigation/native';
const SERVER_URL = 'http://your-server-address';

const FunInteraction = ({}) => {
  const dispatch = useDispatch();
  const refRBSheet1 = useRef();
  const scrollViewRef = useRef();
  const isFocused = useIsFocused();
  const organizations = useSelector(state => state.reducer.organization);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [postId, setPostId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [loader, setLoader] = useState(true);
  const [publicPost, setPublicPost] = useState([]);
  const [text, setText] = useState(null);
  const [userID, setUserID] = useState('');
  const [current, setCurrent] = useState('');
  const [comment, setComment] = useState('');
  const [itemHeights, setItemHeights] = useState([]);
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [dataSource, setDataSource] = useState([]);
  const [filtered, setFiltered] = useState(dataSource);
  const [searching, setSearching] = useState(false);
  const userToken = useSelector(state => state.reducer.userToken);
  const [soc, setSoc] = useState(null);
  const [dataSourceCords, setDataSourceCords] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const flatListRef = useRef(null);
  // Access the notification data from the route parameters
  const postID = route?.params?.data?.id;
  console.log(route?.params?.data?.id, 'postidf');
  useEffect(() => {
    const socket = io(socket);
    setSoc(socket);
    setUserId(userID);

    // Clean up Socket.IO client on unmount
    return () => {
      socket.disconnect();
      setSoc(null);
      setUserId(null);
    };
  }, []);

  // Emit 'likePost' event on post like
  const handleLikePost = postId => {
    if (soc) {
      soc.emit('likePost', {postId, userId});
    }
  };

  useEffect(() => {
    getID();
    getPosts();
    getAllUsers();
  }, [isFocused]);

  const getID = async () => {
    const id = await AsyncStorage.getItem('id');
    setUserID(id);
  };
  const getColor = id => {
    let color;
    organizations?.forEach(elem => {
      if (elem.id == id) {
        color = elem.color;
      }
    });
    return color;
  };
  const hitLike = async (id, userid, index) => {
    socket.emit('likePost', {postId, userId});
    setLoader(true);
    await axiosconfig
      .get(`like/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        toggleLike(index);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
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
    getPosts();
    setRefresh(!refresh);
  };

  const getAllUsers = async () => {
    setLoader(true);
    await axiosconfig
      .get('users-connect', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('All Users', JSON.stringify(res.data));
        setDataSource([...res?.data?.friends, ...res?.data?.public]);
        setLoader(false);
        // console.log(dataSource);
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
      .get('fun-interaction', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log('public post', res?.data?.post_public);
        const data = res?.data?.post_public;
        setPublicPost(res?.data?.post_public);
        matchId(res?.data?.post_public);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };

  const report = async reptext => {
    console.log('report');
    setLoader(true);
    const data = {
      post_id: postId,
      text: reptext,
    };
    await axiosconfig
      .post('post-report', data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log(res, 'response');
        Alert.alert('post reported successfully');
        getPosts();
        refRBSheet1.current.close();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
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
        console.log('sasa', res.data);
        getPosts();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
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

  const deletePost = async id => {
    setLoader(true);
    // console.log(id);
    await axiosconfig
      .get(`post_delete/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        Alert.alert(res?.data?.message);
        getPosts(userToken);
        // console.log(myData1);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'hhe');
      });
  };

  const deleteAlert = (title, text, id) => {
    Alert.alert(
      title,
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
    );
  };

  const handleRefresh = () => {
    // Perform your data fetching or refreshing logic here
    getID();
    getPosts();
  };

  const renderItem = elem => {
    if (elem?.item?.privacy_option == '3') {
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
      <View
        style={s.col}
        onLayout={e => setItemHeights(e.nativeEvent.layout.height, 'heightyu')}>
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
            <Text style={[s.textRegular, {color: textColor}]}>
              {elem?.item?.location}
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
              {userID != elem?.item?.user?.id ? (
                <>
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
                </>
              ) : null}
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
              console.log('like');
              hitLike(elem?.item?.id, elem?.item?.user_id, elem?.index);
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
              navigation.navigate('Comments', {
                data: elem?.item,
                from: 'funInteraction',
              });
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
          <View>
            <Text style={[s.textRegular, {color: 'grey', marginVertical: 0}]}>
              {`${new Date(elem?.item?.created_at).toLocaleString()}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const searchItem = (elem, i) => {
    return (
      <TouchableOpacity style={s.card}>
        <View style={[s.dp, {borderColor: getColor(elem?.item?.group)}]}>
          <Image
            source={{uri: elem?.item?.image ? elem?.item?.image : dummyImage}}
            style={s.dp1}
            resizeMode={'cover'}
          />
        </View>
        <View style={s.details}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ViewUser', {
                post: elem?.item,
                screen: 'search',
              });
              clear();
            }}>
            <Text style={[s.name, s.nameBold, {color: textColor}]}>
              {elem?.item?.name}
            </Text>
            <Text style={[s.textRegular, s.nameBold, {color: 'grey'}]}>
              {elem?.item?.location}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  const onSearch = text => {
    setSearchText(text);
    if (text) {
      setSearching(true);
      const temp = text.toLowerCase();

      const tempList = dataSource.filter(item => {
        let name = item?.name?.toLowerCase();
        if (name?.match(temp)) return item;
      });

      setFiltered(tempList);
    } else {
      setSearchText('');
      setSearching(false);
    }
  };

  const clear = () => {
    setSearchText('');
    setFiltered([]);
    setSearching(false);
  };
  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}

      <View style={[s.container, s.col, {backgroundColor: color}]}>
        <View style={s.searchContainer}>
          <Input
            placeholder="Search Here"
            placeholderTextColor={'#B9B9B9'}
            onChangeText={onSearch}
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
                onPress={() => clear()}
                style={{paddingRight: 10}}>
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
        {searching && (
          <View
            style={{
              marginHorizontal: moderateScale(10, 0.1),
              marginBottom: moderateScale(60, 0.1),
            }}>
            <FlatList
              data={filtered}
              renderItem={searchItem}
              keyExtractor={(e, i) => i.toString()}
              scrollEnabled
              extraData={refresh}
            />
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            backgroundColor: color,
            width: '95%',
            top: moderateScale(60, 0.1),
            zIndex: 10000,
            marginHorizontal: moderateScale(10, 0.1),
          }}>
          {searching && filtered?.length == 0 && (
            <Text
              style={[
                s.name,
                s.nameBold,
                {
                  color: textColor,
                  textAlign: 'center',
                  marginVertical: moderateScale(40, 0.1),
                },
              ]}>
              No Users Found
            </Text>
          )}
        </View>

        <View style={s.funView}></View>

        <FlatList
          ref={flatListRef}
          data={publicPost}
          renderItem={elem => renderItem(elem)}
          keyExtractor={(elem, index) => {
            index.toString();
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          getItemLayout={getItemLayout}
          extraData={refresh}
        />
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
              paddingHorizontal: moderateScale(15, 0.1),
            }}>
            <View style={[s.hv]}>
              <Text style={[s.hv, {color: textColor}]}>
                Why are you reporting this post?
              </Text>
            </View>
            <View>
              <Text style={[s.txt]}>
                In publishing and graphic design, Lorem ipsum is a placeholder
                text commonly used to demonstrate the visual form of a document
                or a typeface without relying on meaningful content. Lorem ipsum
                may be used as a placeholder before final copy is available
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
                  report('its spam');
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
      </View>
    </SafeAreaView>
  );
};

export default FunInteraction;
