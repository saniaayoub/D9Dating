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
  const userToken = useSelector(state => state.reducer.userToken);
  const [data, setData] = useState([])
  const block_list = async () => {
    setLoader(true);
    axiosconfig
      .get(`block-list`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('data', res.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err);
        // showToast(err.response);
      });
  };
  return (
    <View style={{display: 'flex', flex: 1, backgroundColor: color}}>
         {loader ? <Loader /> : null}
      <Header navigation={navigation} />
      <Text>no blocked users</Text>
    </View>
  )
}
export default Block