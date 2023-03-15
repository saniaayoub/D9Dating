import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Poppins = 'Poppins-Regular';
const PoppinsBold = 'Poppins-Bold';

const styles = StyleSheet.create({
  container: {
    height: '93%',
  },
  stories: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateScale(5, 0.1),
    marginTop: moderateScale(10, 0.1),
  },
  dp: {
    width: moderateScale(40, 0.1),
    height: moderateScale(40, 0.1),
    borderRadius: moderateScale(40 / 2, 0.1),
    borderColor: 'red',
    borderWidth: moderateScale(1, 0.1),
    marginHorizontal: moderateScale(10, 0.1),
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
  col: {
    flexDirection: 'column',
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    marginBottom: moderateScale(5, 0.1),
  },
  name: {
    fontFamily: PoppinsBold,
    fontSize: moderateScale(13, 0.1),
    lineHeight: moderateScale(17, 0.1),
  },
  textRegular: {
    fontFamily: Poppins,
    fontSize: moderateScale(11, 0.1),
    lineHeight: moderateScale(14, 0.1),
    marginVertical: moderateScale(5, 0.1),
  },
  modal: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: moderateScale(22, 0.1),
    right: moderateScale(15, 0.1),
    zIndex: 100000,
    width: moderateScale(110, 0.1),
    borderWidth: moderateScale(2, 0.1),
    borderColor: '#222233',
    flexDirection: 'column',
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },

  img: {
    // width: '100%',
    // backgroundColor:'red',
    // height: moderateScale(250,0.1)
    // height: '55%'
  },
  optionView: {
    flexDirection: 'row',
    borderBottomWidth: moderateScale(1, 0.1),
    borderBottomColor: 'grey',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // padding: moderateScale(10, 0.1),
    // width: moderateScale(150, 0.1),
    paddingBottom: moderateScale(5, 0.1),
  },
  optionBtns: {
    fontSize: moderateScale(12, 0.1),
    fontFamily: Poppins,
    // marginLeft: moderateScale(15, 0.1),
    flex: 0.8,
  },
  options: {
    flex: 0.1,
    justifyContent: 'flex-start',
    marginTop: moderateScale(5, 0.1),
    marginRight: moderateScale(-12, 0.1),
  },
  likes: {
    backgroundColor: 'rgba(195, 195, 195, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    width: moderateScale(62, 0.1),
    height: moderateScale(25, 0.1),
    borderRadius: moderateScale(20, 0.1),
    top: moderateScale(20, 0.1),
    right: moderateScale(30, 0.1),
  },
  likesCount: {
    fontSize: moderateScale(8, 0.1),
    color: '#fff',
  },
  dp1: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(36 / 2, 0.1),
    zIndex: 101,
  },
  funView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: moderateScale(10, 0.1),
  },
  yellow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
  },
  round: {
    width: moderateScale(25, 0.1),
    height: moderateScale(25, 0.1),
    borderRadius: moderateScale(25 / 2, 0.1),
  },
  round2: {
    marginBottom: moderateScale(25, 0.1),
    marginLeft: moderateScale(-10, 0.1),
    width: moderateScale(14, 0.1),
    height: moderateScale(14, 0.1),
    borderRadius: moderateScale(14 / 2, 0.1),
  },

  count: {
    fontSize: moderateScale(7, 0.1),
    fontFamily: Poppins,
    color: '#000',
  },
  funText: {
    fontSize: moderateScale(11, 0.1),
    fontFamily: PoppinsBold,
  },
  footer: {
    marginHorizontal: moderateScale(10, 0.1),
    marginVertical: moderateScale(10, 0.1),
  },
});

export default styles;
