import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
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

const Settings = ({navigation}) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPass, setshowPass] = useState(true);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const color2 = theme === 'dark' ? '#343434' : '#fff';
  const [darkMode, setDarkMode] = useState(false);
  const refRBSheet = useRef();

  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
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
                  onChangeText={password => {
                    setConfirmPassword(password);
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
                  fontSize={moderateScale(14, 0.1)}
                  secureTextEntry={showPass}
                />
              </View>
              <TouchableOpacity
                onPress={() => refRBSheet.current.close()}
                style={s.dltbtn}
              >
                <Text style={s.dltTxt}>Delete Account</Text>
              </TouchableOpacity>
            </RBSheet>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setUserToken(null));
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
