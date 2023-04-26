import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Easing,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import s from './style';
import {Input, Button} from 'native-base';
import {moderateScale} from 'react-native-size-matters';
import e1 from '../../../assets/images/png/as1.jpg';
import e2 from '../../../assets/images/png/as2.jpg';
import e3 from '../../../assets/images/png/as3.jpg';
import e4 from '../../../assets/images/png/as4.jpg';
import e5 from '../../../assets/images/png/e5.png';
import e6 from '../../../assets/images/png/e6.png';
import e7 from '../../../assets/images/png/e7.png';
import Logo from '../../../assets/images/png/logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const StartScreen = ({navigation}) => {
  const theme = useSelector(state => state.reducer.theme);
  const spinValue = useRef(new Animated.Value(0)).current;
  const transAnim = useRef(new Animated.Value(-100)).current;

  const circulate = useRef(new Animated.ValueXY({x: 70, y: 70})).current;
  const circulate1 = useRef(new Animated.ValueXY({x: 196 / 2, y: 200 / 2}))
    .current;
  const spinValue2 = useRef(new Animated.Value(0)).current;
  const circulate2 = useRef(new Animated.ValueXY({x: 130, y: 140})).current;
  const circulate3 = useRef(new Animated.ValueXY({x: 150, y: 150})).current;
  const circulate4 = useRef(new Animated.ValueXY({x: 140, y: 170})).current;
  const circulate5 = useRef(new Animated.ValueXY({x: 140, y: 170})).current;

  useEffect(() => {
    circulation();
    fadeIn();
  }, []);

  const fadeIn = () => {
    // Will change spinValue value to 1 in 5 seconds

    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(spinValue2, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
  };

  const translate = () => {
    Animated.timing(transAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };

  const circulation = () => {
    Animated.loop(
      Animated.timing(circulate, {
        toValue: {x: 70, y: 70},
        duration: 15000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(circulate1, {
        toValue: {x: 196 / 2, y: 200 / 2},
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(circulate2, {
        toValue: {x: 130, y: 140},
        duration: 15000,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.timing(circulate3, {
        toValue: {x: 150, y: 150},
        duration: 10000,
        useNativeDriver: true,
      }),
    ).start();
    Animated.loop(
      Animated.timing(circulate4, {
        toValue: {x: 140, y: 170},
        duration: 8000,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.timing(circulate5, {
        toValue: {x: 140, y: 170},
        duration: 8000,
        useNativeDriver: true,
      }),
    ).start();
  };

  let spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  let spin1 = spinValue2.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        height: '100%',
        backgroundColor: theme === 'dark' ? '#222222' : '#fff',
      }}
    >
      <View
        style={[
          s.container,
          {
            backgroundColor: theme === 'dark' ? '#222222' : '#fff',
            width: width,
            height: height,
          },
        ]}
      >
        <View style={[s.logo, {color: theme === 'dark' ? '#fff' : '#000'}]}>
          <Image
            source={Logo}
            width={undefined}
            height={undefined}
            resizeMode={'contain'}
            // style={{transform: [{rotate: spin}]}}
          />
          <Text
            style={[s.logoText, {color: theme === 'dark' ? '#fff' : '#000'}]}
          >
            D9 Dating
          </Text>
        </View>
        <View style={s.headingContainer}>
          <Text
            style={[s.heading1, {color: theme === 'dark' ? '#fff' : '#000'}]}
          >
            Find Your
          </Text>
          <Text
            style={[s.heading2, {color: theme === 'dark' ? '#fff' : '#000'}]}
          >
            Best Partner
          </Text>
        </View>

        {/* Without Animation Final */}
        <View style={s.animationView}>
          <View style={s.circle1}>
            <Animated.Image
              source={e1}
              width={undefined}
              height={undefined}
              style={{
                borderRadius: moderateScale(116 / 2, 0.1),
                width: moderateScale(90, 0.1),
                height: moderateScale(90, 0.1),
                // borderRadius: moderateScale
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={s.circle2}>
            {/* <Image
              source={e5}
              width={undefined}
              height={undefined}
              style={{top: moderateScale(40, 0.1)}}
              resizeMode={'cover'}
            /> */}
            <View style={s.round2}>
            <Text 
            style={{
             fontSize: moderateScale(25,0.1)}}>🤙🏾</Text>
            </View>
          </View>
          <View style={s.circle3}>
            <View style={s.round}>
              {/* <Image
                source={e6}
                width={undefined}
                height={undefined}
                style={{
                  borderRadius: moderateScale(16, 0.1),
                  zIndex: 1000,
                }}
                resizeMode={'cover'}
              /> */}
            <Text  style={{
                  borderRadius: moderateScale(16, 0.1),
                  zIndex: -5000,
                fontSize: moderateScale(25,0.1)
                }}>👌🏾</Text>
            </View>

            {/* <Image
              source={e7}
              width={undefined}
              height={undefined}
              style={{
                // zIndex: 5000,
                top: moderateScale(245, 0.1),
                left: moderateScale(100, 0.1),
              }}
              resizeMode={'cover'}
            /> */}
            <View style={s.round1}>
            <Text  style={{
                zIndex: 5000,
                // top: moderateScale(230, 0.1),
                // left: moderateScale(100, 0.1),
                fontSize: moderateScale(30,0.1)
              }}>🤘🏽</Text>
            </View>
          </View>
          <View style={s.circle4}>
            <Image
              source={e2}
              width={undefined}
              resizeMode={'cover'}
              style={{
                top: moderateScale(7,0.1),
                left: moderateScale(25, 0.1),
                width: moderateScale(60, 0.1),
                height: moderateScale(60, 0.1),
                borderRadius: moderateScale(60/2,0.1)
                
              }}
            />
            <Image
              source={e3}
              width={undefined}
              resizeMode={'cover'}
              style={{
                left: moderateScale(200, 0.1),
                top: moderateScale(240, 0.1),
                width: moderateScale(55, 0.1),
                height: moderateScale(55, 0.1),
                borderRadius: moderateScale(55/2,0.1)
              }}
            />
            <Image
              source={e4}
              width={undefined}
              resizeMode={'cover'}
              style={{
                left: moderateScale(300, 0.1),
                top: moderateScale(-50, 0.1),
                width: moderateScale(50, 0.1),
                height: moderateScale(50, 0.1),
                borderRadius: moderateScale(50/2,0.1)
              }}
            />
          </View>
        </View>

        {/* With Animation 1 */}
        {/* <View style={s.animationView}>
          <View style={s.circle1}>
            <Image
              source={e1}
              width={undefined}
              height={undefined}
              style={{
                zIndex: 1001,
                width: '100%',
                height: '100%',
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={s.circle2}></View>
          <View style={s.circle3}>
            <Animated.Image
              source={e5}
              width={undefined}
              height={undefined}
              style={{
                zIndex: 1100,
                // top: moderateScale(80, 0.1),
                left: moderateScale(130, 0.1),
                transform: [
                  {
                    translateY: circulate.y,
                  },
                  {rotate: spin},
                  {
                    translateX: circulate.x,
                  },
                ],
              }}
              resizeMode={'cover'}
            />
            <Animated.View
              style={[
                s.round,
                {
                  zIndex: 1200,
                  transform: [
                    {
                      translateY: circulate1.y,
                    },
                    {rotate: spin},
                    {
                      translateX: circulate1.x,
                    },
                  ],
                },
              ]}
            >
              <Image
                source={e6}
                width={undefined}
                height={undefined}
                style={{
                  zIndex: 1300,
                  borderRadius: moderateScale(16, 0.1),
                }}
                resizeMode={'cover'}
              />
            </Animated.View>

            <Animated.Image
              source={e7}
              width={undefined}
              height={undefined}
              style={{
                left: moderateScale(130, 0.1),
                zIndex: 1400,
                transform: [
                  {
                    translateY: circulate2.y,
                  },
                  {rotate: spin},
                  {
                    translateX: circulate2.x,
                  },
                ],
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={s.circle4}>
            <Animated.Image
              source={e2}
              width={undefined}
              resizeMode={'cover'}
              style={{
                // left: moderateScale(25, 0.1),
                left: moderateScale(150, 0.1),
                transform: [
                  {
                    translateY: circulate3.y,
                  },
                  {rotate: spin1},
                  {
                    translateX: circulate3.x,
                  },
                ],
              }}
            />
            <Animated.Image
              source={e3}
              width={undefined}
              resizeMode={'cover'}
              style={{
                left: moderateScale(270 / 2, 0.1),
                bottom: moderateScale(270 / 2, 0.1),
                transform: [
                  {
                    translateY: circulate4.y,
                  },
                  {rotate: spin},
                  {
                    translateX: circulate4.x,
                  },
                ],
              }}
            />
            <Animated.Image
              source={e4}
              width={undefined}
              resizeMode={'cover'}
              style={{
                left: moderateScale(150, 0.1),
                bottom: moderateScale(150, 0.1),
                transform: [
                  {
                    translateY: circulate5.y,
                  },
                  {rotate: spin1},
                  {
                    translateX: circulate5.x,
                  },
                ],
              }}
            />
          </View>
        </View> */}

        {/* With Animation 2 */}
        {/* <View style={s.animationView}>
          <View style={s.circle1}>
            <Animated.Image
              source={e1}
              width={undefined}
              height={undefined}
              style={{
                width: '100%',
                height: '100%',
                transform: [
                  {
                    rotate: spin,
                  },
                ],
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={s.circle2}>
            <Animated.Image
              source={e5}
              width={undefined}
              height={undefined}
              style={{
                // top: moderateScale(40, 0.1),
                transform: [
                  {
                    translateY: circulate.y,
                  },
                  {rotate: spin},
                  {
                    translateX: circulate.x,
                  },
                ],
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={s.circle3}>
            <View style={s.round}>
              <Image
                source={e6}
                width={undefined}
                height={undefined}
                style={{
                  borderRadius: moderateScale(16, 0.1),
                }}
                resizeMode={'cover'}
              />
            </View>

            <Image
              source={e7}
              width={undefined}
              height={undefined}
              style={{
                top: moderateScale(245, 0.1),
                left: moderateScale(100, 0.1),
              }}
              resizeMode={'cover'}
            />
          </View>
          <View style={s.circle4}>
            <Image
              source={e2}
              width={undefined}
              resizeMode={'cover'}
              style={{
                left: moderateScale(25, 0.1),
              }}
            />
            <Image
              source={e3}
              width={undefined}
              resizeMode={'cover'}
              style={{
                left: moderateScale(200, 0.1),
                top: moderateScale(240, 0.1),
              }}
            />
            <Image
              source={e4}
              width={undefined}
              resizeMode={'cover'}
              style={{
                left: moderateScale(300, 0.1),
                top: moderateScale(-50, 0.1),
              }}
            />
          </View>
        </View> */}
      </View>

      <View style={s.button}>
        <Button
          size="sm"
          // onPress={() => {
          //   navigation.navigate('Login');
          //   // dispatch(setUserToken('sania'));
          //   console.log('hi');
          // }}
          onPressIn={async () => {
            navigation.navigate('Login');
            await AsyncStorage.setItem('already', 'already');
            // dispatch(setUserToken('sania'));
            console.log('hi');
          }}
          variant={'solid'}
          _text={{
            color: '#6627EC',
          }}
          backgroundColor={'#FFD700'}
          borderRadius={50}
          w={moderateScale(151, 0.1)}
          h={moderateScale(35, 0.1)}
          alignItems={'center'}
          style={s.shadow}
        >
          <Text style={[s.btnText, {color: '#000'}]}>Start</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default StartScreen;

// Animated Functions
//  const spinValue = useRef(new Animated.Value(0)).current;
//   const transAnim = useRef(new Animated.Value(-100)).current;

//   const circulate = useRef(new Animated.ValueXY({x: 130, y: 130})).current;
//   const circulate1 = useRef(new Animated.ValueXY({x: 196 / 2, y: 200 / 2}))
//     .current;
//   const spinValue2 = useRef(new Animated.Value(0)).current;
//   const circulate2 = useRef(new Animated.ValueXY({x: 130, y: 140})).current;
//   const circulate3 = useRef(new Animated.ValueXY({x: 150, y: 150})).current;
//   const circulate4 = useRef(new Animated.ValueXY({x: 140, y: 170})).current;
//   const circulate5 = useRef(new Animated.ValueXY({x: 140, y: 170})).current;

//   useEffect(() => {
//     circulation();
//     fadeIn();
//   }, []);

//   const fadeIn = () => {
//     // Will change spinValue value to 1 in 5 seconds

//     Animated.loop(
//       Animated.timing(spinValue, {
//         toValue: 1,
//         duration: 10000,
//         useNativeDriver: true,
//       }),
//     ).start();

//     Animated.loop(
//       Animated.timing(spinValue2, {
//         toValue: 1,
//         duration: 10000,
//         useNativeDriver: true,
//       }),
//     ).start();
//   };

//   const translate = () => {
//     Animated.timing(transAnim, {
//       toValue: 0,
//       duration: 2000,
//       useNativeDriver: true,
//     }).start();
//   };

//   const circulation = () => {
//     Animated.loop(
//       Animated.timing(circulate, {
//         toValue: {x: 130, y: 130},
//         duration: 15000,
//         useNativeDriver: true,
//       }),
//     ).start();

//     Animated.loop(
//       Animated.timing(circulate1, {
//         toValue: {x: 196 / 2, y: 200 / 2},
//         duration: 10000,
//         useNativeDriver: true,
//       }),
//     ).start();

//     Animated.loop(
//       Animated.timing(circulate2, {
//         toValue: {x: 130, y: 140},
//         duration: 15000,
//         useNativeDriver: true,
//       }),
//     ).start();
//     Animated.loop(
//       Animated.timing(circulate3, {
//         toValue: {x: 150, y: 150},
//         duration: 10000,
//         useNativeDriver: true,
//       }),
//     ).start();
//     Animated.loop(
//       Animated.timing(circulate4, {
//         toValue: {x: 140, y: 170},
//         duration: 8000,
//         useNativeDriver: true,
//       }),
//     ).start();

//     Animated.loop(
//       Animated.timing(circulate5, {
//         toValue: {x: 140, y: 170},
//         duration: 8000,
//         useNativeDriver: true,
//       }),
//     ).start();
//   };

//   let spin = spinValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg'],
//   });

//   let spin1 = spinValue2.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '-360deg'],
//   });
