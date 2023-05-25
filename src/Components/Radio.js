import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {setTheme} from '../Redux/actions';
const poppins = '';
const radio = ({onPress, selected, children}) => {
  const theme = useSelector(state => state.reducer.theme);
  const dispatch = useDispatch();
  const Textcolor = theme === 'dark' ? '#fff' : '#222222';
  return (
    <View style={styles.radioButtonContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.radioButton, {borderColor: Textcolor}]}>
        {selected ? <View style={styles.radioButtonIcon} /> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.radioButtonText, {color: Textcolor}]}>
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default radio;

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateScale(14, 0.1),
    height: moderateScale(22, 0.1),
  },
  radioButton: {
    height: moderateScale(10, 0.1),
    width: moderateScale(10, 0.1),
    // backgroundColor: '#fff',
    borderRadius: moderateScale(10, 0.1),
    borderWidth: moderateScale(1, 0.1),
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // margin: moderateScale(7,0.1)
  },
  radioButtonIcon: {
    height: moderateScale(11, 0.1),
    width: moderateScale(11, 0.1),
    borderRadius: moderateScale(7, 0.1),
    backgroundColor: '#FFD700',
  },
  radioButtonText: {
    fontWeight: '300',
    fontSize: moderateScale(12, 0.1),
    //fontFamily: poppins,
    marginLeft: moderateScale(9, 0.1),
    lineHeight: moderateScale(12, 0.1),
  },
});
