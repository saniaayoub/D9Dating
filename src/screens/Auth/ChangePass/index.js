import {
    SafeAreaView,
    Text,
    View,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import s from './style';
import Feather from 'react-native-vector-icons/Feather';
import { Input, FormControl, Button } from 'native-base';
import { moderateScale } from 'react-native-size-matters';
import Icon2 from 'react-native-vector-icons/Fontisto';
import { useDispatch, useSelector } from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setTheme } from '../../../Redux/actions';
import Header from '../../../Components/Header';

const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);

const ChangePass = ({ navigation }) => {
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPass, setshowPass] = useState(true);
    const [loader, setLoader] = useState(false);
    const theme = useSelector(state => state.reducer.theme);
    const showToast = msg => {
        ToastAndroid.show(msg, ToastAndroid.LONG);
    };
    const color = theme === 'dark' ? '#222222' : '#fff';
    const Textcolor = theme === 'dark' ? '#fff' : '#222222';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: color }}>
            <Header navigation={navigation} />
            <View style={[s.container, { backgroundColor: color }]}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={s.heading}>
                        <Text style={[s.headingText, { color: Textcolor }]}>
                            Change{' '}
                            <Text style={[s.headingText1, { color: Textcolor }]}>Password</Text>
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
                                <View style={[s.iconCircle, { borderColor: Textcolor }]}>
                                    <Icon2 name="locked" color={Textcolor} size={moderateScale(20, 0.1)} />
                                </View>
                            }
                            placeholder="New Password"
                            placeholderTextColor={Textcolor}
                            value={password}
                            onChangeText={password => {
                                setPassword(password);
                                setPasswordError('');
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
                            errorMessage={passwordError}
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
                            variant="underlined"
                            InputLeftElement={
                                <View style={[s.iconCircle, { borderColor: Textcolor }]}>
                                    <MaterialIcon
                                        name={'lock-reset'}
                                        size={moderateScale(20, 0.1)}
                                        solid
                                        color={Textcolor}
                                    />
                                </View>
                            }

                            placeholder="Confirm Password"
                            placeholderTextColor={Textcolor}
                            value={confirmPassword}
                            onChangeText={password => {
                                setConfirmPassword(password);
                                setPasswordError('');
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
                            errorMessage={passwordError}
                            color={Textcolor}
                            fontSize={moderateScale(14, 0.1)}
                            secureTextEntry={showPass}
                        />
                    </View>

                    <View style={s.button}>
                        <Button
                            onPress={() => {
                                alert('password changed successfully')
                                    navigation.navigate('Login')

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
