import {createStackNavigator} from '@react-navigation/stack';
import ForgetPassword from '../../../screens/Auth/ForgetPass';
import Login from '../../../screens/Auth/Login';
import Register from '../../../screens/Auth/Register';
import StartScreen from '../../../screens/Auth/Start';
import ChangePass from '../..//../screens/Auth/ChangePass';
import GooglePlacesInput from '../../../screens/Auth/Register/Map';
import Map1 from '../../../screens/Auth/Register/Map1';


const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ChangePass" component={ChangePass} />
      <Stack.Screen name="Maps" component={GooglePlacesInput} />
      <Stack.Screen name="Map1" component={Map1} />



    </Stack.Navigator>
  );
};

export default AuthStack;
