import {createStackNavigator} from '@react-navigation/stack';
import ForgetPassword from '../../../screens/Auth/ForgetPass';
import Login from '../../../screens/Auth/Login';
import Register from '../../../screens/Auth/Register';
import StartScreen from '../../../screens/Auth/Start';
import ChangePass from '../..//../screens/Auth/ChangePass';
import Map from '../../../screens/Auth/Register/Map';
import GooglePlacesInput from '../../../screens/Auth/Register/Map';
import Map1 from '../../../screens/Auth/Register/Map1';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

const AuthStack = () => {
  const exist = useSelector(state => state.reducer.exist);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!exist ? (
        <Stack.Screen name="StartScreen" component={StartScreen} />
      ) : null}

      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
      <Stack.Screen name="Maps" component={Map} />
      <Stack.Screen name="Map1" component={Map1} />
    </Stack.Navigator>
  );
};

export default AuthStack;
