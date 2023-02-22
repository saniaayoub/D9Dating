import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Poppins = 'Poppins-Regular';
const PoppinsBold = 'Poppins-Bold';

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: moderateScale(20, 0.1),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dp: {
    flex: 'row',
  },
 
  dp1: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(106 / 2, 0.1),
  },
  dp: {
    width: moderateScale(106, 0.1),
    height: moderateScale(106, 0.1),
    borderRadius: moderateScale(106 / 2, 0.1),
    marginBottom: moderateScale(10, 0.1),
  },
  circle: {
    padding: moderateScale(2, 0.1),
    backgroundColor: '#474646',
    width: moderateScale(25, 0.1),
    height: moderateScale(25, 0.1),
    borderRadius: moderateScale(25 / 2, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: moderateScale(10, 0.1),
    right: 0,
  },
  edit: {
    width: moderateScale(18, 0.1),
    height: moderateScale(18, 0.1),
    borderRadius: moderateScale(18 / 2, 0.1),
    // padding: moderateScale(5, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: moderateScale(1, 0.1),
  },
  username: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBold: {
    fontSize: moderateScale(20, 0.1),
    lineHeight: moderateScale(30, 0.1),
    fontFamily: PoppinsBold,
    marginRight: moderateScale(10, 0.1),
  },
  inputSection: {
    marginTop: moderateScale(20, 0.1),
    paddingHorizontal: moderateScale(25, 0.1),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: moderateScale(25, 0.1),
    borderTopRightRadius: moderateScale(25, 0.1),
  },
  icon: {
    marginRight: moderateScale(20, 0.1),
  },
  input: {
    marginVertical: moderateScale(15, 0.1),
  },
  radio: {
    marginHorizontal: moderateScale(15, 0.1),
    marginTop: moderateScale(-15, 0.1),
  },
  text: {
    fontFamily: PoppinsBold,
    fontSize: moderateScale(12, 0.1),
  },
  radioInput: {
    width: '100%',
    marginTop: moderateScale(15, 0.1),
    // marginBottom: moderateScale(100, 0.1),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  button: {
    marginTop: moderateScale(50, 0.1),
    marginBottom: moderateScale(100, 0.1),
  },
  capturebtntxt: {
    // alignSelf:'center',
    fontSize: moderateScale(13, 0.1),
    alignSelf: 'center',
    fontFamily: Poppins,
    color: '#fff',
    paddingHorizontal: moderateScale(7, 0.1),
  },
  capturebtnicon: {
    color: '#fff',
    fontSize: moderateScale(25),
  },
  capturebtn: {
    borderColor: '#302D2D',
    flexDirection: 'row',
    borderRadius: moderateScale(10, 0.1),
    width: moderateScale(180, 0.1),
    backgroundColor: '#302D2D',
  },
});

export default styles;
