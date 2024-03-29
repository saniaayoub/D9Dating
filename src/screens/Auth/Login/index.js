import {
  ImageBackground,
  SafeAreaView,
  Text,
  Keyboard,
  View,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import s from './style';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Fontisto';
import {Input, FormControl, Box, Button} from 'native-base';
import {moderateScale} from 'react-native-size-matters';
import Lock from '../../../assets/images/svg/lock.svg';
import {setTheme, setUserToken, setStories} from '../../../Redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosconfig from '../../../provider/axios';
import Loader from '../../../Components/Loader';
import socket from '../../../utils/socket';
const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Login = ({navigation}) => {
  const dispatch = useDispatch();
  const FCMtoken = useSelector(state => state.reducer.fToken);
  const userToken = useSelector(state => state.reducer.userToken);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [submitted, setSubmitted] = useState();
  const [showPass, setshowPass] = useState(true);
  const [validEmail, setValidEmail] = useState('');
  const [loader, setLoader] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const Textcolor = theme === 'dark' ? '#fff' : '#222222';

  useEffect(() => {}, []);

  const fcmToken = token => {
    console.log('fcmtoken api');
    // setLoader(true);
    console.log(userToken, 'userToken');
    var data = {
      device_token: FCMtoken,
    };
    axiosconfig
      .post('device-token', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        console.log(res, 'token');
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'errors');
      });
  };

  const onSignInUser = () => {
    console.log('submit');
    setSubmitted(false);
    let sub = false;

    if (email == null || email == '') {
      setSubmitted(true);
      sub = true;
      return;
    }
    if (password == null || password == '') {
      setSubmitted(true);
      sub = true;
      return;
    }
    setLoader(true);
    var data = {
      email: email,
      password: password,
    };
    console.log({data});
    if (!sub) {
      Keyboard.dismiss();

      axiosconfig
        .post('login', data)
        .then(res => {
          AsyncStorage.setItem('password', password);
          console.log(res?.data?.userInfo, 'id');
          let id = res?.data?.userInfo.toString();
          AsyncStorage.setItem('id', id);
          AsyncStorage.setItem('userToken', res?.data?.access_token);
          console.log(res?.data, 'res');
          fcmToken(res?.data?.access_token);
          socket.auth = {username: email};
          socket.connect();
          dispatch(setUserToken(res?.data?.access_token));
          setLoader(false);
        })
        .catch(err => {
          console.log(err.response);
          Alert.alert(err.response.data.message);
          setLoader(false);
        });
    }
  };

  const getStories = async token => {
    setLoader(true);
    await axiosconfig
      .get('story_index', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log('storylo', JSON.stringify(res.data?.user));
        createStoryData(res.data?.user, token);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  const createStoryData = (data, token) => {
    console.log('sent data', data);
    let temp = {
      user_id: data.id,
      user_image: data.image,
      group: data.group,
      user_name: data.name,
      stories: data.stories,
    };
    dispatch(setStories([temp]));
    dispatch(setUserToken(token));
    setLoader(false);
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@auth_token', value);
      context.setuserToken(value);
    } catch (e) {
      console.log(e, 'data store error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>
      <View
        style={[
          s.container,
          {
            width: width,
            height: height,
            backgroundColor: theme === 'dark' ? '#222222' : '#fff',
          },
        ]}>
        {loader ? <Loader /> : null}

        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={s.heading}>
            <Text style={[s.headingText, {color: Textcolor}]}>
              Sign <Text style={[s.headingText1, {color: Textcolor}]}>In</Text>
            </Text>
          </View>
          <View style={s.input}>
            <Input
              w={{
                base: '83%',
                md: '25%',
              }}
              variant="underlined"
              InputLeftElement={
                <View style={s.iconCircle}>
                  <Icon name={'envelope'} color={Textcolor} size={18} />
                </View>
              }
              placeholder="Email"
              placeholderTextColor={Textcolor}
              value={email}
              keyboardType="email-address"
              onChangeText={email => {
                setEmail(email);
                let valid = emailReg.test(email);
              }}
              color={Textcolor}
              fontSize={moderateScale(14, 0.1)}
            />
          </View>
          {submitted && (email == null || email == '') ? (
            <>
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginRight: moderateScale(35, 0.1),
                }}>
                <Text
                  style={{
                    color: 'red',
                  }}>
                  Required
                </Text>
              </View>
            </>
          ) : null}
          <View style={s.input}>
            <Input
              w={{
                base: '83%',
                md: '25%',
              }}
              variant="underlined"
              InputLeftElement={
                <View style={[s.iconCircle, {borderColor: Textcolor}]}>
                  <Icon2 name="locked" color={Textcolor} size={18} />
                </View>
              }
              placeholder="Password"
              placeholderTextColor={Textcolor}
              value={password}
              onChangeText={password => {
                setPassword(password);
              }}
              InputRightElement={
                password ? (
                  <View style={s.eye}>
                    <TouchableOpacity onPress={() => setshowPass(!showPass)}>
                      <Feather
                        name={showPass ? 'eye' : 'eye-off'}
                        color={Textcolor}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <></>
                )
              }
              color={Textcolor}
              fontSize={moderateScale(14, 0.1)}
              secureTextEntry={showPass}
            />
          </View>
          {submitted && (password == null || password == '') ? (
            <>
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginRight: moderateScale(35, 0.1),
                }}>
                <Text
                  style={{
                    color: 'red',
                  }}>
                  Required
                </Text>
              </View>
            </>
          ) : null}

          <View style={s.button}>
            <Button
              size="sm"
              variant={'solid'}
              _text={{
                color: '#6627EC',
              }}
              backgroundColor={'#FFD700'}
              borderRadius={50}
              w={moderateScale(140, 0.1)}
              h={moderateScale(35, 0.1)}
              alignItems={'center'}
              onPressIn={async () => {
                onSignInUser();
                //  dispatch(setUserToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ODk1ZTI5Ni00NGE0LTQ3NGQtODk3Zi1mZTMxNDI4ZjM5Y2UiLCJqdGkiOiJhYjk3Mzk5YzA4MWQ0ZjdhNmIyNjJiNzM2OTg5YjQyYTBjMjY4ZTE5YzdkNDhkMmViNWQwMzhkYWVjNzAyY2M5MzdiZDY4OTBiMTdhNjY0NiIsImlhdCI6MTY3ODQyNDYwNC42OTczOTIsIm5iZiI6MTY3ODQyNDYwNC42OTczOTUsImV4cCI6MTcxMDA0NzAwNC42OTE3MTEsInN1YiI6IjMiLCJzY29wZXMiOltdfQ.FVxin8JM9tjUOMHO8RZIWCsUH-iqhgDSerZlr9cUfl95YrcRMpJFNOhHc4wWe84ydYCMGfJtAz1RU0pgvMVJmXsnThnTtQIC4A68JC_w_F6RCX3iO_OBoFt81KdWzUQSlulnJA351zn1dEf-S5sojm9vVnjWEqEAav81BdNuJu2h0x6Fpr94bw4NnvZtClxR1ZuOWv6LIEwFqMap0zHMExr9UljzlQ0QZ9BEcfXwPerp6SFCil9piRrSXoaGaz24O2VzgMG9qJq50n7IxaDTy8maToJEf_bbPHvJOhmmTQt7l2YVgmFynTKsVQpB8YgXj2kbi2mKLPEYQNwYELMGPmD2O0jL48rbO0kQgUC-JEQgrOByYf9Rq4QnNx5k6swELGe0IcXIqbjE4O7C9nc86ppO0lRJLgRYCgvwoxxiu2CJaHo60dRhBdyClRcNyO6cjRZaRqrB8z8oazD2grlA_O2mEBdc2vg7gNegJK1cUwUKTxkiwYtZ9NbKhVeKKlrDmHu6KkXCVSAX2_b3DxA-6uGbEJkDfLrQebe9qvcZ4JUC5pI0uG_VODQySOiFZGaMFuunMLGB63Vp-j9RZDiJZ_67fsiIc7dBVeTZMGbKzAuHU0j8spMXbsNGSf5eOEhkIqhm6Sz6U7sNz8G_kp7bPLWA8lZDPWa3ezmkYljPr08'));
              }}>
              <Text style={s.btnText}>Login</Text>
            </Button>
          </View>

          <View>
            <Button
              size="md"
              variant={'link'}
              onPressIn={() => navigation.navigate('ForgetPassword')}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[s.forgetPass, {color: '#FFD700'}]}>Forgot </Text>
                <Text style={[s.forgetPass, {color: Textcolor}]}>
                  Password?
                </Text>
              </View>
            </Button>
          </View>
        </View>

        <View style={s.bottomLink}>
          <Button
            size="sm"
            variant={'link'}
            _text={{
              color: Textcolor,
            }}
            onPressIn={() => navigation.navigate('Register')}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[s.forgetPass, {color: Textcolor}]}>
                Don’t Have an Account?
              </Text>
              <Text
                style={[s.forgetPass, {fontWeight: '700', color: '#FFD700'}]}>
                {' '}
                Sign up Now!
              </Text>
            </View>
          </Button>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: moderateScale(5),
            }}>
            <TouchableOpacity>
              <Text
                style={[
                  s.forgetPass,
                  {color: Textcolor, textDecorationLine: 'underline'},
                ]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                s.forgetPass,
                {color: Textcolor, textDecorationLine: 'none'},
              ]}>
              {'  '}&{'  '}
            </Text>
            <TouchableOpacity>
              <Text
                style={[
                  s.forgetPass,
                  {color: Textcolor, textDecorationLine: 'underline'},
                ]}>
                Terms & conditions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
