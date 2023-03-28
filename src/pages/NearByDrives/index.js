import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AppStyle from '../../style/AppStyle';
import Loader from '../../components/Loader';
import {DriveListItem} from '../../components/DriveListItem';
import DriveService from '../../services/DriveService';
import GeolocationService from 'react-native-geolocation-service';
import StyleApp from '../../style/NewAppStyle';
import CommonUtil from '../../utils/CommonUtil';
export default class NearByDrives extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      drives: [],
    };

    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
  }

  UNSAFE_componentWillMount = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Robinhood location Permission',
            message: 'Robinhood needs access to your location ',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getDrives();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      this.getDrives();
    }
  };

  getDrives() {
    GeolocationService.getCurrentPosition(
      async (location) => {
        console.log('Geo Location Service', location);
        let token = await AsyncStorage.multiSet([
          ['lastLocation', JSON.stringify(location)],
        ]);
        this.setState({
          loading: true,
        });
        DriveService.nearDrive(location)
          .then((res) => {
            console.log('Near Drive', res);
            const drives = res.data;
            this.setState({
              nearDrives: CommonUtil.sortBy(drives, {
                prop: 'date',
                desc: true,
                parser: function (item) {
                  return new Date(item);
                },
              }),
              loading: false,
            });
          })
          .catch((error) => {
            console.log(error);
            this.setState({
              loading: false,
            });
          });
      },
      (error) => {
        // See error code charts below.
        console.log('Geo Location Service Error', error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    // Geolocation.getCurrentPosition(location => {
    //     console.log("Nearby drive", location)

    //     DriveService.nearDrive(location).then((res) => {
    //         console.log("Near Drive", res);
    //         const drives = res.data;
    //         this.setState({
    //             nearDrives: drives,
    //         });
    //         // console.log("Filter drive after 5 distance", filterDrives);

    //     }).catch((error) => {
    //         console.log(error);
    //     });

    // }, error => console.log('Error', JSON.stringify(error)),
    //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 });
  }

  renderItem = (item) => {
    const drive = item.item;

    const privousDrive =
      item.index > 0 ? this.state.nearDrives[item.index - 1] : item.item;

    let isNotSameMonth =
      item.index == 0 ||
      moment(drive.date).format('MM') !==
        moment(privousDrive.date).format('MM');
    return (
      <DriveListItem
        isNotSameMonth={isNotSameMonth}
        drive={drive}
        onPress={() => {
          this.props.navigation.navigate('UpcomingDriveDetail', {
            header: {
              title: 'Near By Drive',
              subTitle: 'Enroll to participate',
            },
            drive: drive,
          });
        }}
      />
    );
  };

  renderEmptyComponent = () => {
    if (this.state.loading == false) {
      return (
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 5,
              margin: 10,
              padding: 20,
            },
            AppStyle.boxWithShadow,
          ]}>
          <Text>No any near drives.</Text>
        </View>
      );
    }
    return null;
  };

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View style={{marginHorizontal: 20}}>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <Ionicons
              name={'ios-arrow-back'}
              size={30}
              onPress={() => this.props.navigation.goBack()}
            />

            <View style={{marginLeft: 20}}>
              <Text style={[StyleApp.headerText]}>Near By Drives</Text>
              <Text style={[StyleApp.headerSubText]}>
                Check all near by drives hear
              </Text>
            </View>
          </View>

          <FlatList
            data={this.state.nearDrives}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item) => '' + item.id}
            ListEmptyComponent={this.renderEmptyComponent}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconImage: {
    height: 80,
    width: 80,
  },
  formContainer: {
    left: '10%',
    marginTop: 40,
  },
  seperation: {
    width: '80%',
    height: 20,
    left: 40,
    marginTop: 30,
    alignItems: 'center',
  },
  inputContainer: {
    backgroundColor: 'rgba(250,250,254,1)',
    marginBottom: 10,
    width: '100%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
});
