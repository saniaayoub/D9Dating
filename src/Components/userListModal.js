import {Input} from 'native-base';
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import Inicon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addSocketUsers, addUsers} from '../Redux/actions';
const Poppins = '';
const PoppinsBold = '';
const Users = [
  {
    id: 1,
    from: 'Julie Watson',
    text: 'Awesome',
    time: 'Now',
    userImage: require('../assets/images/png/mydp.png'),
  },
  {
    id: 2,
    from: 'John Smith',
    text: 'Sent a Voice Message',
    time: '10:00pm',
    userImage: require('../assets/images/png/u7.png'),
  },
  {
    id: 3,
    from: 'Ema Watson',
    text: 'Thanks a lot',
    time: 'Friday',
    userImage: require('../assets/images/png/u1.png'),
  },
  {
    id: 4,
    from: 'Emily',
    text: 'Are You Busy',
    time: 'Monday',
    userImage: require('../assets/images/png/u2.png'),
  },
  {
    id: 5,
    from: 'Hoju',
    text: 'Nice',
    time: 'Last Week',
    userImage: require('../assets/images/png/u4.png'),
  },
  {
    id: 6,
    from: 'Bran derin',
    text: 'Lunch Today',
    time: 'Last Week',
    userImage: require('../assets/images/png/u5.png'),
  },
  {
    id: 7,
    from: 'John Shaw',
    text: 'Welcome',
    time: 'Now',
    userImage: require('../assets/images/png/u6.png'),
  },
  {
    id: 8,
    from: 'Britney',
    text: 'Lunch Today',
    time: 'Last Week',
    userImage: require('../assets/images/png/u5.png'),
  },
  {
    id: 9,
    from: 'Andrew',
    text: 'Welcome',
    time: 'Now',
    userImage: require('../assets/images/png/u6.png'),
  },
];

const UserListModal = ({
  modalVisible,
  setModalVisible,
  navigation,
  handleCreateRoom,
}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [searchText, setSearchText] = useState('');
  const [searchedList, setSearchedList] = useState([]);
  const [socketUser, setSocketUser] = useState({});
  const [backendUser, setBackendUser] = useState({});

  const [user, setUser] = useState({});

  const organization = useSelector(state => state.reducer.organization);
  const users = useSelector(state => state.reducer.users);
  const socketUsers = useSelector(state => state.reducer.socketUsers);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    filterUser();
  }, []);

  const clearData = () => {
    setSearchedList([]);
    setSearchText('');
  };

  const handleCancel = () => {
    clearData();
    getColor();
    setDisable(false);
  };

  const filterUser = () => {
    // let temp = users.filter(
    //   elem => elem.from.toLowerCase() != value.toLowerCase(),
    // );
    // console.log(temp);
    let temp = socketUsers.filter(elem => {
      if (!elem.self) {
        return elem;
      }
    });
    console.log(temp, 'temp');
    // setUsers(temp);
    dispatch(addSocketUsers(temp));
  };

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        console.log(value);
        setUser(value);
        filterUser(value);
      }
    } catch (e) {
      console.error('Error while loading username!');
    }
  };

  const handleChange = text => {
    setSearchText(text);
    if (!text) {
      clearData();
    } else {
      let searched = users.filter(item => {
        return item.from?.toLowerCase().includes(text.toLowerCase());
      });
      setSearchedList(searched);
    }
  };

  const getColor = id => {
    let color;

    organization?.forEach(elem => {
      if (elem.id == id) {
        color = elem.color;
      }
    });
    return color;
  };

  const searchUserOnSocket = userData => {
    socketUsers.forEach(elem => {
      if (elem?.username == userData?.email) {
        console.log('found');
        setUser({backendUser: userData, socketUser: elem});
      }
    });
  };
  const renderItem = (elem, i) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSearchText(`${elem?.item?.name} ${elem?.item?.last_name}`);
          setDisable(true);
          searchUserOnSocket(elem?.item);
        }}>
        <View
          style={[
            styles.dp,
            {
              borderColor: getColor(elem?.item?.group),
            },
          ]}>
          <Image
            source={{uri: elem?.item?.image}}
            style={styles.dp1}
            resizeMode={'cover'}
          />
        </View>

        <View>
          <View>
            <Text style={[styles.name, {color: textColor}]}>
              {elem?.item?.name} {elem?.item?.last_name}
            </Text>
          </View>
          {/* <Text style={[styles.textSmall, {color: '#787878'}]}>
            {elem?.item?.userID}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={[styles.modalView, {backgroundColor: color}]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setModalVisible(!modalVisible)}>
          <Inicon
            name="arrow-back-circle-outline"
            size={moderateScale(30)}
            color={textColor}
          />
        </TouchableOpacity>
        <Text style={[styles.modalText, {color: textColor}]}>To</Text>
        <Input
          isReadOnly={disable}
          value={searchText}
          onChangeText={text => {
            handleChange(text);
          }}
          placeholder={'search'}
          placeholderTextColor={textColor}
          fontSize={moderateScale(15, 0.1)}
          variant={'unstyled'}
          color={textColor}
          InputRightElement={
            <TouchableOpacity
              onPress={() => handleCancel()}
              style={{paddingRight: 10}}>
              {searchText ? (
                <Feather
                  name={'x'}
                  size={moderateScale(15, 0.1)}
                  color={'grey'}
                />
              ) : null}
            </TouchableOpacity>
          }
        />
        <View style={styles.list}>
          {searchedList.length > 0 ? (
            <FlatList
              data={searchedList}
              renderItem={renderItem}
              keyExtractor={(e, i) => i.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={users}
              renderItem={renderItem}
              keyExtractor={(e, i) => i.toString()}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (searchText) {
              console.log('start chat');
              console.log(user);
              handleCreateRoom(user);
            } else {
              Alert.alert('select a user to chat');
            }
          }}
          style={styles.btn}>
          <Text style={[styles.btnTxt]}>Start Chat</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default UserListModal;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    paddingTop: moderateScale(35, 0.1),
    paddingHorizontal: moderateScale(20, 0.1),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  btn: {
    position: 'absolute',
    bottom: moderateScale(50, 0.1),
    marginBottom: moderateScale(10, 0.1),
    alignSelf: 'center',
    width: moderateScale(155, 0.1),
    height: moderateScale(40, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: moderateScale(25, 0.1),
  },
  btnTxt: {
    //fontFamily: Poppins,
    fontWeight: '700',
    fontSize: moderateScale(14, 0.1),
    lineHeight: moderateScale(19.5, 0.1),
    color: '#222222',
  },
  modalText: {
    marginBottom: moderateScale(15, 0.1),
    textAlign: 'center',
    fontSize: moderateScale(16, 0.1),
    //fontFamily: Poppins,
  },
  list: {
    width: '100%',
    marginTop: moderateScale(20, 0.1),
  },
  backBtn: {
    marginTop: moderateScale(-10, 0.1),
    marginBottom: moderateScale(10, 0.1),
    marginLeft: moderateScale(-10, 0.1),
  },
  card: {
    flexDirection: 'row',
    marginVertical: moderateScale(15, 0.1),
    alignItems: 'center',
  },
  name: {
    textAlign: 'center',
    fontFamily: PoppinsBold,
    fontSize: moderateScale(15, 0.1),
    fontWeight: 'bold',
    lineHeight: moderateScale(22, 0.1),
  },
  textRegular: {
    //fontFamily: Poppins,
    fontSize: moderateScale(11, 0.1),
    lineHeight: moderateScale(14, 0.1),
    marginVertical: moderateScale(5, 0.1),
  },
  textSmall: {
    //fontFamily: Poppins,
    fontSize: moderateScale(10, 0.1),
    lineHeight: moderateScale(12, 0.1),
    marginVertical: moderateScale(5, 0.1),
    color: '#787878',
  },
  dp1: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(53 / 2, 0.1),
  },
  img: {
    width: '100%',
  },
  dp: {
    width: moderateScale(55, 0.1),
    height: moderateScale(55, 0.1),
    borderRadius: moderateScale(55 / 2, 0.1),
    marginRight: moderateScale(20, 0.1),
    borderWidth: 2,
    // flex: 0.23,
  },
});
