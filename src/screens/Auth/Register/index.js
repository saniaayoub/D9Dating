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
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import axiosconfig from '../../../provider/axios';
import OTPModal from '../../../Components/otpModal/otpModal.js';
import s from './style';
import Feather from 'react-native-vector-icons/Feather';
import {Input, Button, Radio, ListItem, Menu, Pressable} from 'native-base';
import {moderateScale} from 'react-native-size-matters';
import PhoneInput from 'react-native-phone-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioButton from '../../../Components/Radio';
import {useDispatch, useSelector} from 'react-redux';
import {setTheme, setUserToken} from '../../../Redux/actions';
import Header from '../../../Components/Header';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  ProviderPropType,
} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import style from '../../../Components/Header/style';
import Loader from '../../../Components/Loader';

const Organization = [
  {id: 'Alpha Phi Alpha Fraternity, Inc.', color: 'blue'},
  {id: 'Alpha Kappa Alpha Sorority Inc.', color: 'green'},
  {id: 'Omega Psi Phi Fraternity, Inc.', color: 'red'},
  {id: 'Delta Sigma Theta Sorority Inc.', color: 'yellow'},
  {id: 'Kappa Alpha Psi Fraternity, Inc.', color: 'orange'},
  {id: 'Sigma Gamma Rho Sorority Inc.', color: 'brown'},
  {id: 'Phi Beta Sigma Fraternity, Inc.', color: 'pink'},
  {id: 'Zeta Phi Beta Sorority Inc.', color: 'purple'},
  {id: 'Iota Phi Theta Fraternity, Inc.', color: 'blue'},
];

