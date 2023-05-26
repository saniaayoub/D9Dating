import {createStackNavigator} from '@react-navigation/stack';
import CreatePost from '../../../screens/App/CreatePost';
import Map from '../../../screens/Auth/Register/Map';
import {useEffect} from 'react';
import socket from '../../../utils/socket';
import {TouchableOpacity, Text} from 'react-native';
import {useToast} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import {moderateScale} from 'react-native-size-matters';

const Stack = createStackNavigator();

const CreatePostStack = () => {
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
                console.log('not logging');
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
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

export default CreatePostStack;
