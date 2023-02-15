import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import s from './style';
import Feather from 'react-native-vector-icons/Feather';
import {Input, Button, Radio, ListItem} from 'native-base';
import {moderateScale} from 'react-native-size-matters';
import PhoneInput from 'react-native-phone-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioButton from '../../../Components/Radio';
import {useDispatch, useSelector} from 'react-redux';
import {setTheme} from '../../../Redux/actions';
import Header from '../../../Components/Header';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const phonenum = useRef();
  const [fname, setFname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [disable, setDisable] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setshowPass] = useState(true);
  const [showPasso, setshowPasso] = useState(true);
  const [fnameErr, setFnameErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passErr, setPassErr] = useState('');
  const [conPassErr, setConPassErr] = useState('');
  const [phNumErr, setPhNumErr] = useState('');
  const [loader, setLoader] = useState(false);
  const [value, setValue] = React.useState('one');
  const [gender, setGender] = useState('Female');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const [isSelected, setIsSelected] = useState([
    {
      id: 1,
      value: true,
      name: 'Male',
      selected: gender == 'Male' ? true : false,
    },
    {
      id: 2,
      value: false,
      name: 'Female',
      selected: gender == 'Female' ? true : false,
    },
    {
      id: 3,
      value: false,
      name: 'Other',
      selected: gender == 'Other' ? true : false,
    },
  ]);
  useEffect(() => {}, []);
  const onRadioBtnClick = item => {
    let updatedState = isSelected.map(isSelectedItem =>
      isSelectedItem.id === item.id
        ? {...isSelectedItem, selected: true}
        : {...isSelectedItem, selected: false},
    );
    setIsSelected(updatedState);
    setGender(item.name);
    console.log(item.name);
  };
  const handleConfirm = date => {
    setDate(date);
    setOpen(false);
  };

  var check = moment(date, 'YYYY/MM/DD');

  var month = check.format('M');
  var datee = check.format('DD');
  var year = check.format('YYYY');

  const Textcolor = theme === 'dark' ? '#fff' : '#222222';
  const color = theme === 'dark' ? '#222222' : '#fff';

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={[
          s.container,
          {backgroundColor: theme === 'dark' ? '#222222' : '#fff'},
        ]}
      >
        <View style={s.header}>
          <Header navigation={navigation} />
        </View>
        <View style={s.heading}>
          <Text style={[s.headingText, {color: Textcolor}]}>Create Your </Text>
          <Text
            style={[
              s.headingText,
              {fontFamily: 'Poppins-Bold', color: Textcolor},
            ]}
          >
            {' '}
            Account
          </Text>
        </View>
        <ScrollView
          style={{
            width: '100%',
          }}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: moderateScale(20, 0.1),
          }}
        >
          <View style={s.input}>
            <View style={{flex: 0.4}}>
              <Text style={[s.inputTxt, {color: Textcolor}]}>Name</Text>
            </View>
            <View style={{flex: 0.3}}>
              <Input
                w={{
                  base: '90%',
                  md: '25%',
                }}
                placeholder="First Name"
                variant="underlined"
                placeholderTextColor={Textcolor}
                color={Textcolor}
                fontSize={moderateScale(10, 0.1)}
              />
            </View>
            <View style={{flex: 0.3}}>
              <Input
                w={{
                  base: '90%',
                  md: '15%',
                }}
                placeholder="Last Name"
                variant="underlined"
                placeholderTextColor={Textcolor}
                color={Textcolor}
                fontSize={moderateScale(10, 0.1)}
              />
            </View>

            {fnameErr ? <Text style={s.error}>{fnameErr}</Text> : <></>}
          </View>
          <View style={s.input}>
            <View style={{flex: 0.4}}>
              <Text style={[s.inputTxt, {color: Textcolor}]}>Gender</Text>
            </View>
            <View
              style={{
                flex: 0.6,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {isSelected.map((item, i) => (
                <View style={s.radio}>
                  <RadioButton
                    onPress={() => onRadioBtnClick(item)}
                    selected={item.selected}
                    key={item.id}
                  >
                    {item.name}
                  </RadioButton>
                </View>
              ))}
            </View>
          </View>
          <View style={s.input}>
            <View style={{flex: 0.4}}>
              <Text style={[s.inputTxt, {color: Textcolor}]}>
                Date of Birth
              </Text>
            </View>
            <View style={{flex: 0.6}}>
              <TouchableOpacity onPress={() => setOpen(true)}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: moderateScale(5, 0.1),
                  }}
                >
                  <View style={[s.dateView, {borderBottomColor: Textcolor}]}>
                    <Text style={[s.date, {color: Textcolor}]}>
                      {date ? datee : 'Date'}
                    </Text>
                  </View>

                  <View style={[s.dateView, {borderBottomColor: Textcolor}]}>
                    <Text style={[s.date, {color: Textcolor}]}>
                      {date ? month : 'month'}
                    </Text>
                  </View>

                  <View style={[s.dateView, {borderBottomColor: Textcolor}]}>
                    <Text style={[s.date, {color: Textcolor}]}>
                      {date ? year : 'Year'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <DatePicker
                modal
                open={open}
                date={date}
                // textColor ={Textcolor}
                minimumDate={new Date('1995-05-15')}
                maximumDate={new Date('2012-06-15')}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </View>

            {fnameErr ? <Text style={s.error}>{fnameErr}</Text> : <></>}
          </View>

          <View style={s.input}>
            <View style={{flex: 0.4}}>
              <Text style={[s.inputTxt, {color: Textcolor}]}>Phone Number</Text>
            </View>
            <View style={{flex: 0.6}}>
              <PhoneInput
                style={{bottom: moderateScale(-10, 0.1)}}
                initialCountry={'us'}
                textProps={{
                  placeholder: 'Enter Phone Number',
                  placeholderTextColor: Textcolor,
                }}
                pickerBackgroundColor={'grey'}
                pickerButtonColor={'#fff'}
                isReadOnly={disable}
                autoFormat={true}
                textStyle={[s.inputStyle, {color: Textcolor}]}
                isValidNumber={e => console.log(e, 'here')}
                ref={phonenum}
                onChangePhoneNumber={phNumber => {
                  if (phonenum.current.isValidNumber()) {
                    console.log('jdj');
                    setPhNumErr('');
                  } else {
                    setPhNumErr('*');
                  }
                }}
              />
              <Input
                style={{marginTop: moderateScale(-20, 0.1)}}
                w={{
                  base: '100%',
                  md: '25%',
                }}
                variant="underlined"
                // placeholderTextColor={Textcolor}
                isReadOnly={true}
                color={Textcolor}
              />
            </View>

            {phNumErr ? <Text style={[s.error]}>{phNumErr}</Text> : null}
          </View>

          <View style={s.input}>
            <View style={{flex: 0.4}}>
              <Text style={[s.inputTxt, {color: Textcolor}]}>Email Adress</Text>
            </View>
            <View style={{flex: 0.6}}>
              <Input
                w={{
                  base: '100%',
                  md: '25%',
                }}
                variant="underlined"
                placeholderTextColor={Textcolor}
                color={Textcolor}
                fontSize={moderateScale(10, 0.1)}
              />
            </View>

            {fnameErr ? <Text style={s.error}>{fnameErr}</Text> : <></>}
          </View>
          <View style={s.input}>
            <View style={{flex: 0.4}}>
              <Text style={[s.inputTxt, {color: Textcolor}]}>Password</Text>
            </View>
            <View style={{flex: 0.6}}>
              <Input
                w={{
                  base: '100%',
                  md: '25%',
                }}
                variant="underlined"
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

            {fnameErr ? <Text style={s.error}>{fnameErr}</Text> : <></>}
          </View>
          <View style={s.input}>
            <View style={{flex: 0.4}}>
              <Text style={[s.inputTxt, {color: Textcolor}]}>
                Confirm Password
              </Text>
            </View>
            <View style={{flex: 0.6}}>
              <Input
                w={{
                  base: '100%',
                  md: '25%',
                }}
                variant="underlined"
                placeholderTextColor={Textcolor}
                value={confirmPassword}
                onChangeText={password => {
                  setConfirmPassword(password);
                }}
                InputRightElement={
                  confirmPassword ? (
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
          </View>
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
              style={s.shadow}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={s.btnText}>Register</Text>
            </Button>
          </View>
        </ScrollView>
        <View style={s.bottomLink}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: moderateScale(20, 0.1),
            }}
          >
            <TouchableOpacity>
              <Text
                style={[
                  s.forgetPass,
                  {color: Textcolor, textDecorationLine: 'underline'},
                ]}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <Text style={[s.forgetPass, {textDecorationLine: 'none'}]}>
              {'  '}&{'  '}
            </Text>
            <TouchableOpacity>
              <Text style={[s.forgetPass, {textDecorationLine: 'underline'}]}>
                Terms & conditions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;
