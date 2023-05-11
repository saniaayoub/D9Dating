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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';

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

const ViewUser = ({navigation, route}) => {
  const {post, screen} = route?.params;
  const [Userid, setUserid] = useState(
    screen == 'search' ? post?.id : post.user.id,
  );
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [loginId, setLoginId] = useState(null);
  const isFocused = useIsFocused();
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imgView, setImgView] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const userToken = useSelector(state => state.reducer.userToken);
  const [scroll, setScroll] = useState(false);
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getData();
    getId();
  }, []);

  const getId = async () => {
    const logInId = await AsyncStorage.getItem('id');
    setLoginId(logInId);
  };

  const getData = async () => {
    setLoader(true);
    axiosconfig
      .get(`user_view/${Userid}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data11', res.data.user_details);
        setUserData(res?.data?.user_details);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };
  const connect = async () => {
    setLoader(true);

    await axiosconfig
      .get(`connect/${Userid}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('connect', res);
        getData();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'her');
      });
  };
  const Disconnect = async () => {
    setLoader(true);
    await axiosconfig
      .get(`connect-remove/${Userid}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('Disconnect', res);
        getData();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'her');
      });
  };
  const block = async () => {
    console.log('aaaa');
    setLoader(true);
    console.log(userToken, 'hgh');
    await axiosconfig
      .get(`block/${Userid}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('block', res);
        getData();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'her');
        // showToast(err.response);
      });
  };
  const unblock = async () => {
    console.log('aaaa');
    setLoader(true);
    console.log(userToken, 'hgh');
    await axiosconfig
      .get(`block/${Userid}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('block', res);
        getData();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err, 'her');
        // showToast(err.response);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <View style={[s.View1]}>
        <TouchableOpacity
          onPress={() => {
            setPreviewImage(userData?.image ? userData?.image : dummyImage);

            setImgView(!imgView);
          }}
          style={{width: '100%', height: moderateScale(260, 0.1)}}>
          <Image
            style={s.view1Img}
            resizeMode={'cover'}
            source={{uri: userData?.image ? userData?.image : dummyImage}}
          />
        </TouchableOpacity>
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
          <View style={s.container}>
            <View style={s.row}>
              <Text style={[s.headerTxt, {color: textColor}]}>
                {userData?.name} {userData.last_name}
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
            <View style={s.row1}>
              <View>
                <Ionicon
                  name="location-sharp"
                  color={textColor}
                  solid
                  size={moderateScale(22, 0.1)}
                />
              </View>
              <Text style={s.location}>{userData?.location} </Text>
            </View>

            <View style={s.about}>
              <Text style={[s.aboutTxt, {color: textColor}]}>About</Text>
              <View style={s.abTxt}>
                <Text style={s.txt}>{userData?.about_me} </Text>
              </View>
            </View>
            <View style={{marginBottom: moderateScale(10, 0.1)}}>
              <Text style={[s.aboutTxt, {color: textColor}]}>Organization</Text>
              <View style={s.abTxt}>
                <Text style={s.txt}>{userData?.group} </Text>
              </View>
            </View>
          </View>
          {Userid != loginId ? (
            <>
              {userData?.connected ? (
                <>
                  <View style={s.connected}>
                    <TouchableOpacity
                      onPress={() =>
                        userData?.connected == 2 ? null : Disconnect()
                      }>
                      <View style={s.btn}>
                        <Text style={[s.btnTxt]}>
                          {userData?.connected == 2 ? 'Pending' : 'Disconnect'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {userData?.block_status == 0 && userData?.connected == 1 ? (
                      <>
                        <TouchableOpacity onPress={() => block()}>
                          <View style={s.btn}>
                            <Text style={[s.btnTxt]}>{'Block'}</Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    ) : null}
                  </View>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() =>
                      userData?.connected == 0 && userData?.block_status == 0
                        ? connect()
                        : unblock()
                    }>
                    <View style={s.btn}>
                      <Text style={[s.btnTxt]}>
                        {userData?.connected == 0 && userData?.block_status == 0
                          ? 'Connect'
                          : 'Unblock'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : null}
        </View>
      </ScrollView>
      <ImageView
        images={[
          {
            uri: previewImage,
          },
        ]}
        imageIndex={0}
        visible={imgView}
        onRequestClose={() => setImgView(!imgView)}
      />
    </View>
  );
};

export default ViewUser;
// <TouchableOpacity>
//               <View>
//                 {cStatus == 0 && bStatus == 0 ? (
//                   <>
//                     <TouchableOpacity onPress={() => connect()}>
//                       <View style={s.btn}>
//                         <Text style={[s.btnTxt]}>Connect</Text>
//                       </View>
//                     </TouchableOpacity>
//                   </>
//                 ) : cStatus == 2 && bStatus == 0 ? (
//                   <>
//                     <View style={s.connected}>
//                       <View style={s.btn}>
//                         <Text style={[s.btnTxt]}>pending</Text>
//                       </View>
//                     </View>
//                   </>
//                 ) : cStatus == 1 ? (
//                   <>
//                     <View style={s.connected}>
//                       <TouchableOpacity onPress={() => Disconnect()}>
//                         <View style={s.btn}>
//                           <Text style={[s.btnTxt]}>Disconnect</Text>
//                         </View>
//                       </TouchableOpacity>
//                       <TouchableOpacity onPress={() => block()}>
//                         <View style={s.btn}>
//                           <Text style={[s.btnTxt]}>Block</Text>
//                         </View>
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 ) : cStatus == 0 && bStatus == 1 ? (
//                   <>
//                     <TouchableOpacity onPress={() => unblock()}>
//                       <View style={s.btn}>
//                         <Text style={[s.btnTxt]}>Unblock</Text>
//                       </View>
//                     </TouchableOpacity>
//                   </>
//                 ) : null}
//               </View>
//             </TouchableOpacity>
//  {userData.map((v, i) => {
//           console.log('aa');
//           return (
//             <View style={s.container}>
//               <View style={s.row}>
//                 <Text style={[s.headerTxt, {color: textColor}]}>
//                   {v.name} {v.last_name}
//                 </Text>

//                 <View style={s.icon}>
//                   <AntDesign
//                     style={{position: 'absolute'}}
//                     name="message1"
//                     color="#FFD700"
//                     solid
//                     size={moderateScale(22, 0.1)}
//                   />
//                 </View>
//               </View>

//               {/* <View>
//                 <Text style={s.txt}>hdjdkdjksd </Text>
//               </View> */}

//               <View style={s.row1}>
//                 <View>
//                   <Ionicon
//                     name="location-sharp"
//                     color={textColor}
//                     solid
//                     size={moderateScale(22, 0.1)}
//                   />
//                 </View>
//                 <Text style={s.location}>{v.location} </Text>
//               </View>

//               <View style={s.about}>
//                 <Text style={[s.aboutTxt, {color: textColor}]}>About</Text>
//                 <View style={s.abTxt}>
//                   <Text style={s.txt}>{v.about_me} </Text>
//                 </View>
//               </View>
//             </View>
//           );
//         })}
