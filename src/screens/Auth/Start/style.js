import {Dimensions, StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const Poppins = 'Poppins-Regular';
const PoppinsBold = 'Poppins-Bold';

const styles = StyleSheet.create({
  icon: {
    width: 50,
    height: 50,
  },
  centerImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: moderateScale(-40, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: PoppinsBold,
    fontSize: moderateScale(12, 0.1),
    marginTop: moderateScale(5, 0.1),
  },
  headingContainer: {
    marginTop: moderateScale(20, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading1: {
    lineHeight: moderateScale(28, 0.1),
    color: '#fff',
    fontFamily: Poppins,
    fontSize: moderateScale(22, 0.1),
  },
  heading2: {
    lineHeight: moderateScale(35, 0.1),
    color: '#fff',
    fontFamily: PoppinsBold,
    fontSize: moderateScale(30, 0.1),
  },
  // Old One
  // animationView: {
  //   width: moderateScale(400, 0.1),
  //   height: moderateScale(400, 0.1),
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   position: 'relative',
  // },
  // circle1: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   position: 'absolute',
  //   borderWidth: moderateScale(4, 0.1),
  //   borderColor: '#FFD700',
  //   borderRadius: moderateScale(116 / 2, 0.1),
  //   width: moderateScale(116, 0.1),
  //   height: moderateScale(116, 0.1),
  // },
  // circle2: {
  //   position: 'absolute',
  //   borderWidth: moderateScale(1, 0.1),
  //   borderColor: '#FFD700',
  //   borderRadius: moderateScale(196 / 2, 0.1),
  //   width: moderateScale(196, 0.1),
  //   height: moderateScale(196, 0.1),
  // },
  // circle3: {
  //   position: 'absolute',
  //   borderWidth: moderateScale(1, 0.1),
  //   borderColor: '#FFD700',
  //   borderRadius: moderateScale(268 / 2, 0.1),
  //   width: moderateScale(268, 0.1),
  //   height: moderateScale(268, 0.1),
  // },
  // circle4: {
  //   position: 'absolute',
  //   borderWidth: moderateScale(1, 0.1),
  //   borderColor: '#FFD700',
  //   borderRadius: moderateScale(344 / 2, 0.1),
  //   width: moderateScale(344, 0.1),
  //   height: moderateScale(344, 0.1),
  // },
  // round: {
  //   borderColor: '#fff',
  //   top: moderateScale(100, 0.1),
  //   left: moderateScale(243, 0.1),
  //   borderRadius: moderateScale(16, 0.1),
  //   position: 'absolute',
  //   borderWidth: moderateScale(3, 0.1),
  //   borderRadius: moderateScale(50, 0.1),
  // },

  animationView: {
    width: moderateScale(400, 0.1),
    height: moderateScale(400, 0.1),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginTop: moderateScale(-20, 0.1),
  },
  circle1: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderWidth: moderateScale(4, 0.1),
    borderColor: '#FFD700',
    borderRadius: moderateScale(116 / 2, 0.1),
    width: moderateScale(100, 0.1),
    height: moderateScale(100, 0.1),
    zIndex: 1000,
  },
  circle2: {
    position: 'absolute',
    borderWidth: moderateScale(1, 0.1),
    borderColor: '#FFD700',
    borderRadius: moderateScale(196 / 2, 0.1),
    width: moderateScale(180, 0.1),
    height: moderateScale(180, 0.1),
    backgroundColor: '#ABB3BA',
    zIndex: 999,
  },
  circle3: {
    position: 'absolute',
    borderWidth: moderateScale(1, 0.1),
    borderColor: '#FFD700',
    borderRadius: moderateScale(268 / 2, 0.1),
    width: moderateScale(260, 0.1),
    height: moderateScale(260, 0.1),
    backgroundColor: '#838383',
    zIndex: 100,
  },
  circle4: {
    position: 'absolute',
    borderWidth: moderateScale(1, 0.1),
    borderColor: '#FFD700',
    borderRadius: moderateScale(344 / 2, 0.1),
    width: moderateScale(344, 0.1),
    height: moderateScale(344, 0.1),
    backgroundColor: '#4E4E4E',
    zIndex: 10,
  },
  round: {
    borderColor: '#fff',
    top: moderateScale(-20, 0.1),
    left: moderateScale(220 / 2, 0.1),
    borderRadius: moderateScale(16, 0.1),
    position: 'absolute',
    borderWidth: moderateScale(3, 0.1),
    borderRadius: moderateScale(50, 0.1),
  },
  btnText: {
    fontSize: moderateScale(13, 0.1),
    lineHeight: moderateScale(18, 0.1),
    fontFamily: Poppins,
    color: '#fff',
  },
  button: {
    position: 'absolute',
    bottom: moderateScale(30, 0.1),
  },
});

export default styles;
