import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Loader from '../../../../Components/Loader';
import Header from '../../../../Components/Header/index';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import axiosconfig from '../../../../Providers/axios';
import s from './style';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Likes = ({navigation, route}) => {
  const organizations = useSelector(state => state.reducer.organization);

  const [loader, setLoader] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const userToken = useSelector(state => state.reducer.userToken);
  const [data, setData] = useState(route?.params?.data);
  const isFocused = useIsFocused();
  const [userID, setUserID] = useState('');

  const [friends, setFriends] = useState([]);
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [userData, setUserData] = useState('');
  useEffect(() => {
    // block_list();
    getID();
    getAllUsers();
  }, []);

  const getColor = id => {
    let color;
    organizations?.forEach(elem => {
      if (elem.id == id) {
        color = elem.color;
      }
    });
    return color;
  };
  const getID = async () => {
    const id = await AsyncStorage.getItem('id');
    setUserID(id);
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
        // console.log('Friends', res?.data?.friends);
        setFriends(res?.data?.friends);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        // console.log(err);
      });
  };

  const checkFriend = id => {
    let friend;
    friends?.forEach(elem => {
      if (elem.id == id && elem?.id != userID) {
        // console.log(elem.id, id);
        friend = true;
      }
    });
    return friend;
  };
  // const unblock = async id => {
  //   // console.log('aaaa');
  //   setLoader(true);
  //   // console.log(userToken, 'hgh');
  //   await axiosconfig
  //     .get(`block/${id}`, {
  //       headers: {
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then(res => {
  //       // console.log('block', res);
  //       block_list();
  //       setLoader(false);
  //     })
  //     .catch(err => {
  //       setLoader(false);

  //       // console.log(err, 'her');
  //       // showToast(err.response);
  //     });
  // };
  // const block_list = async () => {
  //   setLoader(true);
  //   axiosconfig
  //     .get(`block-list`, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then(res => {
  //       // console.log('data', res.data);
  //       setData(res?.data);
  //       setLoader(false);
  //     })
  //     .catch(err => {
  //       setLoader(false);

  //       // console.log(err);
  //       // showToast(err.response);
  //     });
  // };

  // const connect = async () => {
  //   setLoader(true);
  //   // console.log(userToken, 'hgh');
  //   await axiosconfig
  //     .get(`connect/${Userid}`, {
  //       headers: {
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then(res => {
  //       // console.log('connect', res);
  //       getData();
  //       setLoader(false);
  //     })
  //     .catch(err => {
  //       setLoader(false);
  //       // console.log(err, 'her');
  //     });
  // };
  // const Disconnect = async () => {
  //   setLoader(true);
  //   await axiosconfig
  //     .get(`connect-remove/${Userid}`, {
  //       headers: {
  //         Accept: 'application/json',
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then(res => {
  //       // console.log('Disconnect', res);
  //       // getData();
  //       setLoader(false);
  //     })
  //     .catch(err => {
  //       setLoader(false);
  //       // console.log(err, 'her');
  //     });
  // };
  const renderItem = (elem, i) => {
    // console.log(elem.item, 'a');
    return (
      <View style={s.card}>
        <View style={[s.dp, {borderColor: getColor(elem?.item?.group)}]}>
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ViewUser', {
              screen: 'search',
              post: {id: elem?.item?.users?.id},
            });
          }}
          style={{flex: 0.7, alignSelf: 'center'}}
        >
          <View>
            <View
              style={{flexDirection: 'column', width: moderateScale(200, 0.1)}}
            >
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.users?.name} {elem?.item?.users?.last_name}
              </Text>
              <Text style={[s.textSmall, {color: 'grey'}]}>
                {elem?.item?.users?.location}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* {friend ? (
          <View style={s.btn}>
            <View>
              <Text style={{color: '#222222'}}>Connected</Text>
            </View>
          </View>
        ) : null} */}
      </View>
    );
  };

  const getDetails = async id => {
    // console.log('get data');
    // setLoader(true);
    let connected;
    await axiosconfig
      .get(`user_view/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        // console.log('data', res.data.user_details);
        connected = res?.data?.user_details?.connected;
        setUserData(res?.data?.user_details);
        // setLoader(false);
      })
      .catch(err => {
        // setLoader(false);
        // console.log(err);
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.4}}>
          <Header navigation={navigation} />
        </View>
        <View style={{flex: 0.6, justifyContent: 'center'}}>
          <Text style={[s.HeadingText, {color: textColor}]}>Likes</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        {/* <View>
          <Text style={[s.HeadingText, {color: textColor}]}>Blocked</Text>
        </View> */}
        {data.length > 0 ? (
          <>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(e, i) => i.toString()}
              scrollEnabled={true}
            />
          </>
        ) : (
          <>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{fontSize: moderateScale(16, 0.1), color: textColor}}
              >
                No blocked Users
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Likes;
