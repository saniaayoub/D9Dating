import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import s from './ViewUser/index';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Header from '../../../Components/Header';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import {setTheme} from '../../../Redux/actions';
import {Image} from 'react-native';
import {ImageBackground} from 'react-native';

const HEADER_MIN_HEIGHT = 100;
const HEADER_MAX_HEIGHT = 300;

export default class Test extends Component {
  constructor() {
    super();

    this.scrollYAnimatedValue = new Animated.Value(0);
  }

  data = [
    {
      user_id: 1,
      user_image:
        'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
      user_name: 'Ahmet Çağlar Durmuş',
      Designation: 'Fashion Designer',
      location: ' California, USA',
      caption:
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. ',
      post: {
        image: require('../../../assets/images/png/dp.png'),

        likes: 233,
      },
    },
  ];

  render() {
    const headerHeight = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });

    const headerBackgroundColor = this.scrollYAnimatedValue.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: ['#e91e63', '#1DA1F2'],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.container}>
        <ImageBackground
          style={{width: '100%'}}
          resizeMode="cover"
          source={require('../../../assets/images/png/dp.png')}
        >
          <ScrollView
            contentContainerStyle={{paddingTop: HEADER_MAX_HEIGHT}}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {y: this.scrollYAnimatedValue}}},
            ])}
          >
            {this.data.map((item, key) => (
              // <View style={s.container}>
              <>
                <View
                  style={{
                    backgroundColor: '#222222',
                    borderTopLeftRadius: moderateScale(25, 0.1),
                    borderTopRightRadius: moderateScale(25, 0.1),
                  }}
                >
                  <View style={s.row}>
                    <Text style={[s.headerTxt]}>{item.user_name} </Text>

                    <View style={s.icon}>
                      <AntDesign
                        style={{position: 'absolute'}}
                        name="message1"
                        color="#FFD700"
                        solid
                        size={moderateScale(22, 0.1)}
                      />
                    </View>
                  </View>

                  <View>
                    <Text style={[s.txt]}>{item.Designation} </Text>
                  </View>

                  <View style={s.row1}>
                    <View>
                      <Ionicon
                        name="location-sharp"
                        color="#fff"
                        solid
                        size={moderateScale(22, 0.1)}
                      />
                    </View>
                    <Text style={[s.location]}>{item.Designation} </Text>
                  </View>

                  <View style={s.about}>
                    <Text style={[s.aboutTxt]}>About Us </Text>
                    <View style={s.abTxt}>
                      <Text style={[s.txt]}>{item.caption} </Text>
                    </View>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                  <View style={s.btn}>
                    <Text style={[s.btnTxt]}>Connect</Text>
                  </View>
                </View>
              </>
              // </View>
            ))}
          </ScrollView>
        </ImageBackground>
        <View>
          {/* <View style={{
                        position: 'absolute', justifyContent: 'flex-start',
                        paddingHorizontal: moderateScale(25),
                    }}>

                        <Header />
                    </View> */}
          <Animated.Image
            style={[
              styles.animatedHeaderContainer,
              {height: headerHeight, width: '100%'},
            ]}
            source={require('../../../assets/images/png/dp.png')}
          ></Animated.Image>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  animatedHeaderContainer: {
    position: 'absolute',
    top: Platform.OS == 'ios' ? 20 : 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
  },
  item: {
    backgroundColor: '#ff9e80',
    margin: 8,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: 'black',
    fontSize: 16,
  },
});
