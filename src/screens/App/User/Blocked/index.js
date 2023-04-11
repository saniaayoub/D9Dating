import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Loader from '../../../../Components/Loader';
import Header from '../../../../Components/Header/index';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import axiosconfig from '../../../../Providers/axios';
import s from './style';
import {useIsFocused} from '@react-navigation/native';

const Block = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const groups = useSelector(state => state.reducer.group);
  const userToken = useSelector(state => state.reducer.userToken);
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();
  const [dummyImage, setDummyImage] = useState(
    'https://designprosusa.com/the_night/storage/app/1678168286base64_image.png',
  );

  useEffect(() => {
    block_list();
  }, [isFocused]);

  const getColor = id => {
    let color;
    groups?.forEach(elem => {
      if (elem.id == id) {
        color = elem.color;
      }
    });
    return color;
  };

  const unblock = async id => {
    console.log('aaaa');
    setLoader(true);
    console.log(userToken, 'hgh');
    await axiosconfig
      .get(`block/${id}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('block', res);
        block_list();
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err, 'her');
        // showToast(err.response);
      });
  };
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
        setData(res?.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);

        console.log(err);
        // showToast(err.response);
      });
  };
  const renderItem = (elem, i) => {
    console.log(elem.item, 'a');
    return (
      <View style={s.card}>
        <View style={[s.dp, {borderColor: getColor(elem?.item?.group)}]}>
          <Image
            source={{
              uri: elem?.item?.image ? elem?.item?.image : dummyImage,
            }}
            style={s.dp1}
            resizeMode={'cover'}
          />
        </View>
        <TouchableOpacity style={{flex: 0.7, alignSelf: 'center'}}>
          <View>
            <View
              style={{flexDirection: 'row', width: moderateScale(200, 0.1)}}
            >
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.name}
                {elem?.item?.last_name}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => unblock(elem?.item?.id)} style={s.btn}>
          <View>
            <Text style={{color: '#222222'}}>Unblock</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 0.4}}>
          <Header navigation={navigation} />
        </View>
        <View style={{flex: 0.6, justifyContent: 'center'}}>
          <Text style={[s.HeadingText, {color: textColor}]}>Blocked</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        {/* <View>
          <Text style={[s.HeadingText, {color: textColor}]}>Blocked</Text>
        </View> */}
        {data.length > 0 ? (
          <>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(e, i) => i.toString()}
              scrollEnabled={true}
            />
          </>
        ) : (
          <>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{fontSize: moderateScale(16, 0.1), color: textColor}}
              >
                No blocked Users
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Block;
