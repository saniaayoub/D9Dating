import {createStackNavigator} from '@react-navigation/stack';
import Home from '../../../screens/App/Home';
import ViewUser from '../../../screens/App/Home/ViewUser/index';
import FunInteraction from '../../../screens/App/Home/FunInteraction';
import Test from '../../../screens/App/Home/Test';
import Comments from '../../../screens/App/Home/Comments';
import CreatePost from '../../../screens/App/CreatePost';
import Map from '../../../screens/Auth/Register/Map';
import Likes from '../../../screens/App/Home/Likes';
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewUser" component={ViewUser} />
      <Stack.Screen name="FunInteraction" component={FunInteraction} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="Likes" component={Likes} />
      <Stack.Screen name="Test" component={Test} />
      <Stack.Screen name="createPost" component={CreatePost} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
};

export default HomeStack;
