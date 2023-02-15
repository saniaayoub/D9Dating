import {createStackNavigator} from '@react-navigation/stack';
import Profile from '../../../screens/App/User';
import Help from '../../../screens/App/User/Help';
import Settings from '../../../screens/App/User/Settings';
import Privacy from '../../../screens/App/User/Privacy';
import Resetpass from '../../../screens/App/User/ResetPass';
import About from '../../../screens/App/User/About/About';
const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Privacy" component={Privacy} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="ResetPass" component={Resetpass} />
      <Stack.Screen name="About" component={About} />



    </Stack.Navigator>
  );
};

export default ProfileStack;
