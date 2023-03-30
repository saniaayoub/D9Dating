import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Poppins = '';
const PoppinsBold = '';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#222222',
    height: '100%',
    // flex: 1,
  },
  heading: {
    marginTop: moderateScale(80, 0.1),
    marginBottom: moderateScale(60, 0.1),
  },
  headingText: {
    //fontFamily: PoppinsBold,
    fontSize: moderateScale(32, 0.1),
    lineHeight: moderateScale(48, 0.1),
  },
  headingText1: {
    //fontFamily: Poppins,
    color: '#fff',
    fontSize: moderateScale(34, 0.1),
    lineHeight: moderateScale(37, 0.1),
  },
  iconCircle: {
    padding: moderateScale(7, 0.1),
    marginRight: moderateScale(15, 0.1),
    marginLeft: moderateScale(5, 0.1),
    marginBottom: moderateScale(5, 0.1),
  },
  input: {
    marginVertical: moderateScale(15, 0.1),
  },
  button: {
    marginTop: moderateScale(15, 0.1),
    marginBottom: moderateScale(10, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    //fontFamily: Poppins,
    lineHeight: moderateScale(20, 0.1),
    fontSize: moderateScale(13, 0.1),
    color: '#222222',
  },
  forgetPass: {
    color: '#FFFFFF',
    fontSize: moderateScale(10, 0.1),
    lineHeight: moderateScale(15, 0.1),
    //fontFamily: Poppins,
  },
  forgetPass1: {
    color: '#FFD700',
    fontSize: moderateScale(10, 0.1),
    lineHeight: moderateScale(15, 0.1),
    //fontFamily: Poppins,
  },
  eye: {
    position: 'absolute',
    top: moderateScale(13),
    right: moderateScale(13),
  },
  bottomLink: {
    marginTop: moderateScale(50, 0.1),
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom:
      Platform.OS == 'ios' ? moderateScale(120, 0.1) : moderateScale(50, 0.1),

    // position: 'absolute',
    // bottom:
    //   Platform.OS == 'ios' ? moderateScale(120, 0.1) : moderateScale(40, 0.1),
  },
  error: {
    color: 'red',
    fontSize: moderateScale(12, 0.1),
  },
});

export default styles;
