import {createStackNavigator} from '@react-navigation/stack';
import Notifications from '../../../screens/App/Notifications';
import ViewUser from '../../../screens/App/Home/ViewUser/index';
import {useEffect} from 'react';
import socket from '../../../utils/socket';
import {TouchableOpacity, Text} from 'react-native';
import {useToast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {moderateScale} from 'react-native-size-matters';
import * as RootNavigation from '../../../../RootNavigation';
const Stack = createStackNavigator();

const Notification = () => {
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
      <Stack.Screen name="Notification" component={Notifications} />
      <Stack.Screen name="ViewUser" component={ViewUser} />
    </Stack.Navigator>
  );
};

export default Notification;
