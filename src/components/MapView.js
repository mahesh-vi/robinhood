import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import moment from 'moment';
import AppStyle from '../style/AppStyle';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

export const Map = ({style, data}) => {
  const lat = parseFloat(data.latitude);
  const lon = parseFloat(data.longitude);

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => {
          const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
          });
          const latLng = `${lat},${lon}`;
          const label = data.name;
          const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
          });

          Linking.openURL(url);
        }}>
        <MapView
          pitchEnabled={false}
          rotateEnabled={false}
          zoomEnabled={true}
          scrollEnabled={false}
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={style}
          region={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lon,
            }}
            title={data.name}
            description={data.description}
            image={require('../assets/images/map_marker.png')}
          />
        </MapView>
      </TouchableWithoutFeedback>
    </View>
  );
};