const Register = ({navigation}) => {
  const dispatch = useDispatch();
  const FCMtoken = useSelector(state => state.reducer.fToken);
  const phonenum = useRef();
  const [fname, setFname] = useState(null);
  const [lastname, setLastname] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [disable, setDisable] = useState(false);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [showPass, setshowPass] = useState(true);
  const [showConPass, setshowConPass] = useState(true);
  const [loader, setLoader] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [onsubmit, setOnsubmit] = useState(false);
  const [gender, setGender] = useState('Female');
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState();
  const theme = useSelector(state => state.reducer.theme);
  const [icon, setIcon] = useState('globe');
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
  const [organization, setOrganization] = useState(null);
  const [value, setValue] = useState([
    {
      label: 'Public',
      value: '1',
      icon: () => (
        <Entypo
          name={'globe'}
          color={Textcolor}
          size={moderateScale(15, 0.1)}
        />
      ),
    },
    {
      label: 'Freinds',
      value: '2',
      icon: () => (
        <Icon
          name={'user-friends'}
          color={Textcolor}
          size={moderateScale(15, 0.1)}
        />
      ),
    },
    {
      label: 'Only me',
      value: '3',
      icon: () => (
        <Entypo name={'lock'} color={Textcolor} size={moderateScale(15, 0.1)} />
      ),
    },
  ]);
  const [d, setD] = useState('');
  const [m, setM] = useState('');
  const [y, setY] = useState('');
  const {width, height} = Dimensions.get('window');
  const Textcolor = theme === 'dark' ? '#fff' : '#222222';
  const color = theme === 'dark' ? '#222222' : '#fff';
  const ASPECT_RATIO = width / height;
  const LATITUDE = 35.4828833;
  const LONGITUDE = -97.7593856;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const userLocation = useSelector(state => state.reducer.location);
  const [location, setLocation] = useState(userLocation);
  console.log(FCMtoken, 'fcmToken');

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

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const validateEmail = e => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(e)) {
      setIsEmail(true);
    } else {
      setIsEmail(false);
    }
  };
  const submit = () => {
    setOnsubmit(true);
    let sub = true;

    if (fname == null) {
      sub = false;
      return false;
    }
    if (lastname == null) {
      sub = false;
      return false;
    }
    if (email == null || email == '') {
      sub = false;
      return false;
    }
    if (date == null) {
      sub = false;
      return false;
    }
    if (password == null) {
      sub = false;
      return false;
    }
    if (date == null) {
      sub = false;
      return false;
    }
    if (organization == null) {
      sub = false;
      return false;
    }
    if (password != confirmPassword) {
      alert('password does not match');
      sub = false;
      return false;
    }
    if (sub) {
      onSignupUser();
    }
  };
  // const context = useContext(AppContext)
  const onSignupUser = () => {
    setLoader(true);
    setOnsubmit(false);
    var data = {
      email: email,
    };
    axiosconfig
      .post('otp', data)
      .then(res => {
        if (modalVisible == false) {
          Alert.alert(res?.data?.message);
          console.log(res, 'signup data ');
          setTimeout(() => {
            setModalVisible(!modalVisible);
          }, 3000);
          // setOnsubmit(true)
          setLoader(false);
        } else {
          Alert.alert('code sent');
        }
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'errors');
        console.log(err.response?.data?.message, 'error messagaae');
        Alert.alert(err?.response?.data?.message);
      });
  };
  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@auth_token', value);
      context.setuserToken(value);
    } catch (e) {}
  };
  const handleSubmit = () => {
    setLoader(true);
    setOnsubmit(false);
    var data = {
      fcmToken: FCMtoken,
      name: fname,
      last_name: lastname,
      email: email,
      otp: otp,
      phone_number: phonenum.current.getValue(),
      gender: gender,
      location: userLocation,
      group: organization,
      password: password,
      confirm_password: confirmPassword,
      date: date,
      type: 'user',
    };
    console.log(data, 'data');
    axiosconfig
      .post('register', data)
      .then(res => {
        console.log(res?.data, 'user register data');
        Alert.alert(res?.data?.message);
        AsyncStorage.setItem('password', password);
        AsyncStorage.setItem('userToken', res?.data?.access_token);
        let id = res?.data?.userInfo.toString();
        AsyncStorage.setItem('id', id);
        console.log(res, 'Login data ');
        dispatch(setUserToken(res?.data?.access_token));
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'errors');
        console.log(err?.response?.data?.message, 'msg');
        Alert.alert(err.response?.data?.message);
      });
  };
  // const context = useContext(AppContext)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  let check;
  let month;
  let dateex;
  let year;

  const handleConfirm = datee => {
    console.warn('A date has been picked: ', datee);
    check = moment(datee, 'YYYY/MM/DD');
    month = check.format('M');
    dateex = check.format('DD');
    year = check.format('YYYY');
    setM(month);
    setY(year);
    setD(dateex);
    console.log(year, 'year');
    setDate(`${month}/${dateex}/${year}`);

    hideDatePicker();
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme === 'dark' ? '#222222' : '#fff'}}>
      {loader ? <Loader /> : null}
      <ScrollView>
        <View
          style={[
            s.container,
            {backgroundColor: theme === 'dark' ? '#222222' : '#fff'},
          ]}>
          <View style={s.header}>
            <Header navigation={navigation} />
          </View>
          <View style={s.heading}>
            <Text style={[s.headingText, {color: Textcolor}]}>Sign Up</Text>
            {/* <Text
              style={[
                s.headingText,
                {fontFamily: 'Poppins-Bold', color: Textcolor},
              ]}
            >
              {' '}
              Account
            </Text> */}
          </View>
          <ScrollView
            style={{
              width: '100%',
            }}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: moderateScale(20, 0.1),
              paddingHorizontal: moderateScale(9, 0.1),
            }}>
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
                  style={{
                    borderBottomColor:
                      onsubmit && fname == null ? 'red' : Textcolor,
                    borderBottomWidth: 1,
                  }}
                  placeholder="First Name"
                  variant="unstyled"
                  placeholderTextColor={Textcolor}
                  onChangeText={e => setFname(e)}
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
                  style={{
                    borderBottomColor:
                      onsubmit && lastname == null ? 'red' : Textcolor,
                    borderBottomWidth: 1,
                  }}
                  variant="unstyled"
                  placeholderTextColor={Textcolor}
                  color={Textcolor}
                  onChangeText={e => setLastname(e)}
                  fontSize={moderateScale(10, 0.1)}
                />
              </View>
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
                }}>
                {isSelected.map((item, i) => (
                  <View style={s.radio}>
                    <RadioButton
                      onPress={() => onRadioBtnClick(item)}
                      selected={item.selected}
                      key={item.id}>
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
                <TouchableOpacity onPress={() => showDatePicker()}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: moderateScale(5, 0.1),
                    }}>
                    <View
                      style={[
                        s.dateView,
                        {
                          borderBottomWidth: 1,
                          borderBottomColor:
                            onsubmit && date == null ? 'red' : Textcolor,
                        },
                      ]}>
                      <Text style={[s.date, {color: Textcolor}]}>
                        {date ? m : 'MM'}
                      </Text>
                    </View>

                    <View
                      style={[
                        s.dateView,
                        {
                          borderBottomWidth: 1,
                          borderBottomColor:
                            onsubmit && date == null ? 'red' : Textcolor,
                        },
                      ]}>
                      <Text style={[s.date, {color: Textcolor}]}>
                        {date ? d : 'DD'}
                      </Text>
                    </View>

                    <View
                      style={[
                        s.dateView,
                        {
                          borderBottomWidth: 1,
                          borderBottomColor:
                            onsubmit && date == null ? 'red' : Textcolor,
                        },
                      ]}>
                      <Text style={[s.date, {color: Textcolor}]}>
                        {date ? y : 'YYY'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  maximumDate={maxDate}
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>
            </View>

            <View style={s.input}>
              <View style={{flex: 0.4}}>
                <Text style={[s.inputTxt, {color: Textcolor}]}>
                  Phone Number
                </Text>
              </View>
              <View style={{flex: 0.6}}>
                <PhoneInput
                  style={{
                    bottom: Platform.OS == 'ios' ? 0 : moderateScale(-10, 0.1),
                  }}
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
                      setIsPhone(true);
                    } else {
                      setIsPhone(false);
                    }
                  }}
                />
                <Input
                  w={{
                    base: '100%',
                    md: '25%',
                  }}
                  style={{
                    marginTop: moderateScale(-15, 0.1),
                    borderBottomColor:
                      onsubmit && isPhone == false ? 'red' : Textcolor,
                    borderBottomWidth: 1,
                  }}
                  variant="unstyled"
                  // placeholderTextColor={Textcolor}
                  isReadOnly={true}
                  color={Textcolor}
                />
              </View>
            </View>

            <View style={s.input}>
              <View style={{flex: 0.4}}>
                <Text style={[s.inputTxt, {color: Textcolor}]}>
                  Email Adress
                </Text>
              </View>
              <View style={{flex: 0.6}}>
                <Input
                  w={{
                    base: '100%',
                    md: '25%',
                  }}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor:
                      onsubmit && email == null ? 'red' : Textcolor,
                  }}
                  variant="unstyled"
                  placeholderTextColor={Textcolor}
                  color={Textcolor}
                  fontSize={moderateScale(10, 0.1)}
                  onChangeText={e => {
                    validateEmail(e);
                    setEmail(e);
                    // validateEmail();
                  }}
                />
                {onsubmit && isEmail === false && email != null ? (
                  <>
                    <View
                      style={{
                        height: 15,
                        justifyContent: 'center',
                        width: '90%',
                        marginBottom: 20,
                      }}>
                      <Text style={{fontSize: 12, color: 'red'}}>
                        please enter valid email
                      </Text>
                    </View>
                  </>
                ) : null}
              </View>
            </View>
            <View style={s.input}>
              <View style={{flex: 0.4}}>
                <Text style={[s.inputTxt, {color: Textcolor}]}>
                  Organization
                </Text>
              </View>
              <View style={{flex: 0.6}}>
                <Menu
                  style={{width: '80%'}}
                  borderWidth={moderateScale(1, 0.1)}
                  borderBottomColor={'grey'}
                  backgroundColor={color}
                  // marginRight={moderateScale(5, 0.1)}

                  top={moderateScale(24, 0.1)}
                  borderColor={Textcolor}
                  trigger={triggerProps => {
                    return (
                      <Pressable
                        accessibilityLabel="More options menu"
                        {...triggerProps}
                        style={{
                          flexDirection: 'row',
                          borderColor: Textcolor,
                          borderBottomWidth: 1,
                          borderBottomColor:
                            onsubmit && organization == null
                              ? 'red'
                              : Textcolor,
                          marginBottom: moderateScale(-10, 0.1),
                          paddingLeft: moderateScale(10, 0.1),
                          // width: moderateScale(170, 0.1),
                          alignItems: 'center',
                          marginTop: moderateScale(18, 0.1),
                        }}>
                        <Text
                          style={[
                            s.option,
                            {
                              color: Textcolor,
                              flex: 0.8,
                              paddingBottom: moderateScale(12, 0.1),
                            },
                          ]}>
                          {organization}
                        </Text>

                        <Entypo
                          style={{
                            flex: 0.2,
                            paddingBottom: moderateScale(12, 0.1),
                          }}
                          name={'chevron-down'}
                          size={moderateScale(25, 0.1)}
                          color={Textcolor}
                        />
                      </Pressable>
                    );
                  }}>
                  {Organization.map((v, i) => {
                    return (
                      <Menu.Item
                        style={{width: 400}}
                        onPress={() => {
                          setOrganization(v.id);
                        }}>
                        <View style={s.optionView}>
                          <Text style={[s.optionBtns, {color: Textcolor}]}>
                            {v.id}
                          </Text>
                        </View>
                      </Menu.Item>
                    );
                  })}
                  {/* <Menu.Item
                    onPress={() => {
                      setGroup('Group 1');
                    }}
                  >
                    <View style={s.optionView}>
                      <Text style={[s.optionBtns, {color: Textcolor}]}>
                        Group 1
                      </Text>
                    </View>
                  </Menu.Item> 
                  <Menu.Item
                    onPress={() => {
                      setGroup('Group 2');
                    }}
                  >
                    <View style={s.optionView}>
                      <Text style={[s.optionBtns, {color: Textcolor}]}>
                        Group 2
                      </Text>
                    </View>
                  </Menu.Item>
                  <Menu.Item
                    onPress={() => {
                      setGroup('Group 3');
                    }}
                  >
                    <View style={s.optionView}>
                      <Text style={[s.optionBtns, {color: Textcolor}]}>
                        Group 3
                      </Text>
                    </View>
                  </Menu.Item> */}
                </Menu>
              </View>
            </View>
            <View style={s.input}>
              <View style={{flex: 0.4}}>
                <Text style={[s.inputTxt, {color: Textcolor}]}>Location</Text>
              </View>
              <View style={{flex: 0.6}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Map', {from: 'register'})
                  }>
                  <Input
                    w={{
                      base: '100%',
                      md: '25%',
                    }}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor:
                        onsubmit && location == null ? 'red' : Textcolor,
                    }}
                    // onTouchStart={() => navigation.navigate('Maps')}
                    // onPressIn={() => navigation.navigate('Map',{
                    //   from : 'register'
                    // })}
                    variant="unstyled"
                    editable={false}
                    placeholder={userLocation ? userLocation : 'Enter Location'}
                    onChangeText={() => setLocation(location)}
                    placeholderTextColor={Textcolor}
                    color={Textcolor}
                    fontSize={moderateScale(10, 0.1)}
                  />
                </TouchableOpacity>
              </View>
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
                  style={{
                    borderBottomColor:
                      onsubmit && password == null ? 'red' : Textcolor,
                    borderBottomWidth: 1,
                  }}
                  variant="unstyled"
                  placeholderTextColor={Textcolor}
                  value={password}
                  onChangeText={password => {
                    setPassword(password);
                  }}
                  InputRightElement={
                    password ? (
                      <View style={s.eye}>
                        <TouchableOpacity
                          onPress={() => setshowPass(!showPass)}>
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
                  style={{
                    borderBottomColor:
                      onsubmit && confirmPassword == null ? 'red' : Textcolor,
                    borderBottomWidth: 1,
                  }}
                  variant="unstyled"
                  placeholderTextColor={Textcolor}
                  value={confirmPassword}
                  onChangeText={password => {
                    setConfirmPassword(password);
                  }}
                  InputRightElement={
                    confirmPassword ? (
                      <View style={s.eye}>
                        <TouchableOpacity
                          onPress={() => setshowConPass(!showConPass)}>
                          <Feather
                            name={showConPass ? 'eye' : 'eye-off'}
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
                  secureTextEntry={showConPass}
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
                onPressIn={() => submit()}>
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
        {modalVisible ? (
          <OTPModal
            navigation={navigation}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            submit={submit}
            onSignupUser={onSignupUser}
            setOtp={setOtp}
            handleSubmit={handleSubmit}
            screen={'register'}
            // loader={loader}
          />
        ) : (
          <></>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
