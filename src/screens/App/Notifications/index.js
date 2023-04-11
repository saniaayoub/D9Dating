import {TouchableOpacity, Text, SafeAreaView, View, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {setTheme} from '../../../Redux/actions';
import s from './style';
import Header from '../../../Components/Header';
import {FlatList} from 'react-native';
import {ScrollView} from 'react-native';
import Antdesign from 'react-native-vector-icons/AntDesign';
import Loader from '../../../Components/Loader';
import axiosconfig from '../../../Providers/axios';
import {useIsFocused} from '@react-navigation/native';

const messages = [
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../assets/images/png/mydp.png'),
    active: '4 Hours ago',
    icon: <Antdesign name="checkcircle" size={20} color="green" />,
    icon1: <Antdesign name="closecircle" size={20} color="red" />,
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: '10:00pm',
    userImage: require('../../../assets/images/png/u7.png'),
    active: 'Nov 10 At 2:01 AM',
    icon: <Antdesign name="checkcircle" size={20} color="green" />,
    icon1: <Antdesign name="closecircle" size={20} color="red" />,
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Friday',
    userImage: require('../../../assets/images/png/u1.png'),
    active: '4 Hours ago',
  },
  {
    from: 'Julie Watson',
    text: 'Like your photo',
    time: 'Monday',
    userImage: require('../../../assets/images/png/u2.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'John Smith',
    text: 'Who you might know is on profile',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u4.png'),
    active: '4 Hours ago',
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u5.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../assets/images/png/u6.png'),
    active: '4 Hours ago',
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u5.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../assets/images/png/u6.png'),
    active: '4 Hours ago',
  },
];
const Notifications = ({navigation}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const theme = useSelector(state => state.reducer.theme);
  const userToken = useSelector(state => state.reducer.userToken);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [accept, setAccept] = useState(false);
  const [decline, setDecline] = useState(false);
  const [response, setResponse] = useState('');
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [index, setIndex] = useState('');
  useEffect(() => {
    setResponse('');
    getList();
  }, [isFocused]);

  const getList = async () => {
    setLoader(true);
    axiosconfig
      .get(`request-list`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('elenenen', res.data?.request_user);
        setData(res?.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };
  const connectAccept = async id => {
    console.log('accept');
    setIndex(id);
    setLoader(true);
    axiosconfig
      .get(`connect-accept/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data', res?.data);
        setResponse('Connected');
        setTimeout(() => {
          getList();
        }, 7000);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };
  const connectDecline = async id => {
    setLoader(true);
    setIndex(id);
    axiosconfig
      .get(`connect-remove/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data', res?.data);
        setResponse('Declined');
        setTimeout(() => {
          getList();
        }, 7000);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  const renderItem = (elem, i) => {
    console.log('elem data', elem?.item);
    return (
      <View style={s.card}>
        <View style={s.dp}>
          <Image
            source={{
              uri: elem?.item?.request_user?.image
                ? elem?.item?.request_user?.image
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
              post: {id: elem?.item?.request_user?.id},
            });
          }}
          style={{flex: 0.7, alignSelf: 'center'}}
        >
          <View>
            <View
              style={{flexDirection: 'row', width: moderateScale(200, 0.1)}}
            >
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.request_user?.name}{' '}
                {elem?.item?.request_user?.last_name}
                <>
                  <Text style={[s.name1]}> requested to follow you</Text>
                </>
              </Text>
            </View>
            {/* <Text style={[s.textSmall, {color: '#787878'}]}>
              {elem?.item?.active}
            </Text> */}
          </View>
        </TouchableOpacity>

        {response && index == elem?.item?.request_user?.id ? (
          <View style={s.icon}>
            <View style={s.fView}>
              <Text style={[s.fText, {color: textColor}]}>{response}</Text>
            </View>
          </View>
        ) : (
          <View style={s.icon}>
            <TouchableOpacity
              onPress={() => connectAccept(elem?.item?.request_user?.id)}
            >
              <View
                style={{
                  paddingHorizontal: moderateScale(6, 0.1),
                  right: moderateScale(15),
                }}
              >
                <Antdesign name="checkcircle" size={20} color="green" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => connectDecline(elem?.item?.request_user?.id)}
            >
              <View
                style={{
                  right: moderateScale(5),
                }}
              >
                <Antdesign name="closecircle" size={20} color="red" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        <View>
          <Text style={[s.HeadingText, {color: textColor}]}>Notifications</Text>
        </View>
        <View style={s.txtView}>
          <Text style={s.hTxt}>See New Activity</Text>
        </View>
        <View style={s.hView}>
          <Text style={s.hTxt1}>This Week</Text>
        </View>

        <FlatList
          data={data}
          renderItem={renderItem}
          // keyExtractor={(e, i) => i.toString()}
          scrollEnabled={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;
