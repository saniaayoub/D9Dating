import { View, Text } from 'react-native'
import React,{useState} from 'react'
import Loader from '../../../../Components/Loader';
import Header from '../../../../Components/Header/index';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';

const Block=({navigation})=> {
  const [loader, setLoader] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  return (
    <View style={{display: 'flex', flex: 1, backgroundColor: color}}>
         {loader ? <Loader /> : null}
      <Header navigation={navigation} />
      <Text>no blocked users</Text>
    </View>
  )
}
export default Block