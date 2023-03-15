import {createStackNavigator} from '@react-navigation/stack';
import Home from '../../../screens/App/Home';
import ViewUser from '../../../screens/App/Home/ViewUser/index';
import FunInteraction from '../../../screens/App/Home/FunInteraction';
import Test from '../../../screens/App/Home/Test';
import Comments from '../../../screens/App/Home/Comments';
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewUser" component={ViewUser} />
      <Stack.Screen name="FunInteraction" component={FunInteraction} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
  );
};

export default HomeStack;
