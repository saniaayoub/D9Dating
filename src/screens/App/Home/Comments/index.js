import {TouchableOpacity, Text, SafeAreaView, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {setTheme} from '../../../../Redux/actions';
import s from './style';
import Header from '../../../../Components/Header';
import {FlatList} from 'react-native';
import {ScrollView} from 'react-native';
import Antdesign from 'react-native-vector-icons/AntDesign';

import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosconfig from '../../../../provider/axios';
import Loader from '../../../../Components/Loader';
// import Toast from 'react-native-simple-toast';
import Feather from 'react-native-vector-icons/Feather';
import {Input} from 'native-base';
const messages = [
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../../assets/images/png/mydp.png'),
    active: '4 Hours ago',
    icon: <Antdesign name="checkcircle" size={20} color="green" />,
    icon1: <Antdesign name="closecircle" size={20} color="red" />,
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: '10:00pm',
    userImage: require('../../../../assets/images/png/u7.png'),
    active: 'Nov 10 At 2:01 AM',
    icon: <Antdesign name="checkcircle" size={20} color="green" />,
    icon1: <Antdesign name="closecircle" size={20} color="red" />,
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Friday',
    userImage: require('../../../../assets/images/png/u1.png'),
    active: '4 Hours ago',
  },
  {
    from: 'Julie Watson',
    text: 'Like your photo',
    time: 'Monday',
    userImage: require('../../../../assets/images/png/u2.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'John Smith',
    text: 'Who you might know is on profile',
    time: 'Last Week',
    userImage: require('../../../../assets/images/png/u4.png'),
    active: '4 Hours ago',
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: 'Last Week',
    userImage: require('../../../../assets/images/png/u5.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../../assets/images/png/u6.png'),
    active: '4 Hours ago',
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: 'Last Week',
    userImage: require('../../../../assets/images/png/u5.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../../assets/images/png/u6.png'),
    active: '4 Hours ago',
  },
];

const Comments = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {post} = route.params;
  const userToken = useSelector(state => state.reducer.userToken);
  const theme = useSelector(state => state.reducer.theme);
  const organizations = useSelector(state => state.reducer.organization);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [comment, setComment] = useState('');
  const [commentID, setCommentID] = useState('');
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [comments, setComments] = useState(post?.post_comments);
  const [loader, setLoader] = useState(false);
  const [userID, setUserID] = useState('');
  const [edit, setEdit] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [userData, setUserData] = useState('');
  useEffect(() => {
    getID();

    // extractDate();
  }, []);

  const getUserData = async id => {
    setLoader(true);
    axiosconfig
      .get(`user_view/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        // console.log(res?.data?.user_details, 'user data');
        setUserData(res?.data?.user_details);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err);
        // showToast(err.response);
      });
  };
  const getDate = old => {
    // console.log(old, 'old');

    let code = new Date(old);
    let min = new Date(code).getMinutes();
    let sec = new Date(code).getSeconds();
    let hours = new Date(code).getHours();
    // console.log(temp, 'datea');
    return `${hours}:${min}:${sec}s`;
  };

  // const showToast = msg => {
  //   Toast.show(msg, Toast.SHORT);
  // };

  const extractDate = () => {
    // console.log('Example to Subtract two dates');
    var d1 = new Date('March 16, 2022');
    var d2 = new Date('April 6, 2022');
    var sub = d2.getTime() - d1.getTime();
    // console.log(sub);
  };

  const getID = async () => {
    const id = await AsyncStorage.getItem('id');
    setUserID(id);
    getUserData(id);
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

  const addComment = async postid => {
    setLoader(false);
    if (!comment) {
      setLoader(false);
      return;
    }
    let data;
    if (edit) {
      data = {
        comment_id: commentID,
        text: comment,
        post_id: postid,
      };
    } else {
      data = {
        text: comment,
        post_id: postid,
      };
    }

    await axiosconfig
      .post(edit ? 'comment_update' : 'comment_add', data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('data', JSON.stringify(res.data));
        setComment('');
        setEdit(false);
        setCommentID('');
        if (route?.params?.screen == 'funInteraction') {
          getPublicPosts(postid);
        } else {
          getPosts(postid);
        }

        // setRefresh(!refresh);
      })
      .catch(err => {
        setLoader(false);
        setComment('');
        setEdit(false);
        setCommentID('');
        console.log(err);
        // Alert.alert(err);
      });
  };

  const onEdit = async (id, commentText) => {
    setComment(commentText);
    setCommentID(id);
    setEdit(true);
  };

  const deleteComment = async commentid => {
    setLoader(true);
    // console.log(userToken, 'get');
    await axiosconfig
      .get(`comment-delete/${commentid}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('data', JSON.stringify(res.data));
        // showToast(res?.data?.success);
        if (route?.params?.screen == 'funInteraction') {
          getPublicPosts(post?.id);
        } else {
          getPosts(post?.id);
        }
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // Alert.alert(err);
      });
  };

  const getPosts = async postid => {
    // console.log('swer');
    await axiosconfig
      .get('user_details', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('friendx', res.data.post_friends, postid);
        getUpdatedComments(res.data.post_friends, postid);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  const getPublicPosts = async postid => {
    // console.log('swer');
    await axiosconfig
      .get('fun-interaction', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        // console.log('public', res?.data?.post_public, postid);
        getUpdatedComments(res?.data?.post_public, postid);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  const getUpdatedComments = (array, postid) => {
    let temp = array.filter(elem => elem.id == postid);
    setComments(temp[0]?.post_comments);
    setLoader(false);
    setRefresh(!refresh);
    // console.log(temp[0]?.post_comments, comments, 'whhwyw');
  };

  const renderItem = (elem, i) => {
    // console.log(elem?.item);
    return (
      <View style={s.card}>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={[s.dp, {borderColor: getColor(elem?.item?.users?.group)}]}
          >
            <Image
              source={{
                uri: elem?.item?.users?.image
                  ? elem?.item?.users?.image
                  : dummyImage,
              }}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
          <View style={s.details}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewUser', {
                  screen: 'search',
                  post: {id: elem?.item?.users?.id},
                });
              }}
            >
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.users?.name} {elem?.item?.users?.last_name}
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={[s.textSmall, {color: textColor}]}>
                {elem?.item?.text}
              </Text>
            </View>
            <Text style={[s.textSmall, {color: '#787878'}]}>
              {`${new Date(elem?.item?.created_at).toLocaleString()}`}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          {post?.user?.id == userID || elem?.item?.user_id == userID ? (
            <View style={s.icon}>
              <TouchableOpacity
                onPress={() => {
                  deleteComment(elem?.item?.id);
                }}
              >
                <Antdesign
                  name={'delete'}
                  size={moderateScale(15, 0.1)}
                  color={textColor}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {elem?.item?.user_id == userID ? (
            <View style={s.icon}>
              <TouchableOpacity
                onPress={() => {
                  onEdit(elem?.item?.id, elem?.item?.text);
                }}
              >
                <Entypo
                  name={'edit'}
                  size={moderateScale(15, 0.1)}
                  color={textColor}
                />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: moderateScale(20, 0.1),
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: moderateScale(10, 0.1),
          }}
        >
          <Header navigation={navigation} />
        </View>
        <View>
          <Text style={[s.HeadingText, {color: textColor}]}>Comments</Text>
        </View>
        {/* <View style={s.txtView}>
          <Text style={s.hTxt}>{post?.created_at}</Text>
        </View> */}
      </View>

      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        <View style={s.caption}>
          <View style={[s.dp, {borderColor: getColor(post?.user?.group)}]}>
            <Image
              source={{uri: post?.user?.image ? post?.user?.image : dummyImage}}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
          <TouchableOpacity style={{width: '75%', alignSelf: 'center'}}>
            <View>
              <View style={{flexDirection: 'row'}}>
                <Text style={[s.name, s.nameBold, {color: textColor}]}>
                  {post.user?.name} {post.user?.last_name}
                  <Text style={[s.name1]}> {post?.caption}</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(e, i) => i.toString()}
          scrollEnabled={true}
          extraData={refresh}
        />
        {userData ? (
          <View style={{marginBottom: 20}}>
            <Input
              w="100%"
              height={moderateScale(50, 0.1)}
              variant="rounded"
              color={textColor}
              placeholder="Add Comment ..."
              placeholderTextColor={'grey'}
              value={comment}
              onChangeText={text => {
                setComment(text);
              }}
              borderColor={textColor}
              marginTop={moderateScale(10, 0.1)}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View
                  style={[
                    s.smallDp,
                    {
                      borderColor: getColor(userData?.group),
                    },
                  ]}
                >
                  {userData?.image ? (
                    <Image
                      source={{uri: userData?.image}}
                      style={s.dp1}
                      resizeMode={'cover'}
                    />
                  ) : null}
                </View>
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    addComment(post.id);
                  }}
                  style={{marginRight: moderateScale(20, 0.1)}}
                >
                  <Feather
                    name={'send'}
                    size={moderateScale(20, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Comments;
