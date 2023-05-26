import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../../../screens/App/User';
import Help from '../../../screens/App/User/Help';
import Settings from '../../../screens/App/User/Settings';
import Privacy from '../../../screens/App/User/Privacy';
import Resetpass from '../../../screens/App/User/ResetPass';
import ForgetPassword from '../../../screens/Auth/ForgetPass';
import About from '../../../screens/App/User/About/About';
import ChangePass from '../../../screens/Auth/ChangePass';
import Map from '../../../screens/Auth/Register/Map';
import Login from '../../../screens/Auth/Login';
import Block from '../../../screens/App/User/Blocked';
import HiddenPosts from '../../../screens/App/User/Hidden Posts';
import socket from '../../../utils/socket';
import {TouchableOpacity, Text} from 'react-native';
import {useToast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {moderateScale} from 'react-native-size-matters';
import {useEffect} from 'react';
import * as RootNavigation from '../../../../RootNavigation';
const Stack = createStackNavigator();

const ProfileStack = () => {
  const toast = useToast();

  useEffect(() => {
    socket.on('private_message', ({content, from, time}) => {
      toast.show({
        placement: 'top',
        render: () => {
          return (
            <TouchableOpacity
              style={{
                borderRadius: moderateScale(10, 0.1),
                paddingVertical: moderateScale(10, 0.1),
                paddingHorizontal: moderateScale(15, 0.1),
                backgroundColor: '#FFD700',
                flexDirection: 'row',
              }}
              onPress={() => {
                RootNavigation.navigate('MessageStack');
              }}>
              <Icon name={'envelope'} color={'#000'} size={18} />
              <Text style={{color: '#000', marginLeft: moderateScale(10, 0.1)}}>
                You have a new message
              </Text>
            </TouchableOpacity>
          );
        },
      });
    });
  }, [socket]);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="ResetPass" component={Resetpass} />
      <Stack.Screen name="Forgot" component={ForgetPassword} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Block" component={Block} />
      <Stack.Screen name="HiddenPosts" component={HiddenPosts} />

      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
