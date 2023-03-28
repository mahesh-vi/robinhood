import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Picker,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import AppStyle from '../../style/AppStyle';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import ZoneDetail from './ZoneDetail';
import DriveService from '../../services/DriveService';
import CommonService from '../../services/CommonService';
import GeneralService from '../../services/GeneralService';

import TopRobins from '../../components/TopRobins';
import StyleApp from '../../style/NewAppStyle';

const duration = ['day', 'week', 'month', 'year'];
export default class DashboardDetails extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  picker;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedIndex: 0,
      showModal: false,
    };
  }

  UNSAFE_componentWillMount() {
    // this.getZones();
    this.getSnapShotDetail(global.user.zone, this.state.selectedIndex);
  }

  getSnapShotDetail(selectZone, index) {
    const _this = this;
    console.log('Get Snapshot', selectZone);
    const dur = duration[index];

    Promise.all([GeneralService.getTotalDrive(dur)])
      .then((res) => {
        console.log(res);

        this.setState({
          totalDrive: res[0].data,
          selectedZone: selectZone,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    const snapshopDetails = [];
    // async.each(_this.state.zones, function (zone, callback) {

    DriveService.getOverallSnapshop(selectZone.id, dur).then((res) => {
      const zoneSnapShot = {
        zoneId: selectZone.id,
        snapshopDetail: res.data,
      };
      snapshopDetails.push(zoneSnapShot);
      _this.setState({
        snapshopDetail: snapshopDetails,
      });
      // callback();
    });

    // }, function (err) {
    //     console.log("Start Decryption", snapshopDetails);
    //     _this.setState({
    //         snapshopDetail: snapshopDetails
    //     });

    // });
  }

  handleIndexChange = (index) => {
    this.setState(
      {
        ...this.state,
        selectedIndex: index,
      },
      () => {
        this.getSnapShotDetail(
          this.state.selectedZone,
          this.state.selectedIndex,
        );
      },
    );
  };

  getZones = () => {
    CommonService.getDriveZone()
      .then((res) => {
        const zones = res.data;
        this.setState({
          zones: res.data,
        });
        // this.getSnapShotDetail(zones[0].id, this.state.selectedIndex);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onChangeZone = (zone) => {
    console.log('On change zone', zone);
    this.setState(
      {
        ...this.state,
        selectedZone: zone,
      },
      () => {
        this.getSnapShotDetail(zone, this.state.selectedIndex);
      },
    );
  };

  render() {
    const data = this.state.zones || [];
    const imageUrl = global.user.image
      ? {uri: global.user.image}
      : require('../../assets/images/app_icon.png');

    return (
      <ScrollView style={styles.mainContainer}>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 10,
            marginHorizontal: 10,
            alignItems: 'center',
          }}>
          <Image source={imageUrl} style={[styles.iconImage]} />

          <View style={{marginLeft: 20}}>
            <Text style={[StyleApp.headerText]}>{global.user.city.name}</Text>
            <Text style={[StyleApp.headerSubText]}>
              Checkout your overall stats
            </Text>
            {/* <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 10, color: '#615f71' }}>You are the admin of </Text>
                            <TouchableOpacity style={[{ borderRadius: 10,  marginLeft: 10, paddingVertical: 0 },AppStyle.primaryBackgroundColor]}
                                onPress={() => {

                                }}
                            >

                                <Picker

                                    style={{ width: "100%", fontSize: 10, height: 25, width: 130, top: 0, fontSize: 6, color: '#fff' }}
                                    selectedValue={this.state.selectedZone}
                                    onValueChange={this.onChangeZone}
                                >
                                    {data.map((i, index) => (
                                        <Picker.Item
                                            key={index}
                                            label={typeof i == "object" ? i.name : i}
                                            value={typeof i == "object" ? i.id : i}
                                        />
                                    ))}
                                </Picker>
                            </TouchableOpacity>

                        </View> */}
          </View>
          <FeatherIcon
            name={'x'}
            size={30}
            style={[
              {right: 5, top: -5, position: 'absolute'},
              AppStyle.grayColor,
            ]}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
        </View>

        <View style={{marginHorizontal: 20}}>
          <Text
            style={[
              AppStyle.blackColor,
              AppStyle.semiBoldFamily,
              AppStyle.text20,
            ]}>
            Overall Snapshot
          </Text>
          <SegmentedControlTab
            values={['Day', 'Week', 'Month', 'Year']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            tabsContainerStyle={{marginTop: 10, borderWidth: 0}}
            tabStyle={{backgroundColor: '#fff', borderWidth: 0}}
            activeTabStyle={{backgroundColor: '#E9F9F0', borderRadius: 5}}
            tabTextStyle={[AppStyle.mediumFont, {color: '#77869E'}]}
            activeTabTextStyle={[AppStyle.semiBoldFamily, {color: '#00CA9D'}]}
          />
          <View
            style={{
              backgroundColor: '#71c89e',
              paddingVertical: 30,
              paddingHorizontal: 20,
              borderRadius: 10,
              marginVertical: 10,
            }}>
            {!this.state.totalDrive && (
              <ActivityIndicator size="large" color="#dedede" />
            )}
            {this.state.totalDrive && (
              <Text
                style={[
                  AppStyle.mediumFont,
                  AppStyle.whiteColor,
                  {fontSize: 28},
                ]}>
                {this.state.totalDrive.total_drive}
              </Text>
            )}
            <Text
              style={[AppStyle.mediumFont, AppStyle.whiteColor, {fontSize: 9}]}>
              Total Drive
            </Text>
          </View>
        </View>

        <View style={{marginHorizontal: 20}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-between',
              }}>
              <Text style={[AppStyle.mediumFont, AppStyle.text16]}>
                My Zones
              </Text>
              {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('AddZone')}><Text style={[AppStyle.regularFont, AppStyle.grayColor, AppStyle.text14]}>{'Add New Zone'}</Text></TouchableOpacity> */}
            </View>
            {this.state.snapshopDetail &&
              this.state.snapshopDetail.map((zone, index) => {
                return (
                  <ZoneDetail
                    key={zone.zoneId}
                    duration={duration[this.state.selectedIndex]}
                    zoneDetail={zone}
                    navigation={this.props.navigation}
                  />
                );
              })}
          </View>
        </View>

        <TouchableWithoutFeedback
          style={{flex: 1, margin: 20}}
          onPress={() => this.props.navigation.navigate('UpcomingDrives')}>
          <Image
            source={require('../../assets/images/help_serve_2.png')}
            style={{width: '90%', height: 110, margin: 20}}
            resizeMode={'stretch'}
          />
        </TouchableWithoutFeedback>

        <TopRobins />
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
  seperation: {
    width: '80%',
    height: 20,
    left: 40,
    marginTop: 30,
    alignItems: 'center',
  },
  orLable: {
    height: 20,
    top: -10,
    display: 'flex',
    backgroundColor: '#ffffff',
    zIndex: 9999,
    paddingHorizontal: 5,
    color: '#D8D8D8',
    fontFamily: 'Montserrat-Regular',
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
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    fontFamily: 'Montserrat-Regular',
  },
});
