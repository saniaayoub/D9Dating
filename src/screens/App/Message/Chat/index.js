import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moderateScale } from 'react-native-size-matters';
import s from './style';
import Entypo from 'react-native-vector-icons/Entypo';
import Inicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Input, FormControl, Button } from 'native-base';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage'
//  const socket = io('http://192.168.18.226');
//     socket.connect();

const messages = [
  {
    uid: 2,
    from: 'Julie Watson',
    to: '',
    date: '',
    text:
      ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/u2.png'),
  },
  {
    uid: 1,
    from: 'Julie Watson',
    to: '',
    date: '',
    text:
      ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/mydp.png'),
  },
  {
    uid: 2,
    from: 'Julie Watson',
    to: '',
    date: '',
    text:
      ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/u2.png'),
  },
  {
    uid: 1,
    from: 'Julie Watson',
    to: '',
    date: '',
    text:
      ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/mydp.png'),
  },
  {
    uid: 2,
    from: 'Julie Watson',
    to: '',
    date: '',
    text:
      ' Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/u2.png'),
  },
];

const elem = {
  from: 'Julie Watson',
  text: 'Welcome',
  time: 'Now',
  userImage: require('../../../../assets/images/png/u6.png'),
};

const Chat = ({ navigation, route }) => {
  const [msg, setMsg] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(
    // io('https://monily-chat-server.herokuapp.com'),
    // io('http://192.168.18.109:3000'),
    io('http://192.168.18.226:3000'),
  );
  const [value, setValue] = useState([])

  const getValueFunction = () => {
    // Function to get the value from AsyncStorage
    AsyncStorage.getItem('users').then(
      (value) =>
        console.log(value, 'users'),
        setValue(value),
      // Setting the value in Text
    );
  };

  useEffect(() => {
    getValueFunction()
  }, [])


  const dispatch = useDispatch();
  console.log(route.params);
  const data = route?.params;
  const [text, setText] = useState([]);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const uid = route.params.id;
  const name = data.from
  console.log(uid, 'id');


  useEffect(() => {
    socket.on('receive message', (message) => {
      console.log(message,'recieve')
      setText((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const sendMessage = () => {
    if (input.trim() === '') return;
    socket.emit('send message', JSON.stringify({
      text: input,
      to: uid,
      from: {
        id: socket.id,
        name: name,
      },
      avatar: 'https://placeimg.com/140/140/people',
      time: new Date()
    }));
    setMsg((prevMessages) => [...prevMessages, {
      text: input,
      to: uid,
      from: {
        id: socket.id,
        name: name,
      },
      avatar: 'https://placeimg.com/140/140/people',
      time: new Date()
    }]);
    setInput('');
  };

  const RenderItem = () => {
    return (
      <View style={s.card}>
        <View style={s.dp}>
          <Image source={data?.userImage} style={s.dp1} resizeMode={'cover'} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={[s.col, { flex: 0.6, justifyContent: 'flex-end' }]}
        >
          <View>
            <Text style={[s.name, s.nameBold, { color: textColor }]}>
              {data?.from}
            </Text>
          </View>
          <Text style={s.textSmall}>{elem?.item?.text}</Text>
        </TouchableOpacity>
        <View style={s.time}>
          <Text style={[s.textRegular, { color: textColor }]}>
            {elem?.item?.time}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ display: 'flex', flex: 1, backgroundColor: color }}>
      <View style={[s.container, { backgroundColor: color }]}>
        <View style={s.header}>
          <TouchableOpacity
            style={{ flex: 0.1 }}
            onPress={() => navigation.goBack()}
          >
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
              style={s.dp}
            >
              <Image
                source={messages[0].userImage}
                style={s.dp1}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ViewUser')}>
              <Text style={[s.name, { color: textColor }]}>
                {messages[0].from}
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
        <ScrollView contentContainerStyle={[s.chatContainer]}>
          {msg.map((elem, i) => {
            console.log(elem);
            if (elem?.to === uid) {
              return (
                <View style={s.messege} key={i}>
                  <View
                    style={[
                      s.text,
                      {
                        flex: 0.8,
                        backgroundColor: '#333232',
                        marginRight: moderateScale(10, 0.1),
                      },
                    ]}
                  >
                    <Text style={s.userName}>
                      <Text style={s.textSmall1}>{elem?.text}</Text>
                    </Text>
                  </View>
                  <View style={[s.dp, {flex: 0.2}]}>
                    <Image
                      source={{uri: elem?.avatar}}
                      style={s.dp1}
                      resizeMode={'cover'}
                    />
                  </View>
                </View>
              );
            } else {
              return (
                <View style={s.messege} key={i}>
                  <View style={[s.dp, {flex: 0.2}]}>
                    <Image
                      source={{uri: "https://placeimg.com/140/140/people","time":"2023-02-16T08:42:26.792Z" }}
                      style={s.dp1}
                      resizeMode={'cover'}
                    />
                  </View>
                  <View style={[s.text, {flex: 0.8}]}>
                    <Text style={s.userName}>
                      <Text style={s.textSmall1}>{text}</Text>
                    </Text>
                  </View>
                </View>
              );
            }
          })}
        </ScrollView>
        {/* <ScrollView contentContainerStyle={[s.chatContainer]}>
          {msg.map((message, i) => (
             <View style={s.messege} key={i}>
              <View
                style={[
                  s.text,
                  {
                    flex: 0.8,
                    backgroundColor: '#333232',
                    marginRight: moderateScale(10, 0.1),
                  },
                ]}
              >
                <Text style={s.userName}>
                <Text style={s.textSmall1}>{message.text}</Text>
                </Text>
              
              </View>
              <View
                style={[
                  s.text,
                  {
                    flex: 0.8,
                    backgroundColor: '#333232',
                    marginRight: moderateScale(10, 0.1),
                  },
                ]}
              >
                <Text style={s.userName}>
                <Text style={s.textSmall1}>{text}</Text>
                </Text>
              
              </View>


            </View>
           
          ))}
        </ScrollView> */}
      </View>
      <View style={s.row}>
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
              w={'80%'}
              variant="unstyled"
              placeholderTextColor={'#fff'}
              color={'#fff'}
              placeholder="Type Message"
              onChangeText={(text) => setInput(text)}
              size="md"
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
          <TouchableOpacity onPress={() => sendMessage()}
            style={s.circle}>
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
