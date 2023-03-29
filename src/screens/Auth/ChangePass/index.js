import {
  SafeAreaView,
  Text,
  View,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import s from './style';
import Feather from 'react-native-vector-icons/Feather';
import {Input, FormControl, Button, Alert} from 'native-base';
import {moderateScale} from 'react-native-size-matters';
import Icon2 from 'react-native-vector-icons/Fontisto';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setTheme} from '../../../Redux/actions';
import Header from '../../../Components/Header';
import axiosconfig from '../../../Providers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../Components/Loader';

const ChangePass = ({navigation, route}) => {
  const dispatch = useDispatch();
  const screen = route?.params?.screen;
  console.log(screen);
  const [email, setEmail] = useState(route.params.email);
  const [otp, setOtp] = useState(route.params.otp);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [showPass, setshowPass] = useState(true);
  const [showConfPass, setShowConfPass] = useState(true);
  const [submitted, setSubmitted] = useState();
  const [loader, setLoader] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const showToast = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };
  const color = theme === 'dark' ? '#222222' : '#fff';
  const Textcolor = theme === 'dark' ? '#fff' : '#222222';
  const userToken = useSelector(state => state.reducer.userToken);

  const submit = () => {
    console.log('submit');
    setSubmitted(false);
    let sub = false;
    if (confirmPassword == null || confirmPassword == '') {
      setSubmitted(true);
      sub = true;
      return;
    }
    if (password == null || password == '') {
      setSubmitted(true);
      sub = true;
      return;
    }
    if (password != confirmPassword) {
      alert('password does not match');
      return;
    }
    if (!sub) {
      setLoader(true);
      var data = {
        email: email,
        password: password,
      };
      console.log({data});
      if (screen == 'reset') {
        var data = {
          password: password,
        };
      } else {
        console.log(email, otp);
        var data = {
          email: email,
          password: password,
          password_confirm: confirmPassword,
          token: otp,
        };
      }
      setLoader(true);
      axiosconfig
        .post(
          screen == 'Reset' ? 'password_update' : 'reset',
          data,
          screen == 'Reset'
            ? {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            : null,
        )
        .then(res => {
          setLoader(false);
          console.log(res?.data, 'change password data');
          alert(res?.data?.message);
          {
            screen == 'Reset'
              ? (AsyncStorage.setItem('password', password),
                navigation.navigate('Settings'))
              : (AsyncStorage.setItem('password', password),
                navigation.navigate('Login'));
          }
          //   navigation.navigate('ChangePass')
        })
        .catch(err => {
          setLoader(false);
          console.log(err.response, 'aaa');
          alert(err?.response?.data?.message);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}

      <Header navigation={navigation} />
      <View style={[s.container, {backgroundColor: color}]}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={s.heading}>
            <Text style={[s.headingText, {color: Textcolor}]}>
              Reset{' '}
              <Text style={[s.headingText1, {color: Textcolor}]}>Password</Text>
            </Text>
          </View>
          <View style={s.input}>
            <Input
              w={{
                base: '83%',
                md: '25%',
              }}
              variant="unstyled"
              InputLeftElement={
                <View style={[s.iconCircle, {borderColor: Textcolor}]}>
                  <Icon2
                    name="locked"
                    color={Textcolor}
                    size={moderateScale(20, 0.1)}
                  />
                </View>
              }
              style={{
                borderBottomColor:
                  submitted && password == null ? 'red' : Textcolor,
                borderBottomWidth: 1,
              }}
              placeholder="New Password"
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
          <View style={s.input}>
            <Input
              w={{
                base: '83%',
                md: '25%',
              }}
              variant="unstyled"
              InputLeftElement={
                <View style={[s.iconCircle, {borderColor: Textcolor}]}>
                  <MaterialIcon
                    name={'lock-reset'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={Textcolor}
                  />
                </View>
              }
              style={{
                borderBottomColor:
                  submitted && confirmPassword == null ? 'red' : Textcolor,
                borderBottomWidth: 1,
              }}
              placeholder="Confirm Password"
              placeholderTextColor={Textcolor}
              value={confirmPassword}
              onChangeText={password => {
                setConfirmPassword(password);
              }}
              InputRightElement={
                confirmPassword ? (
                  <View style={s.eye}>
                    <TouchableOpacity
                      onPress={() => setShowConfPass(!showConfPass)}
                    >
                      <Feather
                        name={showConfPass ? 'eye' : 'eye-off'}
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
              secureTextEntry={showConfPass}
            />
          </View>

          <View style={s.button}>
            <Button
              onPressIn={() => {
                // alert('password changed successfully')
                submit();
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
              alignItems={'center'}
            >
              <Text style={s.btnText}>Save</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ChangePass;
