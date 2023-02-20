import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  FlatList
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import Entypo from 'react-native-vector-icons/Entypo';
import Inicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Input, FormControl, Button} from 'native-base';
import io from 'socket.io-client';

const messages = [
  {
    uid: 2,
    from: 'Julie Watson',
    to: '',
    date: '',
    text:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    userImage: require('../../../../assets/images/png/u2.png'),
  },
  {
    uid: 1,
    from: 'Julie Watson',
    to: '',
    date: '',
    text: 'Lorem ipsum',
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
    io('http://192.168.18.226:3000'),
  );


  const dispatch = useDispatch();
  console.log(route.params);
  const data = route?.params;
  const [text, setText] = useState(null);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const uid = route.params.id;
  const name = data.from
  console.log(uid, 'id');
  const senderId = Math.floor(Math.random() * 100)
  console.log(senderId)

  useEffect(() => {
   getValueFunction()
  }, [])
  

  const idd = route.params.id
  console.log(idd, 'idd');
  useEffect(() => {
    console.log('msg?');
    socket.on('receive message', (message) => {
      console.log(message, 'recieve')
      setText((prevMessages) => [...prevMessages, message]);
    });
    socket.on("show_notification", function (data) {
      console.log("show_notification", data);
    });
  }, []);

  const sendMessage = () => {
    if (input.trim() === '') return;
    socket.emit('send message', JSON.stringify({
      text: input,
      to: uid,
      from: senderId,
      avatar: 'https://placeimg.com/140/140/people',
      time: new Date()
    }));
    setMsg((prevMessages) => [...prevMessages, {
      text: input,
      to: uid,
      from: {
        id: 182,
        name: name,
      },
       avatar: 'https://placeimg.com/140/140/people',
      time: new Date()
    }]);
    setInput('');
  };
  const getValueFunction = async () => {
    // Function to get the value from AsyncStorage
    let user = await AsyncStorage.getItem('users');  
    console.log(user,'iddd');

  };

  const renderItem = elem => {
    console.log(elem);
    if (elem?.item.to === uid) {
      return (
        <View
          style={[s.messege, {justifyContent: 'flex-end'}]}
          key={elem.index}
        >
          <View
            style={[
              {
                maxWidth: '80%',
                marginRight: moderateScale(10, 0.1),
              },
            ]}
          >
            <View style={s.textFrom}>
              <Text style={s.textSmall1}>{elem.item.text}</Text>
              <Text style={[s.textSmall1, {textAlign: 'right'}]}>
                {elem.item.time.toLocaleString([], {hour: '2-digit', minute:'2-digit',})}
              </Text>
            </View>
          </View>
          <View style={[s.dp]}>
            <Image
              source={{uri: elem.item.avatar}}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[s.messege, {justifyContent: 'flex-start'}]}
          key={elem.index}
        >
          <View style={[s.dp]}>
            <Image
              source={{uri: elem.item.avatar}}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
          <View
            style={[
              {
                maxWidth: '80%',
                marginRight: moderateScale(10, 0.1),
              },
            ]}
          >
            <View style={s.textTo}>
              <Text style={s.textSmall1}>{elem.item.text}</Text>
              <Text style={[s.textSmall1, {textAlign: 'right'}]}>
              {elem.item.time.toLocaleString([], {hour: '2-digit', minute:'2-digit',})}
              </Text>
            </View>
          </View>
        </View>
      );
    }
  };

  // const renderItem = elem => {
  //   console.log(elem);
  //   if (elem?.item.uid === uid) {
  //     return (
  //       <View
  //         style={[s.messege, {justifyContent: 'flex-end'}]}
  //         key={elem.index}
  //       >
  //         <View
  //           style={[
  //             {
  //               maxWidth: '80%',
  //               marginRight: moderateScale(10, 0.1),
  //             },
  //           ]}
  //         >
  //           <View style={s.textFrom}>
  //             <Text style={s.textSmall1}>{elem.item.text}</Text>
  //             <Text style={[s.textSmall1, {textAlign: 'right'}]}>
  //               {'12:13 PM'}
  //             </Text>
  //           </View>
  //         </View>
  //         <View style={[s.dp]}>
  //           <Image
  //             source={elem?.item.userImage}
  //             style={s.dp1}
  //             resizeMode={'cover'}
  //           />
  //         </View>
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View
  //         style={[s.messege, {justifyContent: 'flex-start'}]}
  //         key={elem.index}
  //       >
  //         <View style={[s.dp]}>
  //           <Image
  //             source={elem?.item.userImage}
  //             style={s.dp1}
  //             resizeMode={'cover'}
  //           />
  //         </View>
  //         <View
  //           style={[
  //             {
  //               maxWidth: '80%',
  //               marginRight: moderateScale(10, 0.1),
  //             },
  //           ]}
  //         >
  //           <View style={s.textTo}>
  //             <Text style={s.textSmall1}>{elem.item.text}</Text>
  //             <Text style={[s.textSmall1, {textAlign: 'right'}]}>
  //               {'12:13 PM'}
  //             </Text>
  //           </View>
  //         </View>
  //       </View>
  //     );
  //   }
  // };
  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      <View style={[s.container, {backgroundColor: color}]}>
        <View style={[s.header]}>
          <TouchableOpacity
            style={{flex: 0.1}}
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
              <Text style={[s.name, {color: textColor}]}>
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
        <View style={{height: '80%', paddingBottom: moderateScale(15, 0.1)}}>
            <FlatList
              data={msg}
              renderItem={renderItem}
              keyExtractor={item => item.to}
              // initialScrollIndex={messages.length - 1}
              showsVerticalScrollIndicator={true}
            />
          </View>
        {/* <ScrollView contentContainerStyle={[s.chatContainer]}>
          {msg.map((elem, i) => {
            console.log(elem);
            if (elem?.uid === uid) {
              return (
                <View style={[s.messege, {justifyContent: 'flex-end'}]} key={i}>
                  <View
                    style={[
                      {
                        maxWidth: '80%',
                        marginRight: moderateScale(10, 0.1),
                      },
                    ]}
                  >
                    <View style={s.textFrom}>
                      <Text style={s.textSmall1}>{elem?.text}</Text>
                      <Text style={[s.textSmall1, {textAlign: 'right'}]}>
                        {'12:13 PM'}
                      </Text>
                    </View>
                  </View>
<<<<<<< HEAD
                  <View style={[s.dp, { flex: 0.2 }]}>
                    <Image
                      source={{ uri: elem?.avatar }}
=======
                  <View style={[s.dp]}>
                    <Image
                      source={elem?.userImage}
>>>>>>> f83e39565f44816a0c68ee9567bfde74af64988b
                      style={s.dp1}
                      resizeMode={'cover'}
                    />
                  </View>
                </View>
              );
            } else {
<<<<<<< HEAD
                return (
               
                  <View style={s.messege} key={i}>
                    <View style={[s.dp, { flex: 0.2 }]}>
                      <Image
                        source={{ uri: "https://placeimg.com/140/140/people"}}
                        style={s.dp1}
                        resizeMode={'cover'}
                      />
                    </View>
                    <View style={[s.text, { flex: 0.8 }]}>
                      <Text style={s.userName}>
                        <Text style={s.textSmall1}>{text}</Text>
                      </Text>
                    </View>
                  </View>
                );
            
             
            }
          })}
        </ScrollView> */}
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
=======
              return (
                <View
                  style={[s.messege, {justifyContent: 'flex-start'}]}
                  key={i}
                >
                  <View style={[s.dp]}>
                    <Image
                      source={elem?.userImage}
                      style={s.dp1}
                      resizeMode={'cover'}
                    />
                  </View>
                  <View
                    style={[
                      {
                        maxWidth: '80%',
                        marginRight: moderateScale(10, 0.1),
                      },
                    ]}
                  >
                    <View style={s.textTo}>
                      <Text style={s.textSmall1}>{elem?.text}</Text>
                      <Text style={[s.textSmall1, {textAlign: 'right'}]}>
                        {'12:13 PM'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }
          })}
>>>>>>> f83e39565f44816a0c68ee9567bfde74af64988b
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
<<<<<<< HEAD
              value={input}
              onChangeText={(text) => setInput(text)}
=======
              onChangeText={v => setText(v)}
>>>>>>> f83e39565f44816a0c68ee9567bfde74af64988b
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
          <TouchableOpacity style={s.circle}>
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
