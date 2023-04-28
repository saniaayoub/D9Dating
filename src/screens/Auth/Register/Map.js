import React, {useState, useRef, useEffect} from 'react';
import {
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
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
import {moderateScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';
import Inicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
let LONGITUDE;
let LATITUDE;

const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const Map = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loc, setLoc] = useState(null);
  const searchBarRef = useRef();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const screen1 = route.params;

  console.log(screen1, 'screen');
  const dispatch = useDispatch();
  const mapRef = useRef();
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 51.50853,
    longitude: -0.12574,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const onMapRegionChange = newRegion => {
    console.log(newRegion, 'new region');
    setMarkerPosition(newRegion);
    console.log('get city name');
    Geocoder.from(newRegion.latitude, newRegion.longitude).then(json => {
      var addressComponent = json.results[0].address_components;
      console.log(json.results, 'acc');
      setLoc(
        addressComponent[1].short_name + ' ' + addressComponent[2].short_name,
      );
    });

  };

  const [position, setPosition] = useState({
    latitude: 51.50853,
    longitude: -0.12574,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  Geocoder.init('AIzaSyCYvOXB3SFyyeR0usVOgnLyoDiAd2XDunU');

  const requestGeolocationPermission = async () => {
    console.log('request');
    console.log(loc, 'loc');
    if (Platform.OS === 'ios') {
      console.log('ios');
      // getOneTimeLocation();
      // subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation()
          
        } else {
          console.log('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    
  };
    // try {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   );
    //   console.log(granted,'gran');
    //     if (granted == true) {   
    //       Alert.alert('D9Dating is accessing your location');
    //       Geolocation.getCurrentPosition(pos => {
    //         console.log('inner');
    //         getCity(pos.coords.latitude, pos.coords.longitude)
    //         // console.log(pos.coords.longitude, 'longitude' );
    //         setPosition({
    //           latitude: pos.coords.latitude,
    //           longitude: pos.coords.longitude,
    //           latitudeDelta: 0.0922,
    //           longitudeDelta: 0.0421,
    //         });
    //         setMarkerPosition({
    //           latitude: pos.coords.latitude,
    //           longitude: pos.coords.longitude,
    //           latitudeDelta: 0.0922,
    //           longitudeDelta: 0.0421,
    //         });
    //         mapRef.current.animateToRegion({
    //           latitude: pos.coords.latitude,
    //           longitude: pos.coords.longitude,
    //           latitudeDelta: 0.0922,
    //           longitudeDelta: 0.0421,
    //         });
           
    //         console.log(pos, 'possgg');
    //       });
    //     } else {
    //       console.log('Geolocation permission denied');
    //       setPosition({
    //         latitude: 51.50853,
    //         longitude: -0.12574,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       });
    //       setMarkerPosition({
    //         latitude: 51.50853,
    //         longitude: -0.12574,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       });
    //       mapRef.current.animateToRegion({
    //         latitude: 51.50853,
    //         longitude: -0.12574,
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       });
    //     }
   
    // } catch (err) {
    //   console.warn(err);
    // }
  };
  const getOneTimeLocation = () => {
    console.log('get one time');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    
  };
  const getCity = async (lat, long)=>{
    console.log('getcity');
    Geocoder.from(lat, long).then(json => {
      var addressComponent = json.results[0].address_components;
      console.log(json.results, 'acc');
      setLoc(
        addressComponent[1].short_name + ' ' + addressComponent[2].short_name,
      );
    });
    
  }
  const checkGeolocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log(granted, 'granted');
      if (granted === true) {
        console.log('You can use the geolocation');
        Geolocation.getCurrentPosition(pos => {
          // console.log(pos.coords.longitude, 'longitude' );
          setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setMarkerPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          mapRef.current.animateToRegion({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          Geocoder.from(pos.coords.latitude, pos.coords.longitude).then(json => {
            var addressComponent = json.results[0].address_components;
            console.log(json.results, 'current location address');
            setLoc(
              addressComponent[1].short_name + ' ' + addressComponent[2].short_name,
            );
          })
          console.log(pos, 'possgg');
        });
      } else {
        console.log('Geolocation permission denied');
        setPosition({
          latitude: 51.50853,
          longitude: -0.12574,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setMarkerPosition({
          latitude: 51.50853,
          longitude: -0.12574,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        mapRef.current.animateToRegion({
          latitude: 51.50853,
          longitude: -0.12574,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    console.log('he');
    checkGeolocationPermission();
  }, []);

  const onPress = (data, details) => {
    console.log(data, 'aaa');
    setLoc(data.description);
    Geocoder.from(data.description)
      .then(json => {
        const location = json.results[0].geometry.location;
        console.log(location.lat, location.lng, 'position');

        setMarkerPosition({
          latitude: location.lat,
          longitude: location.lng,
        });
        mapRef.current.animateToRegion({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={position}
        // showsUserLocation={true}
        customMapStyle={styles.map}
        followsUserLocation={true}
        showsCompass={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        onRegionChangeComplete={onMapRegionChange}
        rotateEnabled={true}
      >
        <Marker
          // draggable
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

      <View
        style={{
          position: 'absolute',
          top: 10,
          justifyContent: 'center',
          // alignItems: 'center'
          width: '95%',
          flexDirection: 'column',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Inicon
            name="arrow-back-circle-outline"
            size={moderateScale(30)}
            color={'#000'}
          />
        </TouchableOpacity>

        <GooglePlacesAutocomplete
          ref={searchBarRef}
          styles={{
            textInput: {
              height: moderateScale(38, 0.1),

              color: 'black',
              fontSize: moderateScale(16, 0.1),
            },
          }}
          renderRow={rowData => {
            const title = rowData.structured_formatting.main_text;
            const address = rowData.structured_formatting.secondary_text;
            return (
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  height: moderateScale(30, 0.1),
                }}
              >
                <Text
                  style={{fontSize: moderateScale(15, 0.1), color: 'black'}}
                >
                  {title} {address}
                </Text>
              </View>
            );
          }}
          renderRightButton={() => {
            return (
              <TouchableOpacity
                onPress={() => {
                  searchBarRef?.current?.clear();
                }}
                style={{
                  backgroundColor: '#fff',
                  alignItems: 'center',
                  height: moderateScale(38, 0.1),

                  padding: moderateScale(5, 0.1),
                  borderTopRightRadius: moderateScale(10, 0.1),
                  borderBottomRightRadius: moderateScale(10, 0.1),
                }}
              >
                <Entypo
                  name="cross"
                  size={moderateScale(25, 0.1)}
                  color={'grey'}
                />
              </TouchableOpacity>
            );
          }}
          placeholder="Search"
          textInputProps={{placeholderTextColor: 'black'}}
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
          // }}
          // this in only required for use on the web. See https://git.io/JflFv more for details.
        />
        <View>
          <TouchableOpacity
            onPress={() => requestGeolocationPermission()}
            style={{
              flexDirection: 'row',
              // borderBottomWidth: moderateScale(1, 0.1),
              // borderBottomColor: 'grey',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              height: moderateScale(35, 0.1),
              borderRadius: moderateScale(5, 0.1),
              // // padding: moderateScale(10, 0.1),
              // // width: moderateScale(150, 0.1),
              // marginTop: moderateScale(50, 0.1),
              // paddingBottom: moderateScale(5, 0.1),
            }}
          >
            <FontAwesome
              name={'location-arrow'}
              color="red"
              size={moderateScale(20, 0.1)}
            />
            <Text
              style={{
                color: 'red',
                paddingLeft: moderateScale(15, 0.1),
                fontSize: moderateScale(14, 0.1),
              }}
            >
              Use my current location
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          // setModalVisible(!isModalVisible);
          console.log(loc, 'log');
          if (loc != null) {
            setModalVisible(!isModalVisible);
          } else {
            Alert.alert('Please select location');
          }
        }}
        style={{
          width: moderateScale(250, 0.1),
          height: moderateScale(38, 0.1),
          backgroundColor: '#FFD700',
          justifyContent: 'center',
          marginVertical: moderateScale(15, 0.1),
          borderRadius: moderateScale(12, 0.1),
          bottom:
            Platform.OS == 'ios'
              ? moderateScale(100, 0.1)
              : moderateScale(70, 0.1),
        }}
      >
        <View>
          <Text
            style={{
              alignSelf: 'center',
              lineHeight: moderateScale(20, 0.1),
              fontSize: moderateScale(15, 0.1),
              color: '#222222',
            }}
          >
            {' '}
            Add location{' '}
          </Text>
        </View>

        <Modal isVisible={isModalVisible}>
          <View
            style={{
              height: moderateScale(300, 0.1),
              backgroundColor: 'white',
              borderRadius: moderateScale(10, 0, 1),
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(!isModalVisible)}
              style={{alignItems: 'flex-end', padding: moderateScale(10, 0.1)}}
            >
              <Entypo name="cross" size={moderateScale(30)} color={'grey'} />
            </TouchableOpacity>
            <View
              style={{
                marginVertical: moderateScale(25, 0.1),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: moderateScale(20, 0.1),
                width: '80%',
              }}
            >
              <Text
                style={{
                  fontSize: moderateScale(18, 0.1),
                  marginRight: moderateScale(10, 0.1),
                  color: 'black',
                }}
              >
                {loc}
              </Text>
              <View style={{marginRight: moderateScale(-50, 0.1)}}>
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
                if (screen1?.from == 'createPost') {
                  console.log('create post');
                  dispatch(setPostLocation(loc));
                  setTimeout(() => {
                    navigation.goBack();
                  }, 2000);
                } else if (screen1?.from == 'register') {
                  console.log('register');
                  dispatch(setLocation(loc));
                  // setModalVisible(!isModlVisible);
                  setTimeout(() => {
                    navigation.goBack();
                  }, 2000);
                } else if(screen1?.from == 'user'){
                  console.log('user');
                  dispatch(setLocation(loc));
                  // setModalVisible(!isModlVisible);
                  setTimeout(() => {
                    navigation.navigate('Profile', {
                      data: 'map',
                    });
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
                top: moderateScale(15, 0.1),
              }}
            >
              <Text
                style={{
                  alignSelf: 'center',
                  lineHeight: moderateScale(20, 0.1),
                  fontSize: moderateScale(15, 0.1),
                  color: '#222222',
                }}
              >
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