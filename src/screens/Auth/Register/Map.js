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
import {useSelector, useDispatch,} from 'react-redux';
import {Marker} from 'react-native-maps';
import MapView, {PROVIDER_GOOGLE, animateToRegion} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Geocoder from 'react-native-geocoding';
import {moderateScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';
import Inicon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
let LONGITUDE;
let LATITUDE;

const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const Map = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loc, setLoc] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    // if (screen1) {
    //   console.log('ddd');
    //   dispatch(setPostLocation(loc));
    //   setTimeout(() => {
    //     navigation.goBack();
    //   }, 2000);
    // } else {
    //   console.log('rr');
    //   dispatch(setLocation(loc));
    //   setModalVisible(!isModalVisible);
    //   setTimeout(() => {
    //     navigation.goBack();
    //   }, 2000);
    // }
  };
  const screen1 = route.params;

  console.log(screen1, 'screen');
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
    console.log('get city name');
    Geocoder.from(newRegion.latitude, newRegion.longitude).then(json => {
      var addressComponent = json.results[0].address_components;
      console.log(
        addressComponent[1].short_name,
        addressComponent[2].short_name,
        'acc'
      );
      setLoc(addressComponent[1].short_name,addressComponent[2].short_name);
    });
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
  Geocoder.init('AIzaSyCYvOXB3SFyyeR0usVOgnLyoDiAd2XDunU');

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
    console.log(data,'aaa');
    // console.log(JSON.stringify(details.geometry.location), 'details');
    setLoc(data.description);
    Geocoder.from(data.description)
      .then(json => {
        const location = json.results[0].geometry.location;
        console.log(location.lat, location.lng);
        setMarkerPosition({
          latitude: location.lat,
          longitude: location.lng,
        });
        setPosition({
          latitude: location.lat,
          longitude: location.lng,
        });
      })
      .catch(error => console.warn(error));
    // setPosition(data.description);
  };
  const getCityName = async coordinate => {
    console.log('get city name');
    await Geocoder.from(coordinate)
      .then(json => {
        const cityName = json.results[0].address_components.find(ac =>
          ac.types.includes('locality'),
        ).long_name;
        console.log(cityName);
      })
      .catch(error => console.warn(error));
  };
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
        // provider={PROVIDER_GOOGLE}
        initialRegion={position}
        // showsUserLocation={true}
        customMapStyle={styles.map}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        onRegionChangeComplete={onMapRegionChange}
        rotateEnabled={true}>
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

            getCityName(coordinate);
          }}
        />
      </MapView>

      <View style={{position: 'absolute', top: 10, width: '100%'}}>
        <GooglePlacesAutocomplete
          styles={styles.searchbar}
          placeholder="Search"
          query={{
            key: 'AIzaSyCYvOXB3SFyyeR0usVOgnLyoDiAd2XDunU',
            language: 'en', // language of the results
          }}
          GooglePlacesDetailsQuery={{
            fields: 'geometry',
          }}
          
          fetchDetails={true}
          onPress={e => onPress(e)}
          onFail={error => console.error(error)}
          // requestUrl={{
          //   url:
          //     'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
          //   useOnPlatform: 'web',
          // }} // this in only required for use on the web. See https://git.io/JflFv more for details.
        />
      </View>
      <TouchableOpacity
        onPress={setModalVisible}
        style={{
          width: moderateScale(250, 0.1),
          height: moderateScale(38, 0.1),
          backgroundColor: '#FFD700',
          justifyContent: 'center',
          marginVertical: moderateScale(15, 0.1),
          borderRadius: moderateScale(12, 0.1),
          bottom: moderateScale(70,0.1)
        }}>
        <View>
          <Text
            style={{
              alignSelf: 'center',
              lineHeight: moderateScale(20, 0.1),
              fontSize: moderateScale(15, 0.1),
              color: '#222222',
            }}>
            {' '}
            Add location{' '}
          </Text>
        </View>
        <Modal isVisible={isModalVisible}>
          <View
            style={{
              height: moderateScale(300, 0.1),
              backgroundColor: 'white',
            }}>
            <View
              style={{
                marginVertical: moderateScale(25, 0.1),
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: moderateScale(15, 0.1),
                width: moderateScale(280,0.1)
              }}>
              <Text style={{fontSize: moderateScale(18, 0.1), color: 'black'}}>
                {' '}
                {loc}
              </Text>
              <View style={{marginRight: moderateScale(-50,0.1)}}>
                <Inicon
                  name="location"
                  size={moderateScale(30)}
                  color={'red'}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!isModalVisible);
                if (screen1) {
                  console.log('ddd');
                  dispatch(setPostLocation(loc));
                  setTimeout(() => {
                    navigation.goBack();
                  }, 2000);
                } else {
                  console.log('rr');
                  dispatch(setLocation(loc));
                  setModalVisible(!isModalVisible);
                  setTimeout(() => {
                    navigation.goBack();
                  }, 2000);
                }
              }}
              style={{
                width: moderateScale(250, 0.1),
                height: moderateScale(38, 0.1),
                backgroundColor: '#FFD700',
                justifyContent: 'center',
                marginVertical: moderateScale(15, 0.1),
                borderRadius: moderateScale(12, 0.1),
                alignSelf: 'center',
                top: moderateScale(15,0.1)
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  lineHeight: moderateScale(20, 0.1),
                  fontSize: moderateScale(15, 0.1),
                  color: '#222222',
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </TouchableOpacity>
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

export default Map;
