import {
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Image,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import s from './style';
import InstaStory from 'react-native-insta-story';
import {Input, Button, Menu, Pressable} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Pin from 'react-native-vector-icons/SimpleLineIcons';
import {ScrollView} from 'react-native';

const myData = [];

const data = [
  {
    user_id: 1,
    user_image:
      'https://images.unsplash.com/photo-1602545164910-81aecfd1413d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60g',
    user_name: 'Ahmet Çağlar Durmuş',
    post: {
      image: require('../../../../assets/images/png/post1.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [
      {
        story_id: 1,
        story_image:
          'https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
      },
    ],
  },
  {
    user_id: 2,
    user_image:
      'https://images.unsplash.com/photo-1627067324578-61af969907fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Test User',
    post: {
      image: require('../../../../assets/images/png/post1.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [
      {
        story_id: 1,
        story_image:
          'https://images.unsplash.com/photo-1602545164910-81aecfd1413d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 3,
    post: {
      image: require('../../../../assets/images/png/post1.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    user_image:
      'https://images.unsplash.com/photo-1592861394788-2935b53de467?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Test User',
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 4,
    user_image:
      'https://plus.unsplash.com/premium_photo-1664124888904-435121e89c74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Test User',
    post: {
      image: require('../../../../assets/images/png/post1.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 5,
    user_image:
      'https://images.unsplash.com/photo-1616267624976-b45d3a7bac73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTl8fGRwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    user_name: 'Test User',
    post: {
      image: require('../../../../assets/images/png/post1.png'),
      location: 'USA',
      likes: 233,
      caption:
        'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam',
      liked: true,
    },
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];

const FunInteraction = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  const [data1, setData1] = useState(data);
  const [searchText, setSearchText] = useState('');
  const [lastTap, setLastTap] = useState(null);
  const [refresh, setReferesh] = useState(true);

  useEffect(() => {}, []);
  const handleDoubleTap = index => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      toggleLike(index);
    } else {
      setLastTap(now);
    }
  };

  const toggleLike = index => {
    console.log('hello');
    data[index].post.liked = !data[index].post.liked;
    setData1(data);
    setReferesh(data[index].post.liked);
    console.log(data[index].post.liked);
  };

  const renderItem = elem => {
    console.log(elem);
    return (
      <View style={s.col}>
        {/* {optionsModal && elem.index == selectedIndex ? (
          <View style={[s.modal, {backgroundColor: color}]}>
            <Button
              backgroundColor={color}
              margin={0}
              padding={0}
              variant={'link'}
              justifyContent={'flex-start'}
            >
              <View
                style={[s.optionView, {marginVertical: moderateScale(5, 0.1)}]}
              >
                <Icon
                  name={'eye-slash'}
                  color={textColor}
                  size={moderateScale(12, 0.1)}
                />
                <Text style={[s.optionBtns, {color: textColor}]}>Hide</Text>
              </View>
            </Button>
            <Button
              backgroundColor={color}
              margin={0}
              padding={0}
              variant={'link'}
              justifyContent={'flex-start'}
            >
              <View style={s.optionView}>
                <MaterialIcons
                  name={'report'}
                  color={textColor}
                  size={moderateScale(13, 0.1)}
                />
                <Text style={[s.optionBtns, {color: textColor}]}>Report</Text>
              </View>
            </Button>
          </View>
        ) : null} */}
        <View style={s.header}>
          <View style={s.dp}>
            <Image
              source={{uri: elem.item.user_image}}
              style={s.dp1}
              resizeMode={'cover'}
            />
          </View>
          <View style={[s.col, {flex: 0.9, marginTop: moderateScale(5, 0.1)}]}>
            <TouchableOpacity onPress={() => navigation.navigate('ViewUser')}>
              <Text style={[s.name, s.nameBold, {color: textColor}]}>
                {elem?.item?.user_name}
              </Text>
            </TouchableOpacity>
            <Text style={[s.textRegular, {color: textColor}]}>
              {elem?.item?.post?.location}
            </Text>
          </View>
          {elem.index === 0 ? (
            <TouchableOpacity
              style={[s.options, {marginRight: moderateScale(12, 0.1)}]}
            >
              <Pin
                name={'pin'}
                color={textColor}
                size={moderateScale(15, 0.1)}
              />
            </TouchableOpacity>
          ) : null}
          <View style={[s.options]}>
            <Menu
              w="150"
              borderWidth={moderateScale(1, 0.1)}
              borderColor={'grey'}
              backgroundColor={color}
              // alignItems={'center'}
              // justifyContent={'center'}
              marginRight={moderateScale(15, 0.1)}
              marginTop={moderateScale(25, 0.1)}
              closeOnSelect={true}
              trigger={triggerProps => {
                return (
                  <Pressable
                    accessibilityLabel="More options menu"
                    {...triggerProps}
                    style={{
                      flexDirection: 'row',
                      right: moderateScale(8,0.1)
                    }}
                  >
                    <Entypo
                      name={'dots-three-vertical'}
                      color={textColor}
                      size={moderateScale(15, 0.1)}
                    />
                  </Pressable>
                );
              }}
            >
              <Menu.Item onPress={() => {}}>
                <View style={s.optionView}>
                  <Icon
                    name={'eye-slash'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    // style={{marginRight: moderateScale(10, 0.1)}}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns, {color: textColor}]}>Hide</Text>
                </View>
              </Menu.Item>
              <Menu.Item onPress={() => {}}>
                <View style={s.optionView}>
                  <MaterialIcons
                    name={'report'}
                    color={textColor}
                    size={moderateScale(13, 0.1)}
                    style={{flex: 0.3}}
                  />
                  <Text style={[s.optionBtns, {color: textColor}]}>Report</Text>
                </View>
              </Menu.Item>
            </Menu>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              if (elem.index === selectedIndex) {
                setOptionsModal(!optionsModal);
              } else {
                setOptionsModal(true);
                setSelectedIndex(elem.index);
              }
            }}
            style={s.options}
          >
            <Entypo
              name={'dots-three-vertical'}
              color={textColor}
              size={moderateScale(15, 0.1)}
            />
          </TouchableOpacity> */}

          {/*All views of Modal*/}
        </View>
        <View style={s.img}>
          <TouchableWithoutFeedback onPress={() => handleDoubleTap(elem.index)}>
            <Image
              source={elem?.item?.post?.image}
              width={undefined}
              height={undefined}
              resizeMode={'contain'}
              style={{width: '100%'}}
            />
          </TouchableWithoutFeedback>
          <TouchableOpacity
            onPress={() => {
              toggleLike(elem.index);
              // console.log(data[elem.index].post.liked);
            }}
            style={s.likes}
          >
            <Text style={s.likesCount}> {elem?.item?.post?.likes}</Text>

            <Icon
              name="heart"
              size={moderateScale(12, 0.1)}
              solid
              color={elem?.item?.post?.liked === true ? 'yellow' : '#fff'}
            />
          </TouchableOpacity>
        </View>
        <View style={s.footer}>
          <Text style={[s.name, {color: textColor}]}>
            {elem?.item?.user_name}
          </Text>
          <Text style={[s.textRegular, {color: textColor}]}>
            {elem?.item?.post?.caption}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{display: 'flex', flex: 1, backgroundColor: color}}>
      <View style={[s.container, s.col, {backgroundColor: color}]}>
        <View style={s.searchContainer}>
          <Input
            placeholder="Search Here"
            placeholderTextColor={'#B9B9B9'}
            onChangeText={text => setSearchText(text)}
            value={searchText}
            marginTop={moderateScale(10, 0.1)}
            w={'95%'}
            h={moderateScale(37, 0.1)}
            variant="rounded"
            InputLeftElement={
              <View style={{paddingLeft: 10}}>
                <Icon
                  name="search"
                  size={moderateScale(25, 0.1)}
                  color={'#B9B9B9'}
                />
              </View>
            }
            InputRightElement={
              <TouchableOpacity
                // onPress={() => handleCancel()}
                style={{paddingRight: 10}}
              >
                {searchText ? (
                  <Entypo
                    name={'cross'}
                    size={moderateScale(20, 0.1)}
                    color={'#B9B9B9'}
                  />
                ) : null}
              </TouchableOpacity>
            }
            color={'#fff'}
            backgroundColor={'#595757'}
          />
        </View>
        <ScrollView
          scrollEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            // alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {myData.length > 0 ? (
            <>
              <InstaStory
                data={myData}
                duration={10}
                onStart={item => console.log(item)}
                onClose={item => console.log('close: ', item)}
                showAvatarText={true}
                avatarTextStyle={{
                  color: textColor,
                  marginBottom: moderateScale(25, 0.1),
                }}
                customSwipeUpComponent={
                  <View>
                    <Text>Swipe</Text>
                  </View>
                }
                style={{
                  marginTop: moderateScale(5, 0.1),
                  marginRight: moderateScale(-20, 0.1),
                }}
              />
            </>
          ) : (
            <>
              <TouchableOpacity style={s.myStory}>
                <Image
                  source={require('../../../../assets/images/png/mydp.png')}
                  width={undefined}
                  height={undefined}
                  style={{width: '100%', height: '100%'}}
                  resizeMode={'contain'}
                />
                <Text style={[s.userName, {color: textColor}]}>
                  Julie Watson
                </Text>
                <View style={s.addBtn}>
                  <Icon
                    name={'plus'}
                    size={moderateScale(8, 0.1)}
                    color={'blue'}
                  />
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* <LinearGradient
            colors={['#cc2b5e', '#753a88']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[
              s.linearGradient,
              // <-- Overwrites the preceding style property
            ]}
          >
            <View style={[s.innerContainer]}>
              <Text style={s.buttonText}>GRADIENT BORDER CIRCLE</Text>
            </View>
          </LinearGradient> */}

          <InstaStory
            data={data}
            duration={10}
            onStart={item => console.log(item)}
            onClose={item => console.log('close: ', item)}
            showAvatarText={true}
            avatarTextStyle={{
              color: textColor,
              marginBottom: moderateScale(25, 0.1),
            }}
            customSwipeUpComponent={
              <View>
                <Text>Swipe</Text>
              </View>
            }
            style={{
              marginTop: moderateScale(5, 0.1),
            }}
          />
        </ScrollView>

        <TouchableOpacity style={s.funView}>
          {/* <View style={[s.yellow, s.round]}>
            <Fun
              width={moderateScale(12, 0.1)}
              height={moderateScale(12, 0.1)}
            />
          </View>
          <View style={[s.yellow, s.round2]}>
            <Text style={s.count}>5</Text>
          </View>
          <Text style={[s.funText, {color: textColor}]}>Fun Interaction</Text> */}
        </TouchableOpacity>

        <FlatList
          data={data1}
          renderItem={elem => renderItem(elem)}
          keyExtractor={(elem, index) => {
            index.toString();
          }}
          extraData={refresh}
        />

        {/* <ScrollView
          scrollEnabled
          vertical
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {data.map((elem, index)=> {
            return()
          })}
        </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

export default FunInteraction;
