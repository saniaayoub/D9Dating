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
import {moderateScale} from 'react-native-size-matters';
import {
  setTheme,
  addUsers,
  addSocketUsers,
  setUserData,
} from '../../../Redux/actions';
import s from './style';
import Header from '../../../Components/Header';
import {FlatList} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native';
import Loader from '../../../Components/Loader';
import socket from '../../../utils/socket';
import UserListModal from '../../../Components/userListModal';
import axiosconfig from '../../../Providers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const Message = ({navigation}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const userToken = useSelector(state => state.reducer.userToken);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const users = useSelector(state => state.reducer.users);
  const socketUsers = useSelector(state => state.reducer.socketUsers);
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState('');

  useEffect(() => {
    userslist();
    latestMsg();
  }, [isFocused]);

  useEffect(() => {
    socket.on('users', users => {
      users.forEach(user => {
        user.self = user.userID === socket.id;
      });
      // console.log(users, 'client');
      dispatch(addSocketUsers(users));
    });
  }, []);

  const userslist = async () => {
    // console.log('userList');
    setLoader(true);
    await axiosconfig
      .get(`connected_users`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        // console.log('messenger list', res.data.friends);
        dispatch(addUsers(res.data.friends));
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        // console.log(err);
      });
  };

  const latestMsg = async () => {
    await axiosconfig
      .get(`message_index`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        // console.log('getrooms', res.data);
        // checkSameUser(res.data);
        // const data = checkSameUser(res.data);
        setRooms(res.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        // console.log(err);
      });
  };
  function checkSameUser(arr) {
    const result = [];
    const uniqueIds = new Set();
    for (const obj of arr) {
      if (!uniqueIds.has(obj.user_id)) {
        result.push(obj);
        uniqueIds.add(obj.user_id);
      }
    }
    return result;
  }
  function formatTimestamp(timestamp) {
    const now = moment();
    const date = moment(timestamp);
    if (now.isSame(date, 'day')) {
      return date.format('h:mm A');
    } else {
      return date.format('DD/mm/yyyy');
    }
  }

  const searchUserOnSocket = userData => {
    // console.log(userData, 'aoxjw');
    let temp = {backendUser: userData, socketUser: {}};
    setUser({backendUser: userData, socketUser: {}});
    socketUsers.forEach(elem => {
      if (elem?.username == userData?.email) {
        // console.log('found');
        temp = {backendUser: userData, socketUser: elem};
        setUser({backendUser: userData, socketUser: elem});
      }
    });
    handleCreateRoom(temp);
  };

  const handleCreateRoom = user => {
    // console.log(user, 'handle');
    navigation.navigate('Chat', user);
    setModalVisible(false);
  };

  const renderItem = (elem, i) => {
    return (
      <View style={s.card}>
        <TouchableOpacity
          onPress={() => {
            // navigation.navigate('ViewUser');
          }}
          style={s.dp}>
          <Image
            source={{
              uri: elem.item?.image,
            }}
            style={s.dp1}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // console.log(elem.item, 'sceee');
            searchUserOnSocket(elem?.item);
          }}
          style={[s.col, {flex: 0.6, justifyContent: 'flex-end'}]}>
          <View>
            <Text style={[s.name, s.nameBold, {color: textColor}]}>
              {elem?.item?.name}
            </Text>
          </View>
          <Text style={[s.textSmall, {color: '#787878'}]}>
            {
              elem?.item?.user_messages[elem?.item?.user_messages.length - 1]
                ?.message
            }
          </Text>
        </TouchableOpacity>
        <View style={s.time}>
          <Text style={[s.textRegular, {color: textColor}]}>
            {formatTimestamp(
              elem?.item?.user_messages[elem?.item?.user_messages.length - 1]
                ?.created_at,
            )}
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
            contentContainerStyle={[s.container, {backgroundColor: color}]}>
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
                }}>
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
              inverted
            />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default Message;
