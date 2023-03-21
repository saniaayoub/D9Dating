import {Text, SafeAreaView, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import Header from '../../../../Components/Header';
import Entypo from 'react-native-vector-icons/Entypo';
import Inicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import openMap from 'react-native-open-maps';
import {Input, Button, Menu, Pressable} from 'native-base';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loader from '../../../../Components/Loader';
import axiosconfig from '../../../../Providers/axios';
const Privacy = ({navigation}) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [story, setStory] = useState('Public');
  const [post, setPost] = useState('Public');
  const [connect, setConnect] = useState('Public');
  const userToken = useSelector(state => state.reducer.userToken);

  const userPrivacy = async () => {
    setLoader(true);
    const data = {
      privacy_option: connect,
    };
    await axiosconfig
      .post('user-privacy', data,{
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
        
      })
      .then(res => {
        console.log('data', res.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };
  const postprivacy = async () => {
    setLoader(true);
    const data = {
      privacy_option: post,
    };
    console.log(data,'dataa');
    await axiosconfig
      .post('post-privacy', data,{
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: 'application/json',
        },
        
      })
      .then(res => {
        console.log('data', res.data);
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        console.log(err);
        // showToast(err.response);
      });
  };

  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      {loader ? <Loader /> : null}
      <Header navigation={navigation} />
      <ScrollView
        contentContainerStyle={[s.container, {backgroundColor: color}]}>
        <View style={{flexDirection: 'row'}}>
          <View style={s.username}>
            <Text style={[s.textBold, {color: textColor}]}>Privacy</Text>
          </View>
        </View>
        <View style={s.inputSection}>
          <View style={s.input}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(14, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Inicon
                    name={'images-outline'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                  <Text style={[s.smallText]}>Who can view my Stories</Text>
                </View>
              }
              style={{marginBottom: moderateScale(40, 0.1)}}
              InputRightElement={
                <Menu
                  w="200"
                  borderWidth={moderateScale(1, 0.1)}
                  borderBottomColor={'grey'}
                  backgroundColor={color}
                  marginRight={moderateScale(20, 0.1)}
                  trigger={triggerProps => {
                    return (
                      <Pressable
                        accessibilityLabel="More options menu"
                        {...triggerProps}
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text style={[s.option, {color: textColor}]}>
                          {story}
                        </Text>

                        <Entypo
                          name={'chevron-down'}
                          size={moderateScale(25, 0.1)}
                          color={textColor}
                        />
                      </Pressable>
                    );
                  }}>
                  <Menu.Item onPress={() => setStory('Public')}>
                    <View style={s.optionView}>
                      <Entypo
                        name={'globe'}
                        color={textColor}
                        size={moderateScale(15, 0.1)}
                        style={{marginRight: moderateScale(10, 0.1)}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Public
                      </Text>
                    </View>
                  </Menu.Item>
                  <Menu.Item onPress={() => setStory('Friends')}>
                    <View style={s.optionView}>
                      <Icon
                        name={'user-friends'}
                        color={textColor}
                        size={moderateScale(15, 0.1)}
                        style={{marginRight: moderateScale(10, 0.1)}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Friends
                      </Text>
                    </View>
                  </Menu.Item>
                  <Menu.Item onPress={() => setStory('Only Me')}>
                    <View style={s.optionView}>
                      <Entypo
                        name={'lock'}
                        color={textColor}
                        size={moderateScale(15, 0.1)}
                        style={{marginRight: moderateScale(10, 0.1)}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Only Me
                      </Text>
                    </View>
                  </Menu.Item>
                </Menu>
              }
              // value={fname}
              placeholder="My Stories"
              placeholderTextColor={textColor}
            />
          </View>

          <View style={s.input}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(14, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Icon1
                    name={'post'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                  <Text style={[s.smallText]}>Who can view my Posts</Text>
                </View>
              }
              style={{marginBottom: moderateScale(40, 0.1)}}
              InputRightElement={
                <Menu
                  w="200"
                  borderWidth={moderateScale(1, 0.1)}
                  borderBottomColor={'grey'}
                  backgroundColor={color}
                  marginRight={moderateScale(20, 0.1)}
                  trigger={triggerProps => {
                    return (
                      <Pressable
                        accessibilityLabel="More options menu"
                        {...triggerProps}
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Text style={[s.option, {color: textColor}]}>
                          {post == '1' ? 'Public' : post == '2' ? 'Friends' : 'Only Me' }
                        </Text>

                        <Entypo
                          name={'chevron-down'}
                          size={moderateScale(25, 0.1)}
                          color={textColor}
                        />
                      </Pressable>
                    );
                  }}>
                  <Menu.Item onPress={() => 
                  {
                    setPost('1')
                    postprivacy()
                  }}
                   >
                    <View style={s.optionView}>
                      <Entypo
                        name={'globe'}
                        color={textColor}
                        size={moderateScale(15, 0.1)}
                        style={{marginRight: moderateScale(10, 0.1)}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Public
                      </Text>
                    </View>
                  </Menu.Item>
                  <Menu.Item onPress={() => {
                    setPost('2')
                    postprivacy()
                  }}>
                    <View style={s.optionView}>
                      <Icon
                        name={'user-friends'}
                        color={textColor}
                        size={moderateScale(15, 0.1)}
                        style={{marginRight: moderateScale(10, 0.1)}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Friends
                      </Text>
                    </View>
                  </Menu.Item>
                  <Menu.Item onPress={() => {
                    setPost('3')
                    postprivacy()
                  }}>
                    <View style={s.optionView}>
                      <Entypo
                        name={'lock'}
                        color={textColor}
                        size={moderateScale(15, 0.1)}
                        style={{marginRight: moderateScale(10, 0.1)}}
                      />
                      <Text style={[s.optionBtns, {color: textColor}]}>
                        Only Me
                      </Text>
                    </View>
                  </Menu.Item>
                </Menu>
              }
              // value={fname}
              placeholder="Posts"
              placeholderTextColor={textColor}
            />
          </View>

          <View style={s.input}>
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(14, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <MaterialIcons
                    name={'supervised-user-circle'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                  <Text style={[s.smallText]}>Who can connect me</Text>
                </View>
              }
              style={{marginBottom: moderateScale(40, 0.1)}}
              InputRightElement={
                  <Menu
                    w="200"
                    borderWidth={moderateScale(1, 0.1)}
                    borderBottomColor={'grey'}
                    backgroundColor={color}
                    marginRight={moderateScale(20, 0.1)}
                    trigger={triggerProps => {
                      return (
                        <Pressable
                          accessibilityLabel="More options menu"
                          {...triggerProps}
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text style={[s.option, {color: textColor}]}>
                            {connect == '1' ? 'Everyone' : 'Friends of Friends'}
                          </Text>

                          <Entypo
                            name={'chevron-down'}
                            size={moderateScale(25, 0.1)}
                            color={textColor}
                          />
                        </Pressable>
                      );
                    }}>
                    <Menu.Item
                      onPress={() => {
                        setConnect('1');
                        userPrivacy()
                      }}>
                      <View style={s.optionView}>
                        <Entypo
                          name={'globe'}
                          color={textColor}
                          size={moderateScale(15, 0.1)}
                          style={{marginRight: moderateScale(10, 0.1)}}
                        />
                        <Text style={[s.optionBtns, {color: textColor}]}>
                          Everyone
                        </Text>
                      </View>
                    </Menu.Item>
                    <Menu.Item onPress={() => 
                    {
                      setConnect('2')
                      userPrivacy()


                    }
                     }>
                      <View style={s.optionView}>
                        <Icon
                          name={'users'}
                          color={textColor}
                          size={moderateScale(15, 0.1)}
                          style={{marginRight: moderateScale(10, 0.1)}}
                        />
                        <Text style={[s.optionBtns, {color: textColor}]}>
                          Friends of Friends
                        </Text>
                      </View>
                    </Menu.Item>
                  </Menu>

              }
              // value={fname}
              placeholder="Connect"
              placeholderTextColor={textColor}
            />
          </View>
          {/* <TouchableOpacity
            style={s.input}
            onPress={() => navigation.navigate('About')}
          >
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Entypo
                    name={'info-with-circle'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              // value={fname}
              placeholder="About"
              placeholderTextColor={textColor}
            />
<<<<<<< HEAD
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> goToYosemite()}
          style={s.input}>
=======
          </TouchableOpacity> */}

          {/* <View style={s.input}>
>>>>>>> 380b0c24c2fc19ae48b3c471b0c1e9c65da7aaae
            <Input
              w="100%"
              isReadOnly
              variant="underlined"
              color={textColor}
              fontSize={moderateScale(12, 0.1)}
              InputLeftElement={
                <View style={s.icon}>
                  <Inicon
                    name={'location'}
                    size={moderateScale(20, 0.1)}
                    solid
                    color={textColor}
                  />
                </View>
              }
              // value={fname}
              placeholder="Live Location"
              placeholderTextColor={textColor}
            />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Privacy;

//  {optionsModal ? (
//             <View
//               style={[
//                 s.modal,
//                 {backgroundColor: color, borderColor: textColor},
//               ]}
//             >
//               <Button
//                 backgroundColor={color}
//                 margin={0}
//                 padding={0}
//                 variant={'link'}
//                 justifyContent={'flex-start'}
//                 onPress={() => {
//                   setStory('Public');
//                   setOptionsModal(false);
//                 }}
//               >
//                 <View style={[s.optionView]}>
//                   <Entypo
//                     name={'globe'}
//                     color={textColor}
//                     solid
//                     style={{flex: 0.2}}
//                     size={moderateScale(12, 0.1)}
//                   />
//                   <Text style={[s.optionBtns, {color: textColor}]}>
//                     Public
//                   </Text>
//                 </View>
//               </Button>
//               <Button
//                 backgroundColor={color}
//                 margin={0}
//                 padding={0}
//                 variant={'link'}
//                 justifyContent={'flex-start'}
//                 onPress={() => {
//                   setStory('Friends');
//                   setOptionsModal(false);
//                 }}
//               >
//                 <View style={s.optionView}>
//                   <Icon
//                     name={'user-friends'}
//                     color={textColor}
//                     size={moderateScale(13, 0.1)}
//                     style={{flex: 0.2}}
//                   />
//                   <Text style={[s.optionBtns, {color: textColor}]}>
//                     Friends
//                   </Text>
//                 </View>
//               </Button>
//               <Button
//                 backgroundColor={color}
//                 margin={0}
//                 padding={0}
//                 variant={'link'}
//                 justifyContent={'flex-start'}
//                 onPress={() => {
//                   setStory('Only Me');
//                   setOptionsModal(false);
//                 }}
//               >
//                 <View style={s.optionView}>
//                   <Entypo
//                     name={'lock'}
//                     color={textColor}
//                     size={moderateScale(13, 0.1)}
//                     style={{flex: 0.2}}
//                   />
//                   <Text style={[s.optionBtns, {color: textColor}]}>
//                     Only Me
//                   </Text>
//                 </View>
//               </Button>
//             </View>
//           ) : null}
