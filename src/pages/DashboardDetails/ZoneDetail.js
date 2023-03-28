import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

import AppStyle from '../../style/AppStyle';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ZoneModal from '../../components/ZoneModal';
import DriveService from '../../services/DriveService';

export default class ZoneDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showModal: false,
    };
  }

  UNSAFE_componentWillMount() {}

  onPressDrive = (drive) => {
    console.log(drive);
    this.setState({selectedDrive: drive, showDrivePopup: true});
  };

  renderVolunteer = (item, index) => {
    const imageUrl = item.image_url
      ? {uri: item.image_url}
      : require('../../assets/images/user_male.png');

    return <Image key={index} source={imageUrl} style={[styles.avtarImage]} />;
  };

  onPressZone = () => {
    this.setState({showModal: true});
  };

  render() {
    const zoneDetail = this.props.zoneDetail;
    console.log('Zone Detail', zoneDetail);

    if (!zoneDetail) {
      return null;
    }

    const {snapshopDetail} = zoneDetail;

    return (
      <View>
        <TouchableOpacity
          style={[
            {backgroundColor: '#fff', borderRadius: 5, marginVertical: 5},
            styles.boxWithShadow,
          ]}
          onPress={this.onPressZone}>
          <View style={{height: 120, borderRadius: 5}}>
            <MapView
              pitchEnabled={false}
              rotateEnabled={false}
              zoomEnabled={false}
              scrollEnabled={false}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: 23.0271619,
                longitude: 72.5175667,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />
            <View
              style={[
                {
                  top: 20,
                  borderRadius: 10,
                  marginLeft: 10,
                  paddingHorizontal: 10,
                  position: 'absolute',
                },
                AppStyle.primaryBackgroundColor,
              ]}>
              <Text
                style={[AppStyle.boldFamily, {fontSize: 10, color: '#fff'}]}>
                {snapshopDetail.zonedetails.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                top: 10,
                right: 10,
                zIndex: 99,
                position: 'absolute',
              }}>
              {snapshopDetail.robins.slice(0, 4).map((item, index) => {
                return this.renderVolunteer(item, index);
              })}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 5,
            }}>
            <View style={{alignItems: 'center'}}>
              <Text style={[AppStyle.semiBoldFamily, {fontSize: 12}]}>
                {snapshopDetail.total_count_serve}
              </Text>
              <Text
                style={[
                  AppStyle.semiBoldFamily,
                  {fontSize: 12, color: '#414A4F'},
                ]}>
                People Served
              </Text>
            </View>
            <View style={{backgroundColor: '#D8D8D8', width: 1}} />
            <View style={{marginHorizontal: 5, alignItems: 'center'}}>
              <Text style={[AppStyle.semiBoldFamily, {fontSize: 12}]}>
                {snapshopDetail.total_no_of_volunteers}
              </Text>
              <Text
                style={[
                  AppStyle.semiBoldFamily,
                  {fontSize: 12, color: '#414A4F'},
                ]}>
                Volunteers
              </Text>
            </View>
            <View style={{backgroundColor: '#D8D8D8', width: 1}} />
            <View style={{marginHorizontal: 5, alignItems: 'center'}}>
              <Text style={[AppStyle.semiBoldFamily, {fontSize: 12}]}>
                {snapshopDetail.tota_my_drive}/{snapshopDetail.tota_drive}
              </Text>
              <Text
                style={[
                  AppStyle.semiBoldFamily,
                  {fontSize: 12, color: '#414A4F'},
                ]}>
                My Drives
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <ZoneModal
          showModal={this.state.showModal}
          duration={this.props.duration}
          zoneDetail={zoneDetail}
          onClose={() => {
            this.setState({showModal: false});
          }}
          onItemPress={(drive) => {
            this.setState({showModal: false});
            this.props.navigation.navigate('DriveDetail', {
              driveDetail: drive,
              zoneDetail: zoneDetail,
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: '#71c89e',
    borderWidth: 0.75,
  },
  formContainer: {
    left: '10%',
    marginTop: 20,
  },

  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
  },
});
