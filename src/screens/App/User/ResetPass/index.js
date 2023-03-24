import {
  SafeAreaView,
  Text,
  View,
  ToastAndroid,
  TouchableOpacity,
  Alert
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import s from './style';
import Feather from 'react-native-vector-icons/Feather';
import {Input, FormControl, Button} from 'native-base';
import {moderateScale} from 'react-native-size-matters';
import Icon2 from 'react-native-vector-icons/Fontisto';
import {useDispatch, useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setTheme} from '../../../../Redux/actions';
import axiosconfig from '../../../../provider/axios';
import Header from '../../../../Components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../../Components/Loader';



const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);

const Resetpass = ({navigation}) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [showPass, setshowPass] = useState(true);
  const [loader, setLoader] = useState(false);
  const [storedPassword, setStorePassword] = useState('')
  const theme = useSelector(state => state.reducer.theme);
  const showToast = msg => {
    ToastAndroid.show(msg, ToastAndroid.LONG);
  };
  const color = theme === 'dark' ? '#222222' : '#fff';
  const Textcolor = theme === 'dark' ? '#fff' : '#222222';
useEffect(() => {
  getPassword()
}, [])

const getPassword = async()=>{
 let  SP =  await AsyncStorage.getItem('password')
 setStorePassword(SP)
}
const validate = ()=>{
  if(password == storedPassword){
    navigation.navigate('ChangePass',{
      screen:'Reset'
    })
  }
  else{
    Alert.alert("Password Incorrect")
  }
}
  const onsubmit = () => {
    var data = {
      password: 'admin123' ,
      
    }
    setLoader(true);
    axiosconfig
      .post('password_update', data)
      .then((res) => {
        setLoader(false);
        if (res.data.error) {
          alert('invalid credentials')
          console.log(res.data, 'invalid')

        } else {
          alert("password matched", res)
          console.log(res.data, 'password ')
          navigation.navigate('ChangePass')
          
        }
      })
      .catch(err => {
        setLoader(false);
        console.log(err.response, 'aaa')
        if (err.response.data.errors) {
          for (const property in err.response.data.errors) {
            alert(err.response.data.errors[property][0])
            return
          }
        } else {
          alert(err.response.data.message)
        }
      });
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}

      <Header navigation={navigation} />
      <View style={[s.container, {backgroundColor: color}]}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={s.heading}>
            <Text style={[s.headingText1, {color: Textcolor}]}>
              To set a new password, please enter {' '}
              <Text style={[s.headingText1, {color: Textcolor}]}>your current password first.</Text>
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
                <View style={[s.iconCircle, {borderColor: Textcolor}]}>
                  <Icon2 name="locked" color={Textcolor} size={moderateScale(20,0.1)} />
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
          {
            password ?
            (
              <>
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
              onPress={() =>
                validate()
              }
            >
              <Text style={s.btnText}>Continue</Text>
            </Button>
          </View>
              </>
            ): null
          }

          
          <View style={{marginVertical: moderateScale(10,0.1)}}>
            <Button
              size="md"
              variant={'link'}
              onPress={() => navigation.navigate('Forgot')}
            >
              <View style={{flexDirection: 'row'}}>
                <Text style={[s.forgetPass, {color: '#FFD700'}]}>Forgot </Text>
                <Text style={[s.forgetPass, {color: Textcolor}]}>
                  Password?
                </Text>
              </View>
            </Button>
          </View>
    
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Resetpass;
