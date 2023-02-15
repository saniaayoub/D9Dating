import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import s from './style';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Input, FormControl, Button } from 'native-base';
import { moderateScale } from 'react-native-size-matters';
import Lock from '../../../assets/images/svg/lock.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../../Redux/actions';
import Header from '../../../Components/Header';
import OTPModal from '../../../Components/otpModal/otpModal.js';
// import OTPInputView from '@twotalltotems/react-native-otp-input';

const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);

const ForgetPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validEmail, setValidEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPass, setshowPass] = useState(true);
  const [loader, setLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState();
  const theme = useSelector(state => state.reducer.theme);
  const showToast = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };
  const color = theme === 'dark' ? '#222222' : '#fff'
  const Textcolor = theme === 'dark' ? '#fff' : '#222222'

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
      <Header navigation={navigation} />
      <View
        style={[
          s.container,
          { backgroundColor: color },
        ]}
      >
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={s.heading}>
            <Text style={[s.headingText, { color: Textcolor }]}>
              Forgot <Text style={[s.headingText1, { color: Textcolor }]}>Password</Text>
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
              keyboardType='email-address'
              onChangeText={email => {
                setEmail(email);
                let valid = emailReg.test(email);
                setEmailError('');
                setValidEmail(valid);
              }}
              color={Textcolor}
              fontSize={moderateScale(14, 0.1)}
            />
            {emailError ? (
              <Text style={s.error}>{emailError}</Text>
            ) : (
              <Text> </Text>
            )}
          </View>


          <View style={s.button}>
            <Button
              onPress={() => { setModalVisible(!modalVisible)}}
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
              <Text style={s.btnText}>Send</Text>
            </Button>
            {/* <OTPInputView
              style={{ width: '80%', height: 200 }}
              pinCount={4}
              // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              // onCodeChanged = {code => { this.setState({code})}}
              autoFocusOnLoad
              // codeInputFieldStyle={styles.underlineStyleBase}
              // codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code => {
                console.log(`Code is ${code}, you are good to go!`)
              })}
            /> */}

          </View>


        </View>

        <View style={s.bottomLink}>
          <Button
            size="sm"
            variant={'link'}
            _text={{
              color: Textcolor,
            }}
            onPress={() => navigation.navigate('Register')}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={[s.forgetPass, { color: Textcolor }]}>
                Don’t Have an Account?
              </Text>
              <Text
                style={[s.forgetPass, { fontWeight: '700', color: '#FFD700' }]}
              >
                {' '}
                Sign up Now!
              </Text>
            </View>
          </Button>
        </View>
        {modalVisible ? (
            <OTPModal
               navigation={navigation}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              // submit={submit}
              setOtp={setOtp}
              // loader={loader}
            />
          ) : (
            <></>
          )}
      </View>
    </SafeAreaView>
  );
};

export default ForgetPassword;
