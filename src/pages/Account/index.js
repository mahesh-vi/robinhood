import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import moment from 'moment';

import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';

import Loader from '../../components/Loader';

import Userservice from '../../services/Userservice';
import CityAdminService from '../../services/CityAdminService';
import {DriveListItem} from '../../components/DriveListItem';
import CommonUtil from '../../utils/CommonUtil';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import PushNotification from 'react-native-push-notification';
const UserType = {
  doner: 'Doner',
  volunteer: 'Volunteer',
  zone_admin: 'Zone Admin',
  city_admin: 'City Admin',
  state_admin: 'State Admin',
};

export default class Account extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userType: null,
      isMyDrive: true,
      drives: [],
      userDetail: global.user,
      selectedIndex: 0,
    };
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
    console.log(global.user);
  }

  UNSAFE_componentWillMount = () => {
    // PushNotification.localNotificationSchedule({title:"Local",message:"Message",date: new Date(Date.now() + 5 * 1000)})

    this.props.navigation.addListener('didFocus', async () => {
      console.log('Did fous ', global.user);
      const userDetail = global.user;
      this.setState({userDetail: userDetail});

      Promise.all([
        Userservice.getMyDrives(),
        Userservice.achivements(),
        Userservice.getRequestedDrive(),
        global.user.type == 'city_admin' &&
          CityAdminService.getPendingConfirmationDrive(),
        global.user.type == 'zone_admin' &&
          CityAdminService.getPendingConfirmationDrive({
            zone: userDetail.zone.id,
          }),
      ])
        .then((res) => {
          console.log(res);
          this.setState({
            loading: false,
            drives: res[0].data,
            achivements: res[1].data,
            requestedDrives: res[2].data,
            confirmationDrive: res[3].data ? res[3].data : res[4].data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  renderItem = (item) => {
    const {selectedIndex} = this.state;
    const drive = item.item;

    const privousDrive =
      item.index > 0
        ? (selectedIndex == 0
            ? this.state.drives.data
            : selectedIndex == 1
            ? this.state.requestedDrives.data
            : this.state.confirmationDrive.data)[item.index - 1]
        : item.item;

    let isNotSameMonth =
      item.index == 0 ||
      moment(drive.date).format('MM') !==
        moment(privousDrive.date).format('MM');

    if (selectedIndex == 0) {
      return (
        <DriveListItem
          isNotSameMonth={isNotSameMonth}
          drive={drive}
          onPress={() => {
            this.props.navigation.navigate('MyDriveDetail', {
              drive,
            });
          }}
        />
      );
    } else if (selectedIndex == 1) {
      return (
        <DriveListItem
          isNotSameMonth={isNotSameMonth}
          drive={drive}
          onPress={() => {
            this.props.navigation.navigate('MyUpcomingDriveDetail', {
              drive: drive,
            });
          }}
        />
      );
    } else {
      return (
        <DriveListItem
          isNotSameMonth={isNotSameMonth}
          drive={drive}
          removeCounter={true}
          onPress={() => {
            this.props.navigation.navigate('ConfirmDrive', {
              drive: drive,
            });
          }}
        />
      );
    }
  };

  handleIndexChange = (index) => {
    this.setState(
      {
        ...this.state,
        selectedIndex: index,
      },
      () => {
        // this.getOverallSnapshop();
      },
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
              margin: 5,
              padding: 20,
            },
            AppStyle.boxWithShadow,
          ]}>
          <Text>No any drives.</Text>
        </View>
      );
    }
    return null;
  };

  render() {
    const user = this.state.userDetail;
    const imageURL = user.image
      ? {uri: user.image}
      : require('../../assets/images/user_male.png');
    const {selectedIndex} = this.state;
    const tabOptions =
      this.state.userDetail.type == 'city_admin' ||
      this.state.userDetail.type == 'zone_admin'
        ? ['My Drive', 'Requested', 'Confirmation']
        : ['My Drive', 'Requested'];
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View style={{marginHorizontal: 20}}>
          {/* <Ionicons name={'ios-arrow-back'} size={30} onPress={() => this.props.navigation.goBack()} /> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <View style={{flex: 1}}>
              <Text style={[StyleApp.headerText]}>My Profile</Text>
              <Text style={[StyleApp.headerSubText]}>
                Check your Robin profile here
              </Text>
            </View>
            <TouchableOpacity
              style={[
                {
                  borderRadius: 22,
                  width: 50,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                AppStyle.primaryBackgroundColor,
              ]}
              onPress={() => {
                this.props.navigation.navigate('EditProfile');
              }}>
              <Text
                style={{
                  color: '#fff',
                  textTransform: 'uppercase',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 10,
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <Image
              source={imageURL}
              style={[
                {width: 120, height: 120, borderRadius: 60, borderWidth: 1},
                AppStyle.primaryBorder,
              ]}
            />

            {/* <Image source={imageURL} style={[{ height: 120, width: 120, borderRadius: 60, borderWidth: 1 }, AppStyle.primaryBorder]} resizeMode={'stretch'} /> */}
            <View style={{flex: 1, marginLeft: 20, marginTop: 10}}>
              <Text
                style={[
                  StyleApp.extraBoldFont,
                  AppStyle.text18,
                  AppStyle.darkGrayColor,
                  {color: '#979797'},
                ]}>
                {user.firstname + ' ' + user.lastname}
              </Text>
              <Text
                style={[
                  AppStyle.text12,
                  AppStyle.grayColor,
                  StyleApp.mediumFont,
                ]}>
                {UserType[user.type]}
              </Text>
              <Text
                style={[
                  {marginTop: 5},
                  AppStyle.blackColor,
                  AppStyle.text12,
                  StyleApp.mediumFont,
                ]}>
                {user.city.name}, {user.state.name}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.state.achivements &&
                  this.state.achivements.bach_image &&
                  this.state.achivements.bach_image.map((image, index) => {
                    return (
                      <Image
                        key={index}
                        source={{uri: image}}
                        style={[{height: 35, width: 35}]}
                        resizeMode={'stretch'}
                      />
                    );
                  })}
                {/* <Text style={[AppStyle.text16, { flex: 1 }]}>+2</Text> */}
              </View>
            </View>
          </View>

          {/* <View style={{ marginVertical: 10, justifyContent: 'space-between' }}>
                        <Text style={[AppStyle.mediumFont, AppStyle.blackColor, AppStyle.text16]}>My Drives</Text>
                    </View> */}

          {/* <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => { this.setState({ isMyDrive: true }) }} style={{ top: 2 }}>
                            <Text style={[AppStyle.semiBoldFamily, AppStyle.text14, { color: this.state.isMyDrive ? StyleApp.primaryColor.color  : null, borderBottomWidth: 2, borderBottomColor: this.state.isMyDrive ? StyleApp.primaryColor.color : "#fff", paddingVertical: 5 }]}>{'My Drives'}</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ isMyDrive: false }) }} style={{ top: 2 }}>
                            <Text style={[AppStyle.semiBoldFamily, AppStyle.text14, { color: !this.state.isMyDrive ? StyleApp.primaryColor.color  : null, borderBottomWidth: 2, borderBottomColor: !this.state.isMyDrive ? StyleApp.primaryColor.color : "#fff", paddingVertical: 5, marginLeft: 20 }]}>{'Requested'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setState({ isMyDrive: false }) }} style={{ top: 2 }}>
                            <Text style={[AppStyle.semiBoldFamily, AppStyle.text14, { color: !this.state.isMyDrive ? StyleApp.primaryColor.color  : null, borderBottomWidth: 2, borderBottomColor: !this.state.isMyDrive ? StyleApp.primaryColor.color : "#fff", paddingVertical: 5, marginLeft: 20 }]}>{'Confirmation'}</Text>
                        </TouchableOpacity>
                    </View> */}

          <SegmentedControlTab
            values={tabOptions}
            selectedIndex={this.state.selectedIndex}
            onTabPress={this.handleIndexChange}
            tabsContainerStyle={{
              marginTop: 10,
              borderWidth: 0,
              backgroundColor: '#fff',
            }}
            tabStyle={{
              backgroundColor: '#fff',
              borderWidth: 0,
              paddingBottom: 5,
              flexWrap: 'wrap',
              borderColor: '#fff',
            }}
            activeTabStyle={{backgroundColor: '#fff', borderColor: '#fff'}}
            tabTextStyle={[
              AppStyle.semiBoldFamily,
              {
                color: '#77869E',
                paddingBottom: 5,
                borderBottomWidth: 2,
                borderBottomColor: '#fff',
              },
            ]}
            activeTabTextStyle={[
              AppStyle.semiBoldFamily,
              {
                color: '#00CA9D',
                borderBottomWidth: 2,
                borderBottomColor: StyleApp.primaryColor.color,
              },
            ]}
          />

          <FlatList
            data={CommonUtil.sortBy(
              selectedIndex == 0
                ? this.state.drives.data
                : selectedIndex == 1
                ? this.state.requestedDrives.data
                : this.state.confirmationDrive.data,
              {
                prop: 'date',
                desc: true,
                parser: function (item) {
                  return new Date(item);
                },
              },
            )}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item) => '' + item.drive_id}
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

// renderVolunteer = (item) => {

//     const imageUrl = item.image_url ? { uri: item.image_url } : require(`../../assets/images/user.png`);

//     return (<Image key={item.id} source={imageUrl} style={[AppStyle.avtarImage, { left: -10, zIndex: -10 }]} />
//     )
// }

// startDrive = (drive, index) => {
//     console.log('Start Drive', index);

//     const { drive_id } = drive;
//     this.setState({ loading: true });
//     Userservice.startDrive(drive_id).then((res) => {
//         console.log(res);

//         this.setState({ loading: false, drives: drives });
//     }).catch((error) => {
//         console.log(error);
//         this.setState({ loading: false });
//     });
// }

// endDrive = (drive, index) => {
//     console.log('End Drive', drive);
//     console.log(this.props);
//     const _this = this;
//     this.props.screenProps({
//         title: 'Robinhood',
//         body: 'To end drive provide number of people serve.',
//         type: 'inputconfirm',
//         buttons: ['Ok', 'Cancel'],
//         ctaOnPress: (text) => {

//             console.log(text)
//             console.log(text)
//             const { drive_id } = drive;
//             const peopleServe = text;
//             _this.setState({ loading: true });
//             Userservice.endDrive(drive_id, peopleServe).then((res) => {
//                 console.log(res);
//                 let drives = this.state.drives;
//                 drives[index].status = 1;
//                 _this.setState({ loading: false, drives: drives });
//             }).catch((error) => {
//                 console.log(error);
//                 _this.setState({ loading: false });
//             });

//         },
//         onChangeText: (text) => {
//             console.log(text)
//         }
//     });

//     //
// }
