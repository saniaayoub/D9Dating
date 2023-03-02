import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addUsers} from '../../../Redux/actions';
import {moderateScale} from 'react-native-size-matters';
import {setTheme} from '../../../Redux/actions';
import s from './style';
import Header from '../../../Components/Header';
import {FlatList} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native';

import socket from '../../../utils/socket';
import UserListModal from '../../../Components/userListModal';

const rooms = [
  {
    id: '1',
    name: 'Julie Watson',
    userImage: require('../../../assets/images/png/mydp.png'),
    messages: [
      {
        id: '1a',
        text: 'Hello guys, welcome!',
        time: '07:50',
        user: 'Julie Watson',
      },
      {
        id: '1b',
        text: 'Hi Tomer, thank you! 😇',
        time: '08:50',
        user: 'Emily',
      },
    ],
  },
  {
    id: '2',
    name: 'John Smith',
    userImage: require('../../../assets/images/png/u7.png'),
    messages: [
      {
        id: '2a',
        text: "Guys, who's awake? 🙏🏽",
        time: '12:50',
        user: 'John Smith',
      },
      {
        id: '2b',
        text: "What's up? 🧑🏻‍💻",
        time: '03:50',
        user: 'Emily',
      },
    ],
  },
];

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
  const users = useSelector(state => state.reducer.users);
  const [modalVisible, setModalVisible] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on('roomsList', rooms => {
      setRooms(rooms);
      console.log(rooms);
    });
  }, []);

  useLayoutEffect(() => {
    function fetchGroups() {
      fetch('http://localhost:3000/api')
        .then(res => console.error(res, 'here1'))
        .then(data => setRooms(data))
        .catch(err => console.error(err, 'here'));
    }
    fetchGroups();
  }, []);
  // const filterUser = () => {
  //   let temp;
  //   temp = users.filter(user => user.self === false);
  //   console.log(temp, 'temp1');
  //   temp = temp.map(user => {
  //     if (user.self === false) {
  //       console.log(11);
  //       return {
  //         ...user,
  //         text: 'Welcome',
  //         time: 'Now',
  //         userImage: require('../../../assets/images/png/u6.png'),
  //       };
  //     }
  //   });
  //   console.log(temp, 'temp');
  //   dispatch(addUsers(temp));
  // };
  const handleCreateRoom = user => {
    console.log(user.from);
    // let checkExist = rooms.map(elem => {
    //   if (elem.name === user.from) {
    //     return true;
    //   }
    // });
    // console.log(checkExist);
    socket.emit('createRoom', user.from);
    setModalVisible(!modalVisible);
  };
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
              {elem?.item?.name}
            </Text>
          </View>
          <Text style={[s.textSmall, {color: '#787878'}]}>
            {elem?.item?.messages[0]?.text}
          </Text>
        </TouchableOpacity>
        <View style={s.time}>
          <Text style={[s.textRegular, {color: textColor}]}>
            {elem?.item?.messages[0]?.time}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {/* <Header /> */}
      {modalVisible ? (
        <UserListModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          navigation={navigation}
          handleCreateRoom={handleCreateRoom}
        />
      ) : (
        <>
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
              <TouchableOpacity
                style={s.btn}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Entypo
                  name={'new-message'}
                  color={textColor}
                  size={moderateScale(20, 0.1)}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={rooms}
              renderItem={renderItem}
              keyExtractor={(e, i) => i.toString()}
              scrollEnabled={true}
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Message;
