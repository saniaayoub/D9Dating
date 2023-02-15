import {TouchableOpacity, Text, SafeAreaView, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {setTheme} from '../../../Redux/actions';
import s from './style';
import Header from '../../../Components/Header';
import {FlatList} from 'react-native';
import {ScrollView} from 'react-native';
import Antdesign from 'react-native-vector-icons/AntDesign';

const messages = [
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../assets/images/png/mydp.png'),
    active: '4 Hours ago',
    icon: <Antdesign name="checkcircle" size={20} color="green" />,
    icon1: <Antdesign name="closecircle" size={20} color="red" />,
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: '10:00pm',
    userImage: require('../../../assets/images/png/u7.png'),
    active: 'Nov 10 At 2:01 AM',
    icon: <Antdesign name="checkcircle" size={20} color="green" />,
    icon1: <Antdesign name="closecircle" size={20} color="red" />,
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Friday',
    userImage: require('../../../assets/images/png/u1.png'),
    active: '4 Hours ago',
  },
  {
    from: 'Julie Watson',
    text: 'Like your photo',
    time: 'Monday',
    userImage: require('../../../assets/images/png/u2.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'John Smith',
    text: 'Who you might know is on profile',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u4.png'),
    active: '4 Hours ago',
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u5.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../assets/images/png/u6.png'),
    active: '4 Hours ago',
  },
  {
    from: 'John Smith',
    text: 'Like your photo',
    time: 'Last Week',
    userImage: require('../../../assets/images/png/u5.png'),
    active: 'Nov 10 At 2:01 AM',
  },
  {
    from: 'Julie Watson',
    text: 'Who you might know is on profile',
    time: 'Now',
    userImage: require('../../../assets/images/png/u6.png'),
    active: '4 Hours ago',
  },
];
const Notifications = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';

  useEffect(() => {}, []);

  const renderItem = (elem, i) => {
    return (
      <View style={s.card}>
        <View style={s.dp}>
          <Image
            source={elem.item.userImage}
            style={s.dp1}
            resizeMode={'cover'}
          />
        </View>
        <TouchableOpacity
          style={{flex: 0.7, alignSelf: 'center'}}
        >
          <View>
            <View style={{flexDirection: 'row', width: moderateScale(200,0.1)}}>
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.from}
              <Text style={[s.name1]}>{' '} {elem?.item?.text}</Text>

              </Text>

            </View>
            <Text style={[s.textSmall, {color: '#787878'}]}>
              {elem?.item?.active}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={s.icon}>
          <View
            style={{
              paddingHorizontal: moderateScale(6, 0.1),
               right: moderateScale(5),
            }}
          >
            {elem?.item?.icon}
          </View>
          <View
            style={{
              // left: moderateScale(3),
            }}
          >
            {elem?.item?.icon1}
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: color}}>
      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}
      >
        <View>
          <Text style={[s.HeadingText, {color: textColor}]}>Notifications</Text>
        </View>
        <View style={s.txtView}>
          <Text style={s.hTxt}>See New Activity</Text>
        </View>
        <View style={s.hView}>
          <Text style={s.hTxt1}>This Week</Text>
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

export default Notifications;
