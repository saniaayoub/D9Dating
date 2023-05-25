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
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import {moderateScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';
import Inicon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useIsFocused, useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
let LONGITUDE;
let LATITUDE;

const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const Map = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const [position, setPosition] = useState({
    latitude: 51.50853,
    longitude: -0.12574,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [loc, setLoc] = useState('London Greater London');
  const [markerPosition, setMarkerPosition] = useState(position);
  const searchBarRef = useRef();

  const screen1 = route.params;

  console.log(screen1, 'screen');
  const dispatch = useDispatch();
  const mapRef = useRef();

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

  useEffect(() => {
    Geocoder.init('AIzaSyCYvOXB3SFyyeR0usVOgnLyoDiAd2XDunU');
  }, []);

  const requestGeolocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
    } else {
      try {
        const grantCheck = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        console.log('granteCheck', grantCheck);
        if (grantCheck === false) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          console.log('granted', granted);
          if (granted == PermissionsAndroid.RESULTS.GRANTED) {
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
              Geocoder.from(pos.coords.latitude, pos.coords.longitude).then(
                json => {
                  var addressComponent = json.results[0].address_components;
                  console.log(json.results, 'current location address');
                  setLoc(
                    addressComponent[1].short_name +
                      ' ' +
                      addressComponent[2].short_name,
                  );
                },
              );
              console.log(pos, 'possgg');
            });
          }
        } else {
          Alert.alert('D9Dating is accessing your location');
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
            Geocoder.from(pos.coords.latitude, pos.coords.longitude).then(
              json => {
                var addressComponent = json.results[0].address_components;
                console.log(json.results, 'current location address');
                setLoc(
                  addressComponent[1].short_name +
                    ' ' +
                    addressComponent[2].short_name,
                );
              },
            );
            console.log(pos, 'possgg');
          });
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  // const getOneTimeLocation = () => {
  //   console.log('get one time');
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       // const { latitude, longitude } = position.coords;
  //       console.log(position.coords.latitude, 'latitude');
  //     },
  //     error => {
  //       console.log(error.code, error.message);
  //     },
  //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //   );
  // };
  const getCity = async coordinate => {
    console.log('get city name');
    await Geocoder.from(coordinate)
      .then(json => {
        const cityName = json.results[0].address_components.find(
          ac => ac.types.includes('locality').long_name,
        );
        console.log(cityName, 'sania');
        setLoc(cityName);
        return cityName;
      })
      .catch(error => console.warn(error));
  };
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
          Geocoder.from(pos.coords.latitude, pos.coords.longitude).then(
            json => {
              var addressComponent = json.results[0].address_components;
              console.log(json.results, 'current location address');
              setLoc(
                addressComponent[1].short_name +
                  ' ' +
                  addressComponent[2].short_name,
              );
            },
          );
          console.log(pos, 'possgg');
        });
      } else {
        // getCity(loc);
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
    Geocoder.init('AIzaSyCYvOXB3SFyyeR0usVOgnLyoDiAd2XDunU');
    checkGeolocationPermission();
  }, [isFocused]);

  const onPress = (data, details) => {
    console.log(data, 'aaa');
    setLoc(data.description);
    Geocoder.from(data.description)
      .then(json => {
        const location = json.results[0].geometry.location;
        // console.log(location.lat, location.lng, 'position');

        setMarkerPosition({
          latitude: location.lat,
          longitude: location.lng,
        });
        // setLoc({
        //   latitude: location.lat,
        //   longitude: location.lng,
        // });
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
        console.log(cityName, 'aaaaa');
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

      <View
        style={{
          position: 'absolute',
          top: 10,
          justifyContent: 'center',
          // alignItems: 'center'
          width: '95%',
          flexDirection: 'column',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Inicon
            name="arrow-back-circle-outline"
            size={moderateScale(30)}
            color={'black'}
          />
        </TouchableOpacity>

        <GooglePlacesAutocomplete
          ref={searchBarRef}
          styles={{
            textInput: {
              height: moderateScale(38, 0.1),
              borderRadius: moderateScale(0, 0.1),
              backgroundColor: '#fff',
              borderTopLeftRadius: moderateScale(12, 0.1),
              borderBottomLeftRadius: moderateScale(12, 0.1),
              color: '#000',
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
                }}>
                <Text
                  style={{fontSize: moderateScale(15, 0.1), color: 'black'}}>
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
                  backgroundColor: 'white',
                  alignItems: 'center',
                  height: moderateScale(38, 0.1),

                  padding: moderateScale(5, 0.1),
                  borderTopRightRadius: moderateScale(12, 0.1),
                  borderBottomRightRadius: moderateScale(12, 0.1),
                }}>
                <Entypo
                  name="cross"
                  size={moderateScale(25, 0.1)}
                  color={'#000'}
                />
              </TouchableOpacity>
            );
          }}
          placeholder="Search"
          textInputProps={{
            placeholderTextColor: '#000',
          }}
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
        />
      </View>
      <View
        style={{
          position: 'absolute',
          // alignSelf: 'flex-end',
          paddingHorizontal: moderateScale(20, 0.1),
          paddingRight: moderateScale(25, 0.1),
          marginVertical: moderateScale(15, 0.1),
          bottom: moderateScale(120, 0.1),
          backgroundColor: 'rgba(255, 255, 0, 0.4)',
          right: moderateScale(20, 0.1),
          borderRadius: moderateScale(40, 0.1) / 2,
          // opacity: moderateScale(0.5, 0.1),
        }}>
        <TouchableOpacity onPress={() => requestGeolocationPermission()}>
          <MaterialIcon
            name={'my-location'}
            color="red"
            size={moderateScale(40, 0.1)}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          console.log(loc, 'log');
          // getCity(loc);
          setModalVisible(!isModalVisible);
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
              : moderateScale(50, 0.1),
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
              height: moderateScale(200, 0.1),
              backgroundColor: 'white',
              borderRadius: moderateScale(10, 0, 1),
            }}>
            <TouchableOpacity
              onPress={() => setModalVisible(!isModalVisible)}
              style={{alignItems: 'flex-end', padding: moderateScale(10, 0.1)}}>
              <Entypo name="cross" size={moderateScale(30)} color={'grey'} />
            </TouchableOpacity>
            <View
              style={{
                // marginVertical: moderateScale(20, 0.1),
                flexDirection: 'row',
                // alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: moderateScale(20, 0.1),
                width: '80%',
              }}>
              <Text
                style={{
                  fontSize: moderateScale(18, 0.1),
                  marginRight: moderateScale(10, 0.1),
                  alignSelf: 'center',
                  color: 'black',
                }}>
                {loc}
              </Text>
              <View
                style={{
                  marginRight: moderateScale(-50, 0.1),
                  // alignSelf: 'center',
                  // paddingBottom:
                }}>
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
                  setTimeout(() => {
                    navigation.goBack();
                  }, 2000);
                } else if (screen1?.from == 'user') {
                  console.log('user');
                  dispatch(setLocation(loc));
                  setTimeout(() => {
                    navigation.navigate('Profile', {
                      data: 'map',
                    });
                  }, 2000);
                }
              }}
              style={{
                width: moderateScale(150, 0.1),
                height: moderateScale(38, 0.1),
                backgroundColor: '#FFD700',
                justifyContent: 'center',
                borderRadius: moderateScale(12, 0.1),
                alignSelf: 'center',
                marginVertical: moderateScale(20, 0.1),
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
