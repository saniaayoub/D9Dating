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
// const {v4: uuidv4} = require('uuid');
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
import {addSocketUsers} from '../../../../Redux/actions';

const Chat = ({navigation, route}) => {
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.reducer.userToken);
  const organizations = useSelector(state => state.reducer.organization);

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState('');
  const [userId, setUserId] = useState('');
  const [refresh, setRefresh] = useState(true);
  const [online, setOnline] = useState(true);
  const [lastSeen, setLastSeen] = useState('');
  const users = useSelector(state => state.reducer.users);
  const socketUsers = useSelector(state => state.reducer.socketUsers);
  const [loader, setLoader] = useState(false);
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState('');
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const {backendUser, socketUser} = route.params;

  useEffect(() => {
    getMessages();
    getData();
  }, []);

  useEffect(() => {
    // getValueFunction();
    socket.on('private_message', ({content, from, time}) => {
      console.log(content, 'recieve');
      console.log('');
      if (from === socketUser?.userID) {
        console.log('from', from, 'useriD', socketUser.userID, chatMessages);
        setChatMessages(chatMessages => [
          {
            user_id: backendUser?.id,
            reciever_id: userData?.id,
            message: content,
            fromSelf: false,
            time: time,
          },
          ...chatMessages,
        ]);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on('on_disconnect', users => {
      socketUsers.forEach(user => {
        user.self = user.userID === socket.id;
      });
      console.log(users, 'client');
      dispatch(addSocketUsers(users));
      setOnlineStatus(users);
    });
  }, [socket]);

  const setOnlineStatus = susers => {
    susers.forEach(elem => {
      if (elem.userID == socketUser.userID) {
        setOnline(true);
        console.log('foundsdsd');
      } else {
        setOnline(false);
        const hour =
          new Date().getHours() < 10
            ? `0${new Date().getHours()}`
            : `${new Date().getHours()}`;

        const mins =
          new Date().getMinutes() < 10
            ? `0${new Date().getMinutes()}`
            : `${new Date().getMinutes()}`;
        setLastSeen(`${hour}:${mins}`);
      }
    });
  };

  const getMessages = async () => {
    await axiosconfig
      .get(`message_show/${backendUser?.id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('message show API', res.data);
        setChatMessages(res?.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err, 'message show API err');
      });
  };

  const getColor = id => {
    let color;
    organizations?.forEach(elem => {
      if (elem.id == id) {
        color = elem.color;
      }
    });
    return color;
  };

  const getData = async () => {
    const data = await AsyncStorage.getItem('userData');
    setUserData(JSON.parse(data));
    console.log(userData);
  };

  const handleNewMessage = () => {
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

    if (socketUser) {
      socket.emit('private_message', {
        content,
        to: socketUser.userID,
        timestamp: {hour, mins},
      });
      setChatMessages([
        {
          user_id: userData?.id,
          reciever_id: backendUser?.id,
          message,
          fromSelf: true,
          time: `${hour}:${mins}`,
        },
        ...chatMessages,
      ]);
      storeMsg({
        id: backendUser.id,
        message: message,
        fromSelf: true,
        time: `${hour}:${mins}`,
      });
      console.log('sent', {
        id: backendUser.id,
        message: message,
        fromSelf: true,
        time: `${hour}:${mins}`,
      });
      setMessage('');
    }

    // console.log({
    //   message,
    //   user,
    //   timestamp: {hour, mins},
    // });
    // socket.emit('newMessage', {
    //   message,
    //   room_id: id,
    //   user,
    //   timestamp: {hour, mins},
    // });
    // setMessage('');
    // socket.on('foundRoom', roomChats => setChatMessages(roomChats));
  };

  const storeMsg = async msg => {
    await axiosconfig
      .post(`message_store`, msg, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then(res => {
        console.log('message send', res.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
      });
  };

  const msgDlt = async () => {
    await axiosconfig
      .delete(`message_delete/${route.params.id}`, {
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
    console.log('chat dlt');
    await axiosconfig
      .delete(`clear_chat/${route.params.id}`, {
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
  const sendMessage = () => {
    socket.emit('chat message');
  };
  const renderItem = elem => {
    const status = elem?.item?.user_id === userData.id;

    return (
      <View
        style={[
          s.message,
          {justifyContent: status ? 'flex-end' : 'flex-start'},
        ]}
        key={elem.index}>
        {!status ? (
          <View
            style={[
              s.dp,
              {
                borderColor: getColor(
                  !status ? backendUser?.group : userData?.group,
                ),
              },
            ]}>
            <Image
              source={{
                uri: !status ? backendUser?.image : userData?.image,
              }}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
        ) : null}
        <View
          style={[
            {
              maxWidth: '80%',
              marginLeft: !status ? moderateScale(20, 0.1) : 0,
              marginRight: !status ? 0 : moderateScale(5, 0.1),
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
          <View
            style={[
              s.dp,
              {
                borderColor: getColor(
                  !status ? backendUser?.group : userData?.group,
                ),
              },
            ]}>
            <Image
              source={{
                uri: !status ? backendUser?.image : userData?.image,
              }}
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
              style={[
                s.dp,
                {
                  marginHorizontal: moderateScale(10, 0.1),
                  borderColor: getColor(backendUser?.group),
                },
              ]}>
              <Image
                source={{
                  uri: backendUser?.image,
                }}
                style={s.dp1}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ViewUser')}>
              <Text style={[s.name, {color: textColor}]}>
                {backendUser?.name + ' ' + backendUser?.last_name}
              </Text>
              <Text style={[s.name, {color: textColor}]}>
                {online == true ? 'online' : `Last seen ${lastSeen}`}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[s.options]}>
            <Menu
              w="130"
              borderWidth={moderateScale(1, 0.1)}
              borderColor={'grey'}
              backgroundColor={color}
              marginLeft={moderateScale(9, 0.1)}
              marginTop={moderateScale(25, 0.1)}
              closeOnSelect={true}
              trigger={triggerProps => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                    style={
                      {
                        // flexDirection: 'row',
                        // right: moderateScale(8, 0.1),
                      }
                    }>
                    <Entypo
                      name={'dots-three-vertical'}
                      color={textColor}
                      size={moderateScale(15, 0.1)}
                    />
                  </Pressable>
                );
              }}>
              <Menu.Item
                onPress={() => {
                  chatDlt();
                }}>
                <View style={s.optionView}>
                  <Text style={[s.optionBtns, {color: textColor}]}>
                    clear chat
                  </Text>
                </View>
              </Menu.Item>
              <Menu.Item
                onPress={() => {
                  // hide(elem?.item?.id);
                }}>
                <View style={s.optionView}>
                  <Text style={[s.optionBtns, {color: textColor}]}>Hide</Text>
                </View>
              </Menu.Item>
            </Menu>
          </View>
          {/* <TouchableOpacity style={s.options}>
            <Entypo
              name={'dots-three-vertical'}
              color={textColor}
              size={moderateScale(15, 0.1)}
            />
          </TouchableOpacity> */}
        </View>
        <View style={s.chat}>
          <FlatList
            inverted
            data={chatMessages}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
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
