import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
  FlatList,
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

const FunInteraction = ({navigation}) => {
  const dispatch = useDispatch();
  const refRBSheet1 = useRef();
  const isFocused = useIsFocused();
  const groups = useSelector(state => state.reducer.group);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [searchText, setSearchText] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [loader, setLoader] = useState(true);
  const [publicPost, setPublicPost] = useState([]);
  const [text, setText] = useState(null);
  const [userID, setUserID] = useState('');
  const [current, setCurrent] = useState('');
  const [comment, setComment] = useState('');
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [dataSource, setDataSource] = useState([]);
  const [filtered, setFiltered] = useState(dataSource);
  const [searching, setSearching] = useState(false);
  const userToken = useSelector(state => state.reducer.userToken);

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
    groups?.forEach(elem => {
      if (elem.id == id) {
        color = elem.color;
      }
    });
    return color;
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
        console.log('All Users', JSON.stringify(res.data));
        setDataSource([...res?.data?.friends, ...res?.data?.public]);
        setLoader(false);
        console.log(dataSource);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };

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
        console.log('public post', JSON.stringify(res?.data?.post_public));
        const data = res?.data?.post_public;

        setPublicPost(res?.data?.post_public);
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
            <TouchableOpacity
              onPress={() => navigation.navigate('ViewUser', {post: elem.item})}
            >
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.user?.name} {elem?.item?.user?.last_name}
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
              {userID == elem?.item?.user?.id ? (
                <>
                  <Menu.Item
                    onPress={() =>
                      navigation.navigate('createPost', {
                        elem: elem?.item,
                        screen: 'funInteraction',
                      })
                    }
                  >
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
            {elem?.item?.user?.name} {elem?.item?.user?.last_name}
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

  const searchItem = (elem, i) => {
    return (
      <View style={s.card}>
        <View style={[s.dp, {borderColor: getColor(elem?.item?.group)}]}>
          <Image
            source={{uri: elem?.item?.image}}
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
            }}
          >
            <Text style={[s.name, s.nameBold, {color: textColor}]}>
              {elem?.item?.name}
            </Text>
            <Text style={[s.textRegular, s.nameBold, {color: 'grey'}]}>
              {elem?.item?.location}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={[s.container, s.col, {backgroundColor: color}]}>
        {loader ? <Loader /> : null}

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
        <View
          style={{
            position: 'absolute',
            backgroundColor: color,
            width: '95%',
            top: moderateScale(60, 0.1),
            zIndex: 10000,
            marginHorizontal: moderateScale(10, 0.1),
          }}
        >
          {searching && (
            <View style={{marginHorizontal: moderateScale(10, 0.1)}}>
              <FlatList
                data={filtered}
                renderItem={searchItem}
                keyExtractor={(e, i) => i.toString()}
                scrollEnabled={true}
                extraData={refresh}
              />
            </View>
          )}
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
              ]}
            >
              No Users Found
            </Text>
          )}
        </View>

        <View style={s.funView}></View>

        <FlatList
          data={publicPost}
          renderItem={elem => renderItem(elem)}
          keyExtractor={(elem, index) => {
            index.toString();
          }}
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
            <Text style={[s.rb, {color: textColor}]}>Report</Text>
          </View>
          <View
            style={{
              paddingHorizontal: moderateScale(13, 0.1),
            }}
          >
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
                  report();
                }}
                style={s.list}
              >
                <View>
                  <Text style={[s.listTxt, {color: textColor}]}>
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
                  <Text style={[s.listTxt, {color: textColor}]}>it's spam</Text>
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
                  <Text style={[s.listTxt, {color: textColor}]}>
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
                  <Text style={[s.listTxt, {color: textColor}]}>
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
                  <Text style={[s.listTxt, {color: textColor}]}>
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
                  <Text style={[s.listTxt, {color: textColor}]}>
                    Bullying or harrasment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>

        {/* <ScrollView
          scrollEnabled
          vertical
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {data.map((elem, index)=> {
            return()
          })}
        </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

export default FunInteraction;
