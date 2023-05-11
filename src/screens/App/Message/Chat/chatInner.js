import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  FlatList,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import Entypo from 'react-native-vector-icons/Entypo';
import Inicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Input, FormControl, Button, Menu, Pressable} from 'native-base';
import socket from '../../../../utils/socket';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Antdesign from 'react-native-vector-icons/AntDesign';
import axiosconfig from '../../../../Providers/axios';
import Loader from '../../../../Components/Loader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Chat = ({navigation, route}) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const [refresh, setRefresh] = useState(true);
  const users = useSelector(state => state.reducer.users);
  const [loader, setLoader] = useState(false);
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState('');
  const userToken = useSelector(state => state.reducer.userToken);

  console.log('route data', route?.params);
  const dispatch = useDispatch();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const {username, userID} = route.params;
  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.error('Error while loading username!');
    }
  };
  const handleNewMessage = async () => {
    console.log('abc');
    storeMsg();
    Keyboard.dismiss();
    const hour =
      new Date().getHours() < 10
        ? `0${new Date().getHours()}`
        : `${new Date().getHours()}`;

    const mins =
      new Date().getMinutes() < 10
        ? `0${new Date().getMinutes()}`
        : `${new Date().getMinutes()}`;
    let content = message;
    console.log('====================================');
    console.log(route.params,'hellorutetdata');
    console.log('====================================');
    if (route.params.user_id) {
      socket.emit('private_message', {
        content,
        to: 19,
        timestamp: {hour, mins},
      });
      // setChatMessages([
      //   {
      //     message,
      //     fromSelf: true,
      //     time: `${hour}:${mins}`,
      //     to: userID,
      //   },
      //   ...chatMessages,
      // ]);
      console.log('sent', {
        message,
        fromSelf: true,
        to: userID,
      });
      setMessage('');
    }
  };

  useEffect(() => {
    // getValueFunction();
    socket.on('private_message', ({content, from, time}) => {
      console.log(content, 'receiver_id');
      console.log('');
      console.log('from', from, 'useriD', userID, chatMessages);
      if (from === userID) {
        setChatMessages(chatMessages => [
          {
            message: content,
            fromSelf: false,
            time: time,
            from: from,
          },
          ...chatMessages,
        ]);
        // storeMsg();
      }
    });
  }, []);
  const storeMsg = async () => {
    var data = {
      text: message,
      id: route.params.id,
    };
    await axiosconfig
      .post(`message_store`, data, {
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
      });
  };
  const msgDlt = async () => {
    await axiosconfig
      .get(`message_show/${route.params.id}`, {
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
      });
  };
  const chatDlt = async () => {
    await axiosconfig
      .get(`clear_chat/${route.params.id}`, {
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
      });
  };

  //   const idd = route.params.id;
  //   console.log(idd, 'idd');
  // useEffect(() => {
  //   socket.emit('findRoom', id);
  //   socket.on('foundRoom', roomChats => setChatMessages(roomChats));
  // }, [socket]);

  //   const sendMessage = () => {
  //     if (input.trim() === '') return;
  //     socket.emit(
  //       'send message',
  //       JSON.stringify({
  //         text: input,
  //         to: uid,
  //         from: senderId,
  //         avatar: 'https://placeimg.com/140/140/people',
  //         time: new Date(),
  //       }),
  //     );
  //     setMsg(prevMessages => [
  //       ...prevMessages,
  //       {
  //         text: input,
  //         to: uid,
  //         from: {
  //           id: 182,
  //           name: name,
  //         },
  //         avatar: 'https://placeimg.com/140/140/people',
  //         time: new Date(),
  //       },
  //     ]);
  //     setInput('');
  //   };
  //   const getValueFunction = async () => {
  //     // Function to get the value from AsyncStorage
  //     let user = await AsyncStorage.getItem('users');
  //     console.log(user, 'iddd');
  //   };

  const sendMessage = () => {
    socket.emit('chat message');
  };
  const renderItem = elem => {
    const status = elem?.item?.fromSelf;

    return (
      <View
        style={[
          s.messege,
          {justifyContent: status ? 'flex-end' : 'flex-start'},
        ]}
        key={elem.index}>
        {!status ? (
          <View style={[s.dp]}>
            <Image
            source={{
              uri:!status ? route?.params?.users_invers.userImage : route?.params?.users_invers.userImage}}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
        ) : null}
        <View
          style={[
            {
              maxWidth: '80%',
              marginRight: moderateScale(10, 0.1),
            },
          ]}>
          <View style={[s.options]}>
            <Menu
              w="150"
              borderWidth={moderateScale(1, 0.1)}
              borderColor={'grey'}
              backgroundColor={color}
              marginRight={moderateScale(15, 0.1)}
              marginTop={moderateScale(25, 0.1)}
              closeOnSelect={true}
              trigger={triggerProps => {
                return (
                  <Pressable
                    // onLongPress={}
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                    style={{
                      flexDirection: 'row',
                      right: moderateScale(8, 0.1),
                    }}>
                    <View style={status ? s.textFrom : s.textTo}>
                      <Text style={s.textSmall1}>{elem?.item?.message}</Text>
                      <Text style={[s.textSmall1, {textAlign: 'right'}]}>
                        {/* time */}
                        {elem?.item?.time?.toLocaleString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </Pressable>
                );
              }}>
              <Menu.Item
                onPress={() => {
                  console.log('unsend');
                }}>
                <View style={s.optionView}>
                  <MaterialIcons
                    name={'cancel-schedule-send'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    // style={{marginRight: moderateScale(10, 0.1)}}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns, {color: textColor}]}>Unsend</Text>
                </View>
              </Menu.Item>
              <Menu.Item
                onPress={() => {
                  console.log('reply');
                }}>
                <View style={s.optionView}>
                  <MaterialIcons
                    name={'reply'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns, {color: textColor}]}>Reply</Text>
                </View>
              </Menu.Item>

              <Menu.Item
                onPress={() => {
                  console.log('delete');
                }}>
                <View style={s.optionView}>
                  <Antdesign
                    name={'delete'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns, {color: textColor}]}>Delete</Text>
                </View>
              </Menu.Item>

              <Menu.Item
                onPress={() => {
                  console.log('Block');
                }}>
                <View style={s.optionView}>
                  <MaterialIcons
                    name={'block'}
                    color="red"
                    size={moderateScale(13, 0.1)}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns]}>Block</Text>
                </View>
              </Menu.Item>
            </Menu>
          </View>
        </View>
        {status ? (
          <View style={[s.dp]}>
            <Image
              source={{
                uri:!status ? route?.params?.users_invers.userImage : route?.params?.users_invers.userImage}}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
        ) : null}
      </View>
    );
  };
  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      <View style={[s.container, {backgroundColor: color}]}>
        <View style={s.header}>
          <TouchableOpacity
            style={{flex: 0.1}}
            onPress={() => navigation.goBack()}>
            <Inicon
              name="arrow-back-circle-outline"
              size={moderateScale(30)}
              color={textColor}
            />
          </TouchableOpacity>
          <View style={s.card}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ViewUser');
              }}
              style={s.dp}>
              <Image
                source={{
                  uri:route?.params?.users_invers.image }}
                style={s.dp1}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ViewUser')}>
              <Text style={[s.name, {color: textColor}]}>
                {route?.params?.users_invers?.name + ' '}
                {route?.params?.users_invers?.last_name}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={s.options}>
            <Entypo
              name={'dots-three-vertical'}
              color={textColor}
              size={moderateScale(15, 0.1)}
            />
          </TouchableOpacity>
        </View>
        <View style={s.chat}>
          <FlatList
            inverted
            data={chatMessages}
            renderItem={renderItem}
            keyExtractor={item => item.to}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={false}
            showsVerticalScrollIndicator={true}
          />
        </View>
      </View>
      <View style={s.messageInput}>
        <View style={s.input}>
          <TouchableOpacity style={s.circle}>
            <Icon
              name={'smile'}
              color={'#8F8A8A'}
              solid
              size={moderateScale(20, 0.1)}
            />
          </TouchableOpacity>
          <View style={s.inputText}>
            <Input
              w={'100%'}
              variant="unstyled"
              placeholderTextColor={'#fff'}
              color={'#fff'}
              placeholder="Type Message"
              value={message}
              multiline
              flexWrap={'wrap'}
              maxHeight={60}
              onChangeText={text => setMessage(text)}
            />
          </View>

          <TouchableOpacity style={s.attach}>
            <Entypo
              name={'attachment'}
              color={'#8F8A8A'}
              size={moderateScale(20, 0.1)}
            />
          </TouchableOpacity>
        </View>
        <View style={s.sendBtn}>
          <TouchableOpacity onPress={() => handleNewMessage()} style={s.circle}>
            <Inicon
              name={'md-send'}
              color={'#8F8A8A'}
              size={moderateScale(20, 0.1)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
