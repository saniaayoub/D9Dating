import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Poppins = '';
const PoppinsBold = '';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(12, 0.1),
    height: '100%',
    // paddingEnd: moderateScale(-20,0.1),
    // flexDirection: 'column',
    // justifyContent: 'flex-start',
    paddingBottom: moderateScale(70, 0.1),
  },
  HeadingText: {
    fontSize: moderateScale(20, 0.1),
    //fontFamily: PoppinsBold,
    lineHeight: moderateScale(30, 0.1),
  },
  dp1: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(36 / 2, 0.1),
  },
  smallDp: {
    width: moderateScale(25, 0.1),
    height: moderateScale(25, 0.1),
    borderRadius: moderateScale(25 / 2, 0.1),
    borderWidth: moderateScale(2, 0.1),
    marginLeft: moderateScale(10, 0.1),
  },
  border: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: moderateScale(10, 0.1),
    borderBottomWidth: moderateScale(2, 0.1),
  },
  btn: {
    flex: 0.5,
  },
  input: {
    flex: 1,
    marginBottom: 100,
  },
  chats: {
    fontSize: moderateScale(13, 0.1),
    lineHeight: moderateScale(18, 0.1),
    //fontFamily: Poppins,
  },
  dp: {
    width: moderateScale(53, 0.1),
    height: moderateScale(53, 0.1),
    borderRadius: moderateScale(53 / 2, 0.1),
    borderWidth: moderateScale(2, 0.1),
    marginRight: moderateScale(10, 0.1),
  },
  userName: {
    marginBottom: moderateScale(25, 0.1),
    marginTop: moderateScale(2, 0.1),
    fontSize: moderateScale(10, 0.1),
  },
  addBtn: {
    width: moderateScale(11, 0.1),
    height: moderateScale(11, 0.1),
    zIndex: 1000,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: moderateScale(8, 0.1),
    right: moderateScale(5, 0.1),
    borderRadius: moderateScale(11 / 2, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  myStory: {
    width: moderateScale(65, 0.1),
    height: moderateScale(65, 0.1),
    marginTop: moderateScale(10, 0.1),
    marginLeft: moderateScale(12, 0.1),
  },
  dp1: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(53 / 2, 0.1),
  },
  col: {
    flexDirection: 'column',
  },
  card: {
    flexDirection: 'row',
    width: '100%',
    height: moderateScale(57, 0.1),
    marginVertical: moderateScale(10, 0.1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    //fontFamily: PoppinsBold,
    fontSize: moderateScale(13, 0.1),
    lineHeight: moderateScale(15, 0.1),
  },
  details: {
    width: moderateScale(200, 0.1),
    // height: moderateScale(58, 0.1),
    // backgroundColor:'gray',
    flexDirection: 'column',
    marginTop: moderateScale(5, 0.1),
  },
  caption: {
    flexDirection: 'row',
    marginTop: moderateScale(10, 0.1),
    borderBottomColor: 'grey',
    borderBottomWidth: moderateScale(1, 0.1),
    paddingVertical: moderateScale(10, 0.1),
  },
  name1: {
    //fontFamily: Poppins,
    fontSize: moderateScale(10, 0.1),
    lineHeight: moderateScale(15, 0.1),
    // paddingLeft: moderateScale(10),
    alignSelf: 'center',
    color: '#7B7A7A',
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
    lineHeight: moderateScale(13, 0.1),
    marginVertical: moderateScale(5, 0.1),
  },
  img: {
    width: '100%',
  },
  icon: {
    justifyContent: 'center',
    paddingTop: moderateScale(5, 0.1),
    paddingLeft: moderateScale(15, 0.1),
    flexDirection: 'row',
  },
  hTxt: {
    color: '#7B7A7A',
    //fontFamily: Poppins,
    fontSize: moderateScale(10, 0.1),
    lineHeight: moderateScale(15, 0.1),
  },
  hTxt1: {
    color: '#FFFFFF',
    fontSize: moderateScale(15, 0.1),
    lineHeight: moderateScale(22, 0.1),
    //fontFamily: Poppins,
    fontWeight: '700',
  },
  hView: {
    marginVertical: moderateScale(15, 0.1),
    top: moderateScale(15, 0.1),
  },
});

export default styles;
