import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Header from '../../../../Components/Header';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {setTheme} from '../../../../Redux/actions';
import axiosconfig from '../../../../Providers/axios';
import Loader from '../../../../Components/Loader';


const data = [
  {
    user_id: 1,
    user_image:
      'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
    user_name: 'Ahmet Çağlar Durmuş',
    Designation: 'Fashion Designer',
    location: ' California, USA',
    caption:
      'Julie Watson Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diamnonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
    post: {
      image: require('../../../../assets/images/png/dp.png'),

      likes: 233,
    },
  },
];

const ViewUser = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const userToken = useSelector(state => state.reducer.userToken);

  useEffect(() => {}, []);

  const [scroll, setScroll] = useState(false);
  const [connected, setConnected] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState(['abc'])

  useEffect(() => {
    console.log(userToken,'ggg');
    getData();
    connect();
    Disconnect()
  }, []);

  const getData = async () => {
    setLoader(true);
    axiosconfig
      .get(`user_view/3`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data', JSON.stringify(res.data));
        console.log(res?.data?.user_details,'user detials')
        if (res?.data?.user_details) {
          // const dd = JSON.stringify(res?.data)
           setUserData([res?.data?.user_details]);
        }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err);
        // showToast(err.response);
      });
  };
  const connect = async () => {
    setLoader(true);
    console.log(userToken,'hgh')
   await axiosconfig
      .get("connect/3",{
        headers: {
          Accept:'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('connect', res);
        setConnected(true)
        // console.log(res?.data?.user_details,'user detials')
        // if (res?.data?.user_details) {
        //   // const dd = JSON.stringify(res?.data)
        //    setUserData([res?.data?.user_details]);
        // }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err,'her');
        // showToast(err.response);
      });
  };
  const Disconnect = async () => {
    setLoader(true);
   await axiosconfig
      .get('connect-remove/3',{
        headers: {
          Accept:'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('Disconnect', res);
        setConnected(false)
        // console.log(res?.data?.user_details,'user detials')
        // if (res?.data?.user_details) {
        //   // const dd = JSON.stringify(res?.data)
        //    setUserData([res?.data?.user_details]);
        // }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err,'her');
        // showToast(err.response);
      });
  };


  return (
    <View style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <View style={[s.View1]}>
        <Image
          style={s.view1Img}
          source={require('../../../../assets/images/png/dp.png')}
        />
        <View
          style={{
            position: 'absolute',
            justifyContent: 'flex-start',
            // paddingHorizontal: moderateScale(15),
          }}>
          <Header navigation={navigation} />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        onScroll={() => {
          setScroll(!scroll), console.log(scroll);
        }}
        style={[
          s.View2,
          {
            backgroundColor: color,
            bottom: scroll ? moderateScale(50) : moderateScale(5),
          },
        ]}
        scrollEnabled={true}>
        <View>
          <View style={s.line}></View>
          {userData.map((v, i) => {
            console.log('aa');
            return (
              <View style={s.container}>
                <View style={s.row}>
                  <Text style={[s.headerTxt, {color: textColor}]}>
                    {v.name}{" "}{v.last_name}
                  </Text>

                  <View style={s.icon}>
                    <AntDesign
                      style={{position: 'absolute'}}
                      name="message1"
                      color="#FFD700"
                      solid
                      size={moderateScale(22, 0.1)}
                    />
                  </View>
                </View>

                <View>
                  <Text style={s.txt}>hdjdkdjksd </Text>
                </View>

                <View style={s.row1}>
                  <View>
                    <Ionicon
                      name="location-sharp"
                      color={textColor}
                      solid
                      size={moderateScale(22, 0.1)}
                    />
                  </View>
                  <Text style={s.location}>{v.location} </Text>
                </View>

                <View style={s.about}>
                  <Text style={[s.aboutTxt, {color: textColor}]}>
                    About Us{' '}
                  </Text>
                  <View style={s.abTxt}>
                    <Text style={s.txt}>{v.about_me} </Text>
                  </View>
                </View>
              </View>
            );
          })
          }
          <TouchableOpacity >
            <View>
              {!connected ? (
                <>
                <TouchableOpacity onPress={()=>connect()}>

                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                </TouchableOpacity>
                </>
              ):
              (
                <>
                  <View style={s.connected}>
                    <TouchableOpacity onPress={() => Disconnect()}>
                      <View style={s.btn}>
                        <Text style={[s.btnTxt]}>Disconnect</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={s.btn}>
                        <Text style={[s.btnTxt]}>Block</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              ) }
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewUser;
