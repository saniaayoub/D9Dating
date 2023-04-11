import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Antdesign from 'react-native-vector-icons/AntDesign';
import moderateScale from 'react-native-size-matters';

type Props = {
  onReadMore: () => void;
  title: string;
};

export default memo(function Readmore({ onReadMore, title }: Props) {
  return (
    <TouchableOpacity onPress={onReadMore} style={styles.readMoreWrapper}>
      <View style={styles.readMore}>
      <Antdesign
                  name={'delete'}
                  size={15}
                  color={'#fff'}
                />
      </View>
      {/* <Text style={styles.readText}>{title ? title : "Read more"}</Text> */}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  readMore: {
    width: 35,
    height: 35,
    borderRadius: 35/2,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
  },
  readText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  readMoreWrapper: {
    position: "absolute",
    bottom: 25,
    width: "98%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
