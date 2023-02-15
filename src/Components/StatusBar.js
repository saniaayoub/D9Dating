import {StyleSheet, StatusBar, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const MyStatusBar = ({backgroundColor, ...props}) => {
  return (
    <View style={[{backgroundColor}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );
};

export default MyStatusBar;
