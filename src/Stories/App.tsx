import React, { useRef, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StoryType } from "./index";
import { useSelector } from "react-redux";
const { CubeNavigationHorizontal } = require("react-native-3dcube-navigation");
import styles from "./styles";
import StoryContainer from "./StoryContainer";

const Stories = (props) => {
  const theme =props.theme;
  const userToken = useSelector(state=> state.reducer.userToken)
  const color = theme === 'dark' ? '#fff' : '#222222';

  const [isModelOpen, setModel] = useState(false);
  
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const [storyColor, setStoryColor] = useState('green');
  const modalScroll = useRef(null);

  // useEffect(()=> {

  // }, [])

  const onStorySelect = (index) => {
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    setModel(false);
  };

  const onStoryNext = (isScroll: boolean) => {
    const newIndex = currentUserIndex + 1;
    if (props.data.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        //erro aqui
        try {
          modalScroll?.current?.scrollTo(newIndex, true);
        } catch (e) {
          console.warn("error=>", e);
        }
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll: boolean) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll?.current?.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log("next");
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious(false);
      console.log("previous");
      setCurrentScrollValue(scrollValue);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={props.data}
        horizontal
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => (
          <View style={styles.boxStory}>
            <TouchableOpacity onPress={() => {
              if(props.setColorFun){
 props.setColorFun('grey')
              }
             
              onStorySelect(index);
              setStoryColor('grey')
             console.log('index',item, index, currentUserIndex)}
           }
              >
              <View style={[styles.superCircle, props.containerAvatarStyle, {borderColor:props.color? props.color:storyColor}]}>
                <Image
                  style={[styles.circle, props.avatarStyle]}
                  source={{ uri: item.profile }}
                />
              </View>

              <Text style={[styles.title, props.titleStyle, {color:color}]}>{item.title}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll?.current?.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}
      >
        <CubeNavigationHorizontal
          callBackAfterSwipe={(g) => onScrollChange(g)}
          ref={modalScroll}
          style={styles.container}
        >
          {props.data.map((item, index) => (
            <StoryContainer
              key={item.title}
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              dataStories={item}
              isNewStory={index !== currentUserIndex}
              textReadMore={props.textReadMore}
              deleteFunc={props.deleteFunc}
              navigation={props.navigation}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};


export default Stories;