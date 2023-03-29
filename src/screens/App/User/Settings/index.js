import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {setUserToken, setTheme} from '../../../../Redux/actions';
import s from './style';
import Header from '../../../../Components/Header';
import Inicon from 'react-native-vector-icons/Ionicons';
import img1 from '../../../../assets/images/png/mydp.png';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Iconn from 'react-native-vector-icons/Fontisto';
import Icon3 from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input, Button} from 'native-base';
import SwitchWithIcons from 'react-native-switch-with-icons';
import sun from '../../../../assets/images/png/sun.png';
import moon from '../../../../assets/images/png/moon.png';
import RBSheet from 'react-native-raw-bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
import axiosconfig from '../../../../Providers/axios';
import Loader from '../../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const Settings = ({navigation, route}) => {
  const dispatch = useDispatch();
  // const {data} = route?.params;
  const userToken = useSelector(state => state.reducer.userToken);
  const userData = useSelector(state => state.reducer.userData);
  const isFocused = useIsFocused();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  // const color2 = theme === 'dark' ? '#343434' : '#fff';
  const refRBSheet = useRef();

  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassErr, setConfirmPassErr] = useState('');
  const [showPass, setshowPass] = useState(true);
  const [showConfPass, setshowConfPass] = useState(true);
  const [loader, setLoader] = useState(false);
  const [submitted, setSubmitted] = useState();

  useEffect(() => {
    console.log(route?.params, 'datsa');
  }, [isFocused]);
  const showToast = msg => {
    Alert.alert(msg);
  };

  const deleteAccount = async () => {
    // refRBSheet.current.close();
    console.log('submit');
    setSubmitted(true);
    let sub = true;

    if (password == null || password == '') {
      // setSubmitted(true);
      sub = false;
      return false;
    }
    if (confirmPassword == null || confirmPassword == '') {
      // setSubmitted(true);
      sub = false;
      return false;
    }

    if (sub) {
      console.log('avvv');
      const body = {
        old_password: password,
      };
      await axiosconfig
        .post('account_delete', body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then(res => {
          // clear(res?.data?.messsage);
          console.log(res);
          console.log(res?.data?.message);
          alert(res?.data?.message);
          AsyncStorage.removeItem('userToken');
          dispatch(setUserToken(null));
        })
        .catch(err => {
          console.log(err);
          alert(err.response?.data?.message);
          console.log(err.response?.data?.message);
        });
    }
  };
  const setThemeApi = async theme => {
    setLoader(true);
    await axiosconfig
      .get('theme-mode', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        console.log('data', JSON.stringify(res?.data));
        dispatch(setTheme(theme));

        // console.log('public post', JSON.stringify(res?.data?.post_public));
        // console.log('user id',JSON.stringify(res?.data?.post_public?.user_id));
        // setPublicPost([res?.data?.post_public]);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  const LogoutApi = async () => {
    console.log(userToken);
    // const value = await AsyncStorage.getItem('userToken')
    // console.log(value, 'tokenLogout');
    setLoader(true);
    await axiosconfig
      .get('logout', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        setLoader(false);
        clearToken();
        console.log(res?.data, 'logoutToken');
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'errrr');
      });
  };
  const clearToken = async () => {
    dispatch(setUserToken(null));
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('password');
  };

  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}

      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}>
        <View style={{flexDirection: 'row'}}>
          <View style={s.dp}>
            <Image
              source={{
                uri: route?.params?.data?.image
                  ? route?.params?.data?.image
                  : dummyImage,
              }}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>

          <View style={s.username}>
            <Text style={[s.textBold, {color: textColor}]}>
              {route?.params?.name}
            </Text>
          </View>
        </View>
        <View style={s.inputSection}>
          <TouchableOpacity
            onPress={() => {
              console.log('hiii');
              navigation.navigate('Privacy');
            }}
            style={s.input}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Icon2
                    name={'privacy-tip'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              // value={fname}
              placeholder="Privacy"
              placeholderTextColor={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Help');
            }}
            style={s.input}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <MaterialIcon
                    name={'help-circle'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                  <Text style={[s.smallText]}>Help Center, Contact Us</Text>
                </View>
              }
              // value={fname}
              placeholder="Help"
              placeholderTextColor={textColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.input}
            onPress={() => navigation.navigate('ResetPass')}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <MaterialIcon
                    name={'lock-reset'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              // value={fname}
              placeholder="Reset Password"
              placeholderTextColor={textColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.input}
            onPress={() => navigation.navigate('Block')}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <MaterialIcon
                    name={'block-helper'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              // value={fname}
              placeholder="Blocked Users"
              placeholderTextColor={textColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={s.input}
            onPress={() => refRBSheet.current.open()}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Icon3
                    name={'delete'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              // value={fname}
              placeholder="Delete My Account"
              placeholderTextColor={textColor}
            />
            <RBSheet
              ref={refRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={false}
              customStyles={{
                wrapper: {
                  //  backgroundColor: "transparent",
                },
                container: {
                  backgroundColor: textColor,
                  borderRadius: moderateScale(15, 0.1),
                },
                draggableIcon: {
                  backgroundColor: color,
                },
              }}>
              <View style={s.input1}>
                <Input
                  w={{
                    base: '100%',
                    md: '25%',
                  }}
                  variant="underlined"
                  InputLeftElement={
                    <View style={s.iconCircle}>
                      <Iconn name="locked" color={color} size={18} />
                    </View>
                  }
                  placeholder="Password"
                  placeholderTextColor={color}
                  value={password}
                  color={color}
                  onChangeText={password => {
                    setPassword(password);
                    setPasswordError('');
                  }}
                  InputRightElement={
                    password ? (
                      <View style={s.eye}>
                        <TouchableOpacity
                          onPress={() => setshowPass(!showPass)}>
                          <Feather
                            name={showPass ? 'eye' : 'eye-off'}
                            color={color}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <></>
                    )
                  }
                  errorMessage={passwordError}
                  // color={textColor}
                  fontSize={moderateScale(14, 0.1)}
                  secureTextEntry={showPass}
                />
              </View>

              <View style={s.input1}>
                <Input
                  w={{
                    base: '100%',
                    md: '25%',
                  }}
                  variant="underlined"
                  InputLeftElement={
                    <View style={[s.iconCircle]}>
                      <MaterialIcon
                        name={'lock-reset'}
                        size={moderateScale(20, 0.1)}
                        solid
                        color={color}
                      />
                    </View>
                  }
                  placeholder="Confirm Password"
                  placeholderTextColor={color}
                  color={color}
                  value={confirmPassword}
                  onChangeText={text => {
                    if (password.includes(text)) {
                      setConfirmPassword(text);
                      setConfirmPassErr('');
                    } else {
                      setConfirmPassword(text);
                      setConfirmPassErr('Password Mismatch');
                    }
                  }}
                  InputRightElement={
                    confirmPassword ? (
                      <View style={s.eye}>
                        <TouchableOpacity
                          onPress={() => setshowConfPass(!showConfPass)}>
                          <Feather
                            name={showConfPass ? 'eye' : 'eye-off'}
                            color={color}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <></>
                    )
                  }
                  errorMessage={confirmPassErr}
                  fontSize={moderateScale(14, 0.1)}
                  secureTextEntry={showConfPass}
                />
              </View>
              <View style={s.button}>
                <Button
                  onPress={() => {
                    deleteAccount();
                  }}
                  size="sm"
                  variant={'solid'}
                  _text={{
                    color: '#6627EC',
                  }}
                  backgroundColor={'#FFD700'}
                  borderRadius={50}
                  w={moderateScale(140, 0.1)}
                  h={moderateScale(35, 0.1)}
                  alignItems={'center'}>
                  <Text style={s.btnText}>Delete Account</Text>
                </Button>
              </View>
            </RBSheet>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              LogoutApi();
            }}
            style={s.input}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Inicon
                    name={'log-out-sharp'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              // value={fname}
              placeholder="Log Out"
              placeholderTextColor={textColor}
            />
          </TouchableOpacity>

          <View style={s.switch}>
            <Text style={[s.text, {color: textColor}]}>Dark & Light Mode</Text>
            <SwitchWithIcons
              icon={{true: moon, false: sun}}
              value={theme === 'dark' ? true : false}
              onValueChange={() => {
                setDarkMode(!darkMode);
                if (theme === 'dark') {
                  console.log('hi1');
                  setThemeApi('light');
                } else {
                  console.log('hi2');

                  setThemeApi('dark');
                }
              }}
              iconColor={{true: '#000', false: '#000'}}
              trackColor={{true: '#343434', false: '#343434'}}
              thumbColor={{true: '#FFD700', false: '#fff'}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
