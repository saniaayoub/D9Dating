import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {setTheme} from '../../../../Redux/actions';
import Header from '../../../../Components/Header';
import s from './style';

const About = ({navigation}) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.reducer.theme);
  const color = theme === 'dark' ? '#222222' : '#fff';
  const textColor = theme === 'light' ? '#000' : '#fff';
  return (
    <View style={{flex: 1, backgroundColor: color}}>
      <View style={s.container}>
        <View style={{left: moderateScale(-10)}}>
          <Header navigation={navigation} />
        </View>
        <View style={s.hView}>
          <Text style={[s.hTxt,{color: textColor}]}>About</Text>
        </View>
        <View style={s.Ctxt}>
          <Text style={s.txt}>
            In publishing and graphic design, Lorem ipsum is a placeholder text
            commonly used to demonstrate the visual form of a document or a
            typeface without relying on meaningful content. Lorem ipsum may be
            used as a placeholder before final copy is available.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({});
