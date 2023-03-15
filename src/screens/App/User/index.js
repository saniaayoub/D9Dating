import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {setTheme, setUserData, setLocation} from '../../../Redux/actions';
import s from './style';
import Header from '../../../Components/Header';
import Entypo from 'react-native-vector-icons/Entypo';
import Inicon from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';

import img1 from '../../../assets/images/png/mydp.png';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input, Stack, Button} from 'native-base';
import RBSheet from 'react-native-raw-bottom-sheet';
import RadioButton from '../../../Components/Radio';
import {
  launchCamera,
  launchImageLibrary,
  showImagePicker,
} from 'react-native-image-picker';
import axiosconfig from '../../../Providers/axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useIsFocused } from '@react-navigation/native';
import Loader from '../../../Components/Loader';
import RNFS from 'react-native-fs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const Profile = ({navigation}) => {
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  // const isFocused = useIsFocused();
  const userToken = useSelector(state => state.reducer.userToken);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const color2 = theme === 'dark' ? '#2E2D2D' : '#fff';
  const userLocation = useSelector(state => state.reducer.location);
  const [disable1, setDisable1] = useState(false);
  const [disable2, setDisable2] = useState(false);
  const [disable3, setDisable3] = useState(false);
  const [disable4, setDisable4] = useState(false);
  const [disable5, setDisable5] = useState(false);
  const [disable6, setDisable6] = useState(false);
  const [date, setDate] = useState(null);
  const [id, setId] = useState('');

  let formData = {
    id: '',
    name: '',
    last_name: '',
    about_me: '',
    email: '',
    phone_number: '',
    location: '',
    gender: 'male',
    month: '',
    date: '',
    image: '',
  };

  const [loader, setLoader] = useState(false);
  const [form, setForm] = useState(formData);
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );
  const [isSelected, setIsSelected] = useState([
    {
      id: 1,
      value: true,
      name: 'Male',
      selected: form?.gender == 'male' ? true : false,
    },
    {
      id: 2,
      value: false,
      name: 'Female',
      selected: form?.gender == 'female' ? true : false,
    },
  ]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  var check;
  var month;
  var dateex;
  var year;

  useEffect(() => {
    getData();
  }, []);

  const onRadioBtnClick = item => {
    let updatedState = isSelected.map(isSelectedItem =>
      isSelectedItem.id === item.id
        ? {...isSelectedItem, selected: true}
        : {...isSelectedItem, selected: false},
    );
    setIsSelected(updatedState);
    setForm({...form, gender: item.name});

    console.log(item.name);
  };

  const showToast = msg => {
    Alert.alert(msg);
    // ToastAndroid.show(msg, ToastAndroid.LONG);
  };

  let token = AsyncStorage.getItem('userToken');
  const getData = async () => {
    let SP = await AsyncStorage.getItem('id');
    console.log(SP, 'id');
    // setId(SP)
    setLoader(true);
    axiosconfig
      .get('user_view/12', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data', JSON.stringify(res.data));
        if (res.data.user_details) {
          setData(res.data.user_details);
        }
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err);
        // showToast(err.response);
      });
  };

  const setData = data => {
    for (let item of Object.keys(formData)) {
      // console.log(data[item]);
      formData[item] = data[item];
      if (item == 'location') {
        dispatch(setLocation(data[item]));
      }
    }
    setForm(formData);
    // console.log(form);
    dispatch(setUserData(formData));
    setLoader(false);
  };

  const save = async base64image => {
    setLoader(true);
    setForm({...form, location: userLocation});
    setForm({...form, image: base64image});

    console.log('form', form);
    await axiosconfig
      .post('user_update', form, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log(res.data, 'message');
        let message = res?.data?.messsage;
        showToast(message);
        dispatch(setUserData(form));
        console.log('form', form);
        setLoader(false);
      })
      .catch(err => {
        console.log(err);
        setLoader(false);
        getData();
        showToast(err.message);
      });
  };

  const convertImage = async image => {
    await RNFS.readFile(image, 'base64')
      .then(res => {
        let base64 = `data:image/png;base64,${res}`;
        setForm({...form, image: base64});
        console.log(base64);
        save(base64);
      })
      .catch(err => {
        console.log(err);
        showToast('Profile picture not updated');
        setLoader(false);
      });
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        let source = response;
        console.log(source.assets[0].uri, 'uri');
        // setFilePath(source.assets[0].uri);
        convertImage(source.assets[0].uri);
        refRBSheet.current.close();
      });
    }
  };

  const chooseFile = async type => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose file from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, res => {
      console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        console.log(source.assets[0].uri, 'uri');
        // setFilePath(source.assets[0].uri);
        convertImage(source.assets[0].uri);

        refRBSheet.current.close();
      }
    });
  };
  const handleConfirm = datee => {
    console.log('jhf');
    console.log('A date has been picked: ', datee);
    check = moment(datee, 'YYYY/MM/DD');
    console.log(check, 'date');
    month = check.format('M');
    dateex = check.format('DD');
    year = check.format('YYYY');
    console.log(month, 'month');
    console.log(dateex, 'dateeee');
    console.log(year, 'year');
    setDate(`${dateex}/${month}/${year}`);
    setForm({...form, date: `${dateex}/${month}/${year}`});
    console.log(date, 'c date');
    hideDatePicker();
  };

  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        <View style={s.dp}>
          <Image
            source={{uri: form?.image ? form?.image : dummyImage}}
            style={s.dp1}
            resizeMode={'cover'}
          />
          <View style={s.circle}>
            <TouchableOpacity
              onPress={() => refRBSheet.current.open()}
              style={s.edit}
            >
              <Entypo
                name={'edit'}
                size={moderateScale(10, 0.1)}
                color={'#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.username}>
          <Text style={[s.textBold, {color: textColor}]}>{form?.name}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Inicon
              name={'settings-sharp'}
              size={moderateScale(20, 0.1)}
              solid
              color={textColor}
            />
          </TouchableOpacity>
        </View>
        <View style={[s.inputSection, {backgroundColor: color2}]}>
          <View style={s.input}>
            <Input
              w="100%"
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Icon
                    name={'user'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    setDisable1(!disable1);
                  }}
                >
                  <Entypo
                    name={'edit'}
                    size={moderateScale(15, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
              // value={fname}
              onEndEditing={() => {
                setDisable1(!disable1);
              }}
              isReadOnly={!disable1}
              isFocused={disable1}
              placeholder="Full Name"
              placeholderTextColor={textColor}
              value={form?.name}
              onChangeText={text => {
                setForm({...form, name: text});
              }}
            />
          </View>
          <View style={s.input}>
            <Input
              w="100%"
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Inicon
                    name={'information-circle'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    setDisable2(!disable2);
                  }}
                >
                  <Entypo
                    name={'edit'}
                    size={moderateScale(15, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
              // value={fname}
              onEndEditing={() => {
                setDisable2(!disable2);
              }}
              isReadOnly={!disable2}
              isFocused={disable2}
              placeholder="About Me"
              placeholderTextColor={textColor}
              value={form?.about_me}
              onChangeText={text => {
                setForm({...form, about_me: text});
              }}
            />
          </View>
          <View style={s.input}>
            <Input
              w="100%"
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <MaterialIcon
                    name={'email'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    setDisable3(!disable3);
                  }}
                >
                  <Entypo
                    name={'edit'}
                    size={moderateScale(15, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
              // value={fname}
              onEndEditing={() => {
                setDisable3(!disable3);
              }}
              isReadOnly={!disable3}
              isFocused={disable3}
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={textColor}
              value={form?.email}
              onChangeText={text => {
                setForm({...form, email: text});
              }}
            />
          </View>
          <View style={s.input}>
            <Input
              w="100%"
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Icon
                    name={'phone-alt'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    setDisable4(!disable4);
                  }}
                >
                  <Entypo
                    name={'edit'}
                    size={moderateScale(15, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
              onEndEditing={() => {
                setDisable4(!disable4);
              }}
              isReadOnly={!disable4}
              isFocused={disable4}
              placeholder="Phone"
              keyboardType="numeric"
              placeholderTextColor={textColor}
              value={form?.phone_number}
              onChangeText={text => {
                setForm({...form, phone_number: text});
              }}
            />
          </View>
          <View style={s.input}>
            <Input
              w="100%"
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Fontisto
                    name={'date'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              onEndEditing={() => {
                setDisable5(!disable5);
              }}
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    showDatePicker();
                    // setDisable5(!disable5);
                  }}
                >
                  <Entypo
                    name={'edit'}
                    size={moderateScale(15, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
              // value={fname}

              isReadOnly={true}
              isFocused={disable5}
              placeholder={'Date of Birth'}
              placeholderTextColor={textColor}
              value={form?.date}
              // onChangeText={text => {
              //   setForm({ ...form, date: text });
              // }}
            />
          </View>
          <View style={s.input}>
            <Input
              w="100%"
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Inicon
                    name={'location'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              onEndEditing={() => {
                setDisable6(!disable6);
              }}
              InputRightElement={
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Map');
                    setDisable6(!disable6);
                  }}
                >
                  <Entypo
                    name={'edit'}
                    size={moderateScale(15, 0.1)}
                    color={textColor}
                  />
                </TouchableOpacity>
              }
              // value={fname}
              isReadOnly={true}
              isFocused={disable6}
              placeholder={'Location'}
              placeholderTextColor={textColor}
              value={userLocation}
              // onChangeText={text => {
              //   setForm({ ...form, location: text });
              // }}
            />
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View style={s.radioInput}>
            <Text style={[s.text, {color: textColor}]}>Gender</Text>
            {isSelected.map((item, i) => (
              <View style={s.radio} key={i}>
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
          <View style={s.button}>
            <Button
              size="sm"
              onPress={() => save()}
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
            >
              <Text style={s.btnText}>Save</Text>
            </Button>
          </View>
        </View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              alignItems: 'center',
              height: moderateScale(220),
              borderRadius: moderateScale(20, 0.1),
            },
          }}
        >
          <View
            style={{
              marginVertical: moderateScale(30, 0.1),
              justifyContent: 'center',
              alignContent: 'center',
            }}
          >
            <Stack
              direction={{
                base: 'column',
                md: 'row',
              }}
              space={4}
            >
              <Button
                transparent
                style={s.capturebtn}
                onPress={() => captureImage('photo')}
              >
                <View style={{flexDirection: 'row'}}>
                  <Ionicons name="camera" style={s.capturebtnicon} />
                  <Text style={s.capturebtntxt}>Open Camera</Text>
                </View>
              </Button>
              <Button
                transparent
                style={s.capturebtn}
                onPress={() => chooseFile('photo')}
              >
                <View style={{flexDirection: 'row'}}>
                  <Ionicons name="md-image-outline" style={s.capturebtnicon} />
                  <Text style={s.capturebtntxt}>Open Gallery</Text>
                </View>
              </Button>
            </Stack>
          </View>
        </RBSheet>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
