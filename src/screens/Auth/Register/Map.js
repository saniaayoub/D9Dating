import React, { useState, useRef, useEffect } from 'react';
import { Button, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Marker } from "react-native-maps";
import MapView from "react-native-maps";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome5';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const App = () => {
  const mapRef = useRef()
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [mapCenter, setMapCenter] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const onMapRegionChange = (newRegion) => {
    setMapCenter(newRegion);
  };

  const onMarkerDragEnd = (event) => {
    setMarkerPosition(event.nativeEvent.coordinate);
  };
  // const [position, setPosition] = useState({
  //   latitude: 24.946218,
  //   longitude:  67.005615,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // });


  // useEffect(() => {
  //   Geolocation.getCurrentPosition((pos) => {
  //     const crd = pos.coords;
  //     setPosition({
  //       latitude: crd.latitude,
  //       longitude: crd.longitude,
  //       latitudeDelta: 0.0421,
  //       longitudeDelta: 0.0421,
  //     });
  //   })
  // }, []);

  const onPress = (data, details) => {
    // setPosition(details.geometry.location);
    // setMarker(details.geometry.location);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={mapCenter}
        
        onRegionChange={onMapRegionChange}
      >
        <Marker
          draggable
          coordinate={markerPosition}
          onDragEnd={onMarkerDragEnd}
        />
      </MapView>
      {/* <MapView
      style={styles.map}
      initialRegion={position}
      showsUserLocation={true}
      followsUserLocation={true}
      showsCompass={true}
      scrollEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      onRegionChangeComplete={()=>setPosition(position)}
      rotateEnabled={true}>
       <Marker
       coordinate={position}
       title='Yor are here'
       description='current Location'
       draggable
       onDragEnd = { e => alert(JSON.stringify(e.nativeEvent.coordinate,))}
       />
       </MapView> */}

      <View style={{ position: 'absolute', top: 10, width: '100%' }}>
        <GooglePlacesAutocomplete
          styles={styles.searchbar}
          placeholder="Search"
          query={{
            key: "AIzaSyD8i3TGGkBPF757aCT-w36E6zvSer3r2KE",
            language: 'en', // language of the results
          }}
          GooglePlacesDetailsQuery={{
            fields: 'geometry',
          }}
          fetchDetails={true}
          onPress={onPress}
          onFail={(error) => console.error(error)}
        // requestUrl={{
        //   url:
        //     'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
        //   useOnPlatform: 'web',
        // }} // this in only required for use on the web. See https://git.io/JflFv more for details.
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
    position: 'relative'
  },
  map: {
    ...StyleSheet.absoluteFillObject,

  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',


  },
});

export default App;

