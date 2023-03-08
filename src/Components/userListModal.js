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
import {addUsers} from '../Redux/actions';
const Poppins = 'Poppins-Regular';
const PoppinsBold = 'Poppins-Bold';
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
  const users = useSelector(state => state.reducer.users);

  const [user, setUser] = useState('');
  // const [users, setUsers] = useState([]);
  const handleCancel = () => {
    clearData();
  };
  useEffect(() => {
    // getUsername();
    filterUser();
  }, []);
  const clearData = () => {
    setSearchedList([]);
    setSearchText('');
  };

  const filterUser = () => {
    // let temp = users.filter(
    //   elem => elem.from.toLowerCase() != value.toLowerCase(),
    // );
    // console.log(temp);
    let temp = users.filter(elem => {
      if (!elem.self) {
        return elem;
      }
    });
    console.log(temp, 'temp');
    // setUsers(temp);
    dispatch(addUsers(temp));
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
      let searched = Users.filter(item => {
        return item.from?.toLowerCase().includes(text.toLowerCase());
      });
      setSearchedList(searched);
    }
  };

  const renderItem = (elem, i) => {
    console.log(elem);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          handleCreateRoom(elem.item);
          //   navigation.navigate('Chat', elem.item);
        }}
      >
        {/* <View style={styles.dp}>
          <Image
            source={elem.item.userImage}
            style={styles.dp1}
            resizeMode={'cover'}
          />
        </View> */}
        <View>
          <View>
            <Text style={[styles.name, {color: textColor}]}>
              {elem?.item?.username}
            </Text>
          </View>
          <Text style={[styles.textSmall, {color: '#787878'}]}>
            {elem?.item?.userID}
          </Text>
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
      }}
    >
      <View style={[styles.modalView, {backgroundColor: color}]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Inicon
            name="arrow-back-circle-outline"
            size={moderateScale(30)}
            color={textColor}
          />
        </TouchableOpacity>
        <Text style={[styles.modalText, {color: textColor}]}>To</Text>
        <Input
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
              style={{paddingRight: 10}}
            >
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
      </View>
    </Modal>
  );
};

export default UserListModal;

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    padding: moderateScale(35, 0.1),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  modalText: {
    marginBottom: moderateScale(15, 0.1),
    textAlign: 'center',
    fontSize: moderateScale(16, 0.1),
    fontFamily: Poppins,
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
    fontFamily: PoppinsBold,
    fontSize: moderateScale(15, 0.1),
    lineHeight: moderateScale(22, 0.1),
  },
  textRegular: {
    fontFamily: Poppins,
    fontSize: moderateScale(11, 0.1),
    lineHeight: moderateScale(14, 0.1),
    marginVertical: moderateScale(5, 0.1),
  },
  textSmall: {
    fontFamily: Poppins,
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
    width: moderateScale(61, 0.1),
    height: moderateScale(61, 0.1),
    borderRadius: moderateScale(61 / 2, 0.1),
    marginRight: moderateScale(20, 0.1),
  },
});
