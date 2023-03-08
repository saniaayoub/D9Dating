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
import {Input} from 'native-base';
import SwitchWithIcons from 'react-native-switch-with-icons';
import sun from '../../../../assets/images/png/sun.png';
import moon from '../../../../assets/images/png/moon.png';
import RBSheet from 'react-native-raw-bottom-sheet';
import Feather from 'react-native-vector-icons/Feather';
import axiosconfig from '../../../../Providers/axios';
import Loader from '../../../../Components/Loader';

const Settings = ({navigation}) => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.reducer.userToken);
  const userData = useSelector(state => state.reducer.userData);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
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

  const showToast = msg => {
    Alert.alert(msg);
  };

  const deleteAccount = async () => {
    refRBSheet.current.close();
    setLoader(true);
    if (!password || !confirmPassword) {
      setLoader(false);
      return;
    }
    if (confirmPassErr) {
      setLoader(false);
      return;
    }
    const body = {
      old_password: password,
    };
    await axiosconfig
      .post('account_delete', body, {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ODk1ZTI5Ni00NGE0LTQ3NGQtODk3Zi1mZTMxNDI4ZjM5Y2UiLCJqdGkiOiIwYzU5NDJjNWFlYzUwYmUxZjg5YjZmN2E1ZTM5OTcyYmUyMzA4NDNkMDE3M2Q1MmRkMmNjNDEwOWExOTQ4YjcyY2UyYzMyMTJiMTM3ZWRlYiIsImlhdCI6MTY3ODE2Nzk4MC42NTQ1NDMsIm5iZiI6MTY3ODE2Nzk4MC42NTQ1NDcsImV4cCI6MTcwOTc5MDM4MC42NDc4ODcsInN1YiI6IjIiLCJzY29wZXMiOltdfQ.bqK6MiDu6MDiBEnh671d45NWQp1rrmAokvyIQNHE7EKPMn9rvCC_O0M2SwYb6onSYFKGY8TffoGamovsIXPM1KYWgXg56m4zbv9gT1SXI0VjM3eTmlTbHngMp_IzM-tA1jOIRuqaLvf7gq_w2LJeP0iKQl87v2_XBrN-JvIzQcAS7VVYxFvIe_ayj15IXkC7XuTLqFm5mN99Ay92nSLM-WhXc0psoQQODr-it2L2aN69rxRxDta8_PIgD5Tfyf5oxrnG6w0wMhVW2SPI14pRmLJnvYNCRtOJL3aHWKqazpVdKfo_kROKHItSmcjH3BsaggKVirnG5SD44FapEt-qDvc11JM-fG8CMEugTarvNOw1y7_2yfxaC0ZomeFX5Si5rGA3Pq9ezmRFPMNEvmfQ0sXcKpNJ-bndYNscF36pK9F6huypxHwfZejwa4h-yCUSNV82gdpWGJJihxBf339OfV5h2xRkryDVeXlxQ96NGcBfn8YgMJ_jyz5NJGN4EIX0u3D3agnoxhSoWXILOgEg8jSnBdTffx_6br0yXa5y5fVt0EBiL_OBoWsLfrDHGqGs_QJhI6PGp6aq_8Pl1vfbkN2VMTIYSHh-DMgnlzBaN1ISs2knlAWLWizc7UUPlUnzkKrHq8v1n2T5qLg3ozMv_o-AOKJNfTQV-v-1aOP9kmI`,
        },
      })
      .then(res => {
        clear(res?.data?.messsage);
        logout();
      })
      .catch(err => {
        clear(err.response?.data?.messsage);
      });
  };

  const clear = message => {
    showToast(message);
    setPassword('');
    setConfirmPassword('');
    setLoader(false);
  };
  const logout = () => {
    dispatch(setUserToken(null));
  };
  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}

      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        <View style={{flexDirection: 'row'}}>
          <View style={s.dp}>
            <Image source={img1} style={s.dp1} resizeMode={'cover'} />
          </View>

          <View style={s.username}>
            <Text style={[s.textBold, {color: textColor}]}>Julie Watson</Text>
          </View>
        </View>
        <View style={s.inputSection}>
          <TouchableOpacity
            onPress={() => {
              console.log('hiii');
              navigation.navigate('Privacy');
            }}
            style={s.input}
          >
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
            style={s.input}
          >
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
            onPress={() => navigation.navigate('ResetPass')}
          >
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
            onPress={() => refRBSheet.current.open()}
          >
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
              }}
            >
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
                          onPress={() => setshowPass(!showPass)}
                        >
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
                {passwordError ? (
                  <Text style={{color: 'red'}}>{passwordError}</Text>
                ) : null}
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
                          onPress={() => setshowConfPass(!showConfPass)}
                        >
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
                {confirmPassErr ? (
                  <Text style={{color: 'red'}}>{confirmPassErr}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => deleteAccount()}
                style={s.dltbtn}
              >
                <Text style={s.dltTxt}>Delete Account</Text>
              </TouchableOpacity>
            </RBSheet>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              logout();
            }}
            style={s.input}
          >
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
                  dispatch(setTheme('light'));
                } else {
                  console.log('hi2');

                  dispatch(setTheme('dark'));
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
