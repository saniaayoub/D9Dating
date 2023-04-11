import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
const styles = new StyleSheet.create({
  boxStory: {
    marginLeft: 15,
  },
  ItemSeparator: {height: 1, backgroundColor: '#ccc'},
  container: {
    flex: 1,
    // backgroundColor: 'rgba(255,255,255,255)',
    paddingBottom: 5,
  },
  circle: {
    width: moderateScale(65, 0.1),
    height: moderateScale(65, 0.1),
    borderRadius: moderateScale(65 / 2, 0.1),
    borderWidth: moderateScale(3, 0.1),
    // borderColor: '#FFF',
  },
  superCircle: {
    borderWidth: 3,

    borderRadius: 60,
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(10, 0.1),
    textAlign: 'center',
    marginTop: moderateScale(5, 0.1),
  },
});

export default styles;
