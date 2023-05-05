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
import MapView, {Polyline} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Geocoder from 'react-native-geocoding';
import {moderateScale} from 'react-native-size-matters';
import Modal from 'react-native-modal';
import Inicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
const Map = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loc, setLoc] = useState(null);
  const searchBarRef = useRef();

  const defaultStart = {latitude: 37.78825, longitude: -122.4324};
  const defaultDestination = {latitude: 37.72825, longitude: -122.4324};
  const coordinates = [
    defaultStart,
    {latitude: 37.75825, longitude: -122.4624},
    defaultDestination,
  ];
  const destination = coordinates[coordinates.length - 1];
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
  return (
    <MapView
      style={{flex: 1}}
      initialRegion={{
        latitude: defaultStart.latitude,
        longitude: defaultStart.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
      <Polyline
        coordinates={coordinates}
        strokeColor="red"
        strokeColors={[
          '#7F0000',
          '#00000000',
          '#B24112',
          '#E5845C',
          '#238C23',
          '#7F0000',
        ]}
        strokeWidth={6}
      />
      <Marker coordinate={defaultStart}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>Start</Text>
        </View>
      </Marker>
      <Marker coordinate={defaultDestination}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>Destination</Text>
        </View>
      </Marker>
    </MapView>
  );
};

const styles = StyleSheet.create({
  marker: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 5,
  },
  markerText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Map;
