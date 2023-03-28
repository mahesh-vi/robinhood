import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import AppStyle from '../../style/AppStyle';
import AsyncStorage from '@react-native-community/async-storage';

import FeatherIcon from 'react-native-vector-icons/Feather';

import DriveService from '../../services/DriveService';
import GeolocationService from 'react-native-geolocation-service';
import SectionHeader from '../../components/SectionHeader';

import DriveMap from '../../components/DriveMap';

export default class RecentCompleted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showDriveMap: false,
    };
  }

  UNSAFE_componentWillMount = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Robinhood location Permission',
            message:
              'Robinhood needs access to your location for find near food donation drive.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      this.getLocation();
    }

    // this.getDrives();
  };

  getLocation = async () => {
    // Geolocation.getCurrentPosition(async (location) => {
    //     console.log("Nearby drive", location);
    //     let token = await AsyncStorage.multiSet([['lastLocation', JSON.stringify(location)]]);
    //     this.getDrives(location);

    // }, async (error) => {
    //     const lastLocation = await AsyncStorage.getItem('lastLocation');
    //     console.log('Error', JSON.stringify(error), lastLocation);

    // },
    //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 });

    GeolocationService.getCurrentPosition(
      async (location) => {
        let token = await AsyncStorage.multiSet([
          ['lastLocation', JSON.stringify(location)],
        ]);
        this.getDrives(location);
      },
      (error) => {
        // See error code charts below.
        console.log('Geo Location Service Error', error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  getDrives(location) {
    DriveService.nearDrive(location)
      .then((res) => {
        const drives = res.data;
        const filterDrives = drives.filter((drive) => drive.distance < 5);
        if (filterDrives.length > 0) {
          this.setState({
            nearDrives: filterDrives,
          });
        } else {
          this.setState({
            nearDrives: drives,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onPressDrive = (drive) => {
    console.log(drive);
    this.setState({selectedDrive: drive, showDriveMap: true});
  };

  render() {
    return (
      <View style={{marginTop: 20}}>
        <SectionHeader
          title="Near You"
          action="Show More"
          onPressAction={() => {
            this.props.navigation.navigate('NearByDrives');
          }}
        />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{paddingHorizontal: 10}}>
          {this.state.nearDrives &&
            this.state.nearDrives.slice(0, 5).map((drive) => {
              return (
                <TouchableWithoutFeedback
                  key={drive.id}
                  onPress={() => {
                    this.props.navigation.navigate('UpcomingDriveDetail', {
                      header: {
                        title: 'Near By Drive',
                        subTitle: 'Enroll to participate',
                      },
                      drive: drive,
                    });
                  }}>
                  <View
                    style={{
                      marginTop: 10,
                      marginHorizontal: 10,
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      width: 135,
                    }}>
                    <Image
                      source={
                        drive.image
                          ? {uri: `${drive.image}`}
                          : require('../../assets/images/app_icon.png')
                      }
                      style={[{height: 180, width: 135, borderRadius: 10}]}
                    />
                    <Text
                      style={[
                        AppStyle.mediumFont,
                        AppStyle.whiteColor,
                        {
                          fontSize: 16,
                          bottom: 40,
                          textAlign: 'center',
                          flexWrap: 'wrap',
                        },
                      ]}>
                      {drive.name}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
        </ScrollView>
        {this.state.showDriveMap && (
          <DriveMap
            showModal={this.state.showDriveMap}
            driveDetail={this.state.selectedDrive}
            onClose={() => {
              this.setState({showDriveMap: false});
            }}
          />
        )}
        {!this.state.nearDrives && (
          <View
            style={[
              {
                flex: 1,
                margin: 10,
                padding: 10,
                height: 100,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              },
              styles.boxWithShadow,
            ]}>
            <ActivityIndicator size="large" color="#dedede" />
          </View>
        )}
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
});
