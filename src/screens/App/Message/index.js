import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {setTheme} from '../../../Redux/actions';
import s from './style';
import Header from '../../../Components/Header';
import {FlatList} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const messages = [
  {
    id: 1,
    from: 'Julie Watson',
    text: 'Awesome',
    time: 'Now',
    userImage: require('../../../assets/images/png/mydp.png'),
  },
  {
    id: 2,
    from: 'John Smith',
    text: 'Sent a Voice Message',
    time: '10:00pm',
    userImage: require('../../../assets/images/png/u7.png'),
  },
  {
    id: 3,
    from: 'Julie Watson',
    text: 'Thanks a lot',
    time: 'Friday',
    userImage: require('../../../assets/images/png/u1.png'),
  },
  {
    id: 4,
    from: 'Julie Watson',
    text: 'Are You Busy',
    time: 'Monday',
    userImage: require('../../../assets/images/png/u2.png'),
  },
  {
    id: 5,
    from: 'John Smith',
    text: 'Nice',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u4.png'),
  },
  {
    id: 6,
    from: 'John Smith',
    text: 'Lunch Today',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u5.png'),
  },
  {
    id: 7,
    from: 'Julie Watson',
    text: 'Welcome',
    time: 'Now',
    userImage: require('../../../assets/images/png/u6.png'),
  },
  {
    id: 8,
    from: 'John Smith',
    text: 'Lunch Today',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u5.png'),
  },
  {
    id: 9,
    from: 'Julie Watson',
    text: 'Welcome',
    time: 'Now',
    userImage: require('../../../assets/images/png/u6.png'),
  },
];
const Message = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';

  const renderItem = (elem, i) => {
    return (
      <View style={s.card}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ViewUser');
          }}
          style={s.dp}
        >
          <Image
            source={elem.item.userImage}
            style={s.dp1}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', elem.item)}
          style={[s.col, {flex: 0.6, justifyContent: 'flex-end'}]}
        >
          <View>
            <Text style={[s.name, s.nameBold, {color: textColor}]}>
              {elem?.item?.from}
            </Text>
          </View>
          <Text style={[s.textSmall, {color: '#787878'}]}>
            {elem?.item?.text}
          </Text>
        </TouchableOpacity>
        <View style={s.time}>
          <Text style={[s.textRegular, {color: textColor}]}>
            {elem?.item?.time}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{display: 'flex', flex: 1}}>
      {/* <Header /> */}
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        <View>
          <Text style={[s.HeadingText, {color: textColor}]}>Messages</Text>
        </View>
        <View style={[s.border, {borderBottomColor: textColor}]}>
          <TouchableOpacity style={s.btn}>
            <Text style={[s.chats, {color: textColor}]}>Chats</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={s.btn}>
            <Text style={[s.chats, {color: textColor}]}>Stories</Text>
          </TouchableOpacity> */}
        </View>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(e, i) => i.toString()}
          scrollEnabled={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Message;
