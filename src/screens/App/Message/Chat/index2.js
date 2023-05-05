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

//  const socket = io('http://192.168.18.226');
//     socket.connect();

const messages = [
  {
    uid: 2,
    from: 'Julie Watson',
    to: '',
    date: '',
    text: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/u2.png'),
  },
  {
    uid: 1,
    from: 'Julie Watson',
    to: '',
    date: '',
    text: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/mydp.png'),
  },
  {
    uid: 2,
    from: 'Julie Watson',
    to: '',
    date: '',
    text: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/u2.png'),
  },
  {
    uid: 1,
    from: 'Julie Watson',
    to: '',
    date: '',
    text: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/mydp.png'),
  },
  {
    uid: 2,
    from: 'Julie Watson',
    to: '',
    date: '',
    text: ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/u2.png'),
  },
];

const userData = {
  from: 'Julie Watson',
  text: 'Welcome',
  time: 'Now',
  userImage: require('../../../../assets/images/png/u6.png'),
};

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

  //   const [socket, setSocket] = useState(io('http://192.168.18.226:3000'));

  const dispatch = useDispatch();

  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  //👇🏻 Access the chatroom's name and id
  const {username, userID} = route.params;
  // console.log(route.params, ' route.params');
  // useEffect(() => {
  //   console.log(chatMessages, 'chat'), [];
  // });

  //👇🏻 This function gets the username saved on AsyncStorage
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

  //👇🏻 Sets the header title to the name chatroom's name
  // useLayoutEffect(() => {
  //   // getUsername();
  //   // socket.emit('findRoom', id);
  //   // socket.on('foundRoom', roomChats => setChatMessages(roomChats));
  // }, []);

  /*👇🏻 
        This function gets the time the user sends a message, then 
        logs the username, message, and the timestamp to the console.
     */
  const handleNewMessage = async () => {
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
    if (userID) {
      socket.emit('private message', {
        content,
        to: userID,
        timestamp: {hour, mins},
      });
      setChatMessages([
        {
          message,
          fromSelf: true,
          time: `${hour}:${mins}`,
          to: userID,
        },
        ...chatMessages,
      ]);
      console.log('sent', {
        message,
        fromSelf: true,
        to: userID,
      });
      await axiosconfig
        .get(`message_store`, {
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
      setMessage('');

      // this.selectedUser.messages.push({
      //   content,
      //   fromSelf: true,
      // });
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

  useEffect(() => {
    // getValueFunction();
    socket.on('private message', ({content, from, time}) => {
      console.log(content, 'recieve');
      console.log('');
      if (from === userID) {
        console.log('from', from, 'useriD', userID, chatMessages);
        setChatMessages(chatMessages => [
          {
            message: content,
            fromSelf: false,
            time: time,
            from: from,
          },
          ...chatMessages,
        ]);
      }
      // for (let i = 0; i < users.length; i++) {
      //   const user = users[i];
      //   if (user.userID === from) {
      //     setChatMessages([
      //       ...chatMessages,
      //       {
      //         content,
      //         fromSelf: false,
      //       },
      //     ]);

      //     if (user.username !== username) {
      //       user.hasNewMessages = true;
      //     }
      //     break;
      //   }
      // }
    });
  }, []);

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
              source={!status ? userData.userImage : userData.userImage}
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
              source={!status ? userData?.userImage : userData?.userImage}
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
                  uri: route?.params?.image
                    ? route?.params?.image
                    : userData?.userImage,
                }}
                style={s.dp1}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ViewUser')}>
              <Text style={[s.name, {color: textColor}]}>
                {route?.params?.name}
                {route?.params?.last_name}
              </Text>

              <Text style={s.textSmall}>Last Seen 5:52 PM</Text>
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
            // contentContainerStyle={{flexDirection: 'column-reverse'}}
            // initialScrollIndex={messages.length - 1}
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
              // numberOfLines={4}
              onChangeText={text => setMessage(text)}
              // size="md"
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
