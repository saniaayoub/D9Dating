import React, {useState, useRef, useEffect} from 'react';
import {
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {setLocation} from '../../../Redux/actions';
import {setPostLocation} from '../../../Redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {Marker} from 'react-native-maps';
import MapView, {PROVIDER_GOOGLE, animateToRegion} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Geocoder from 'react-native-geocoding';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
let LONGITUDE;
let LATITUDE;

const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const App = ({navigation, route}) => {
  const screen1 = route.params;
  console.log(screen1);
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 24.946218,
    longitude: 67.005615,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapCenter, setMapCenter] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const onMapRegionChange = newRegion => {
    console.log(newRegion, 'new region');
    setMarkerPosition(newRegion);
    // if(screen1){
    //   console.log('ddd');
    //   dispatch(setPostLocation(newRegion))
    // }
    // else{
    //   console.log('rr');
    //   dispatch(setLocation(newRegion))
    //   // navigation.goBack()
    // }

    // dispatch(setLocation(newRegion))
  };

  const onMarkerDragEnd = event => {
    setMarkerPosition(event.nativeEvent.coordinate);
  };
  const [position, setPosition] = useState({
    latitude: 24.946218,
    longitude: 67.005615,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  Geocoder.init('AIzaSyD8i3TGGkBPF757aCT-w36E6zvSer3r2KE');

  useEffect(() => {
    Geolocation.getCurrentPosition(pos => {
      const crd = pos.coords;
      LATITUDE = crd.latitude;
      LONGITUDE = crd.longitude;
    });
  }, []);
  useEffect(() => {
    console.log('map');
  }, []);

  const onPress = (data, details) => {
    // setPosition(details.geometry.location);
    // setMarker(details.geometry.location);
  };
  // const getCityName = async (coordinate) => {
  //   const { latitude, longitude } = coordinate;
  //   try {
  //     const response = await Geocoder.from(latitude, longitude);
  //     const address = response.results[0].address_components;
  //     for (let i = 0; i < address.length; i++) {
  //       if (address[i].types.includes('locality')) {
  //         return address[i].long_name;

  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  function getLocation() {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        console.log(currentLongitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        console.log(currentLatitude);
        setMarkerPosition({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          longitudeDelta: 0.0421,
          latitudeDelta: 0.0922,
        });

        console.log(markerPosition, 'current marker position');
      },
      error => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={position}
        // showsUserLocation={true}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        onRegionChangeComplete={onMapRegionChange}
        rotateEnabled={true}
      >
        <Marker
          draggable
          coordinate={markerPosition}
          title="Yor are here"
          description="current Location"
          onPress={() => {
            console.log(markerPosition, 'before');
            setMarkerPosition(position);
            console.log(markerPosition, 'after');
          }}
          onDragEnd={e => {
            const coordinate = JSON.stringify(e.nativeEvent.coordinate);
            if (screen1) {
              console.log('ddd');
              dispatch(setPostLocation(coordinate));
              // setTimeout(() => {
              //   navigation.goBack()
              // }, 2000);
            } else {
              console.log('rr');
              dispatch(setLocation(coordinate));
              // setTimeout(() => {
              //   navigation.goBack()
              // }, 2000);
            }

            // getCityName(coordinate)
            alert(coordinate);
            // const city = getCityName(JSON.stringify(e.nativeEvent.coordinate,))
            // console.log(city,'city')
          }}
        />
      </MapView>

      <View style={{position: 'absolute', top: 10, width: '100%'}}>
        <GooglePlacesAutocomplete
          styles={styles.searchbar}
          placeholder="Search"
          query={{
            key: 'AIzaSyD8i3TGGkBPF757aCT-w36E6zvSer3r2KE',
            language: 'en', // language of the results
          }}
          GooglePlacesDetailsQuery={{
            fields: 'geometry',
          }}
          fetchDetails={true}
          onPress={onPress}
          onFail={error => console.error(error)}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
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
