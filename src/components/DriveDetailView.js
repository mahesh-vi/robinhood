import React, {Component, Fragment} from 'react';
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
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RemoveRobin from '../pages/ActiveDrive/RemoveRobin';

import moment from 'moment';
import AppStyle from '../style/AppStyle';
import StyleApp from '../style/NewAppStyle';
import Share from 'react-native-share';
import CancelDrive from '../pages/ActiveDrive/CancelDrive';
import JoinModal from './JoinModal';
import DriveService from '../services/DriveService';
import CommonUtil from '../utils/CommonUtil';
import LeaveDrive from './LeaveDrive';
import {Map} from './MapView';
import CityAdminService from '../services/CityAdminService';
import GallaryView from './GallaryView';

export default class DriveDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      isOpenGallary: false,
    };
    this.share = this.share.bind(this);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({
      drive: props.driveData,
    });
  }

  share() {
    const {driveData} = this.props;
    console.log(this.props);
    const options = {
      title: driveData.drive_name,
      subject: driveData.drive_name,
      message: `${driveData.description}`,
    };
    Share.open(options);
  }

  removeRobin(message) {
    const driveId = this.props.driveData.drive_id;
    const robinId = this.state.selectedRobin.id;
    this.setState({loading: true});
    DriveService.removeDriveRobin(driveId, robinId, message)
      .then((res) => {
        console.log('Current Drive Detail', res);
        this.setState({loading: false, showRemoveRobin: false});
        this.props.removeRobin(robinId);
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log(error);
      });
  }

  removeImage(item, index) {
    const driveId = this.props.driveData.drive_id;
    CityAdminService.removeDriveImage(driveId, item.image_url)
      .then((res) => {
        console.log(res);
        this.props.onRemoveDriveImage(index);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const {driveType} = this.props;
    const driveData = this.state.drive || this.props.driveData;
    const poc = driveData
      ? Array.isArray(driveData.admin)
        ? driveData.admin.find((i) => i.admin_id == global.user.id)
        : global.user.id == driveData.admin.admin_id
      : null;
    const isJoined = driveData
      ? driveData.robins.find((i) => i.id == global.user.id)
      : null;
    const isInvited =
      driveData && driveData.invite_peoples
        ? driveData.invite_peoples.find((i) => i.id == global.user.id)
        : null;
    return (
      <View
        style={[
          {marginTop: 20, padding: 20, backgroundColor: '#fff'},
          AppStyle.boxWithShadow,
        ]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '92%'}}>
            <Text
              style={[AppStyle.blackColor, AppStyle.text22, StyleApp.boldFont]}>
              {driveData.drive_name}
            </Text>
            <Text
              style={[
                StyleApp.regularFont,
                AppStyle.text16,
                {textTransform: 'uppercase'},
              ]}>
              {moment(driveData.drive_date || driveData.date).format(
                'DD MMMM YYYY',
              )}
            </Text>
          </View>
          <TouchableOpacity onPress={this.share}>
            <Image source={require('../assets/images/share.png')} />
          </TouchableOpacity>
        </View>

        <View style={{marginVertical: 10}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Image source={require('../assets/images/place.png')} />
              <Text
                style={[
                  {flex: 1, marginLeft: 5},
                  StyleApp.mediumFont,
                  StyleApp.text12,
                ]}>
                {driveData.city_name}
              </Text>
            </View>
            <View
              style={{flex: 1.5, flexDirection: 'row', alignItems: 'center'}}>
              <Image source={require('../assets/images/place.png')} />
              <Text
                style={[
                  {marginLeft: 5, flex: 1},
                  StyleApp.mediumFont,
                  StyleApp.text12,
                ]}>
                {driveData.zone_name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              marginVertical: 5,
            }}>
            <Image source={require('../assets/images/file.png')} />
            <Text
              style={[
                {marginLeft: 5, flex: 1},
                StyleApp.mediumFont,
                StyleApp.text12,
              ]}>
              {driveData.drive_number}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#D8D8D8',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setState({selectedIndex: 0});
            }}
            style={{top: 1.5}}>
            <Text
              style={[
                this.state.selectedIndex == 0
                  ? AppStyle.semiBoldFamily
                  : StyleApp.semiBoldFont,
                {
                  color:
                    this.state.selectedIndex == 0
                      ? StyleApp.primaryColor.color
                      : null,
                  borderBottomWidth: this.state.selectedIndex == 0 ? 2 : 0,
                  borderBottomColor: StyleApp.primaryColor.color,
                  paddingVertical: 5,
                },
              ]}>
              {'Drive Details'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({selectedIndex: 1});
            }}
            style={{top: 1.5}}>
            <Text
              style={[
                this.state.selectedIndex == 1
                  ? AppStyle.semiBoldFamily
                  : StyleApp.semiBoldFont,
                {
                  color:
                    this.state.selectedIndex == 1
                      ? StyleApp.primaryColor.color
                      : null,
                  borderBottomWidth: this.state.selectedIndex == 1 ? 2 : 0,
                  borderBottomColor: StyleApp.primaryColor.color,
                  paddingVertical: 5,
                  paddingLeft: 20,
                },
              ]}>
              Robins
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setState({selectedIndex: 2});
            }}
            style={{top: 1.5}}>
            <Text
              style={[
                this.state.selectedIndex == 2
                  ? AppStyle.semiBoldFamily
                  : StyleApp.semiBoldFont,
                {
                  color:
                    this.state.selectedIndex == 2
                      ? StyleApp.primaryColor.color
                      : null,
                  borderBottomWidth: this.state.selectedIndex == 2 ? 2 : 0,
                  borderBottomColor: StyleApp.primaryColor.color,
                  paddingVertical: 5,
                  paddingLeft: 20,
                },
              ]}>
              Map
            </Text>
          </TouchableOpacity>
          {driveType != 'mydrive' && driveData.complete_images.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                this.setState({selectedIndex: 3});
              }}
              style={{top: 1.5}}>
              <Text
                style={[
                  this.state.selectedIndex == 3
                    ? AppStyle.semiBoldFamily
                    : StyleApp.semiBoldFont,
                  {
                    color:
                      this.state.selectedIndex == 3
                        ? StyleApp.primaryColor.color
                        : null,
                    borderBottomWidth: this.state.selectedIndex == 3 ? 2 : 0,
                    borderBottomColor: StyleApp.primaryColor.color,
                    paddingVertical: 5,
                    paddingLeft: 20,
                  },
                ]}>
                Images
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {this.state.selectedIndex == 0 && (
          <Fragment>
            <View style={{marginTop: 20}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{marginVertical: 10}}>
                  <Text style={[StyleApp.font12]}>Drive Number</Text>
                  <Text style={[AppStyle.semiBoldFamily, StyleApp.font16]}>
                    {driveData.drive_number}
                  </Text>
                </View>

                {driveType == 'mydrive' && (
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={require('../assets/images/Combined_Shape.png')}
                      style={{height: 80, width: 80}}
                      resizeMode={'stretch'}
                    />

                    <View
                      style={[
                        {
                          position: 'absolute',
                          alignSelf: 'center',
                          top: 20,
                          alignItems: 'center',
                        },
                      ]}>
                      <Text
                        style={[
                          AppStyle.whiteColor,
                          AppStyle.boldFamily,
                          {fontSize: 16, textAlign: 'center'},
                        ]}>
                        {driveData.count_serve}+
                      </Text>
                      <Text
                        style={[
                          AppStyle.whiteColor,
                          AppStyle.boldFamily,
                          StyleApp.text12,
                        ]}>
                        Served
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={{marginBottom: 10}}>
                <Text style={[StyleApp.font12]}>Drive Description</Text>
                <Text style={[AppStyle.semiBoldFamily, StyleApp.font16]}>
                  {driveData.description}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <View>
                  <Text style={[AppStyle.text12, {flex: 1}]}>
                    Food Quantity
                  </Text>
                  <Text style={[AppStyle.semiBoldFamily, StyleApp.font16]}>
                    {driveData.food_quntity || driveData.food_quality}
                  </Text>
                </View>
                <View style={{marginLeft: 5}}>
                  <Text style={[AppStyle.text12]}>Robins</Text>
                  <Text
                    style={[
                      AppStyle.semiBoldFamily,
                      AppStyle.textCenter,
                      StyleApp.font16,
                    ]}>
                    {driveData.no_of_volunteers}
                  </Text>
                </View>
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={[AppStyle.text12]}>Doner</Text>
                <Text
                  style={[
                    AppStyle.semiBoldFamily,
                    StyleApp.primaryColor,
                    StyleApp.font16,
                  ]}>
                  {driveData.donar_name}
                </Text>
              </View>
            </View>

            {driveType == 'mydrive' && (
              <View>
                <Text style={[AppStyle.text12]}>Food Type</Text>

                <FlatList
                  data={driveData.foodtypes}
                  renderItem={({item}) => (
                    <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <Ionicons name={'md-arrow-dropright'} size={20} />
                        <Text
                          style={[
                            {flex: 1, marginLeft: 10},
                            AppStyle.mediumFont,
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    </View>
                  )}
                  //Setting the number of column
                  keyExtractor={(item, index) => index.toString()}
                  style={{marginVertical: 5}}
                />

                <View style={{marginTop: 10}}>
                  <Text style={[AppStyle.text12]}>Drive Pictures</Text>
                  <View style={{marginTop: 10}}>
                    <FlatList
                      data={driveData.complete_images}
                      renderItem={({item}) => (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            margin: 1,
                            padding: 1,
                            backgroundColor: AppStyle.darkGrayColor.color,
                          }}>
                          <TouchableOpacity key={item.id} style={{flex: 1}}>
                            <Image
                              style={styles.image}
                              source={{
                                uri: item.image_url,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                      //Setting the number of column
                      numColumns={2}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </View>
              </View>
            )}
          </Fragment>
        )}

        {this.state.selectedIndex == 1 && (
          <Fragment>
            <View style={{marginTop: 20}}>
              <View>
                <Text>Robin (Admin)</Text>

                {Array.isArray(driveData.admin) &&
                  driveData.admin.map((admin, index) => {
                    return (
                      <View
                        key={index + ''}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Image
                          style={[styles.iconImage]}
                          source={CommonUtil.getUserImage(admin.image_url)}
                        />
                        <Text
                          style={[
                            AppStyle.semiBoldFamily,
                            StyleApp.font12,
                            {marginLeft: 5},
                          ]}>
                          {admin.admin_name}
                        </Text>
                      </View>
                    );
                  })}
                {typeof driveData.admin === 'object' &&
                  !Array.isArray(driveData.admin) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 5,
                        }}>
                        <Image
                          style={[styles.iconImage]}
                          source={CommonUtil.getUserImage(
                            driveData.admin.image_url,
                          )}
                        />
                        <Text style={[AppStyle.boldFamily, {marginLeft: 5}]}>
                          {driveData.admin.admin_name}
                        </Text>
                      </View>
                    </View>
                  )}
              </View>

              {driveData.robins.length > 0 && (
                <View style={{marginTop: 10}}>
                  <Text>Robins </Text>

                  {driveData.robins.map((robin, index) => {
                    if (poc && poc.admin_id == robin.id) {
                      return null;
                    }
                    return (
                      <View
                        key={'' + index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 5,
                          }}>
                          <Image
                            style={[styles.iconImage]}
                            source={CommonUtil.getUserImage(robin.image_url)}
                          />
                          <Text style={[AppStyle.boldFamily, {marginLeft: 5}]}>
                            {robin.name}
                          </Text>
                        </View>
                        {(global.user.type == 'state_admin' ||
                          global.user.type == 'city_admin' ||
                          global.user.type == 'zone_admin' ||
                          poc) && (
                          <FeatherIcon
                            size={25}
                            name={'x'}
                            color={AppStyle.grayColor.color}
                            onPress={() =>
                              this.setState({
                                showRemoveRobin: true,
                                selectedRobin: robin,
                              })
                            }
                          />
                        )}
                      </View>
                    );
                  })}
                </View>
              )}

              {driveData.invite_peoples &&
                driveData.invite_peoples.length > 0 && (
                  <View style={{marginTop: 10}}>
                    <Text>Invites </Text>

                    {driveData.invite_peoples.map((robin, index) => {
                      if (poc && poc.admin_id == robin.id) {
                        return null;
                      }
                      return (
                        <View
                          key={'' + index}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 5,
                            }}>
                            <Image
                              style={[styles.iconImage]}
                              source={CommonUtil.getUserImage(robin.image_url)}
                            />
                            <Text
                              style={[AppStyle.boldFamily, {marginLeft: 5}]}>
                              {robin.name}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
            </View>
          </Fragment>
        )}

        {this.state.selectedIndex == 2 && (
          <Fragment>
            <View style={{marginTop: 10}}>
              <View>
                <Map style={styles.map} data={driveData} />
              </View>
              <View style={{marginTop: 10}}>
                <View
                  style={{
                    backgroundColor: '#000000',
                    alignSelf: 'flex-start',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={[
                      AppStyle.semiBoldFamily,
                      AppStyle.text10,
                      AppStyle.whiteColor,
                      {
                        textAlign: 'center',
                        backgroundColor: AppStyle.cyanColor.color,
                        textTransform: 'uppercase',
                        paddingHorizontal: 5,
                      },
                    ]}>
                    Doner Info
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text style={[AppStyle.text12]}>Doner Name</Text>
                  <Text style={[styles.donerInfoText]}>
                    {driveData.donar_name}
                  </Text>
                </View>

                <View
                  style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
                  <View style={{flex: 1}}>
                    <Text style={[AppStyle.text12]}>Contact Person</Text>
                    <Text style={[styles.donerInfoText]}>
                      {driveData.contact_person}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={[AppStyle.text12]}>Person Designation</Text>
                    <Text style={[styles.donerInfoText]}>
                      {driveData.person_designation}
                    </Text>
                  </View>
                </View>

                <View
                  style={{flex: 1, flexDirection: 'row', marginVertical: 10}}>
                  <View style={{flex: 1}}>
                    <Text style={[AppStyle.text12]}>Contact Number</Text>
                    <Text style={[styles.donerInfoText]}>
                      {driveData.person_mobile_number}
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={[AppStyle.text12]}>Contact Email</Text>
                    <Text style={[styles.donerInfoText]}>
                      {driveData.person_email}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Fragment>
        )}

        {this.state.selectedIndex == 3 && (
          <View style={{marginTop: 10}}>
            <Text style={[AppStyle.text12]}>Drive Pictures</Text>
            <View style={{marginTop: 10}}>
              <FlatList
                data={driveData.complete_images}
                renderItem={({item, index}) => (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      margin: 1,
                      padding: 1,
                      backgroundColor: AppStyle.darkGrayColor.color,
                    }}>
                    <TouchableOpacity
                      key={item.id}
                      style={{flex: 1}}
                      onPress={() => {
                        this.setState({isOpenGallary: index});
                      }}>
                      <Image
                        style={styles.image}
                        source={{
                          uri: item.image_url,
                        }}
                      />
                    </TouchableOpacity>
                    {(global.user.type == 'state_admin' ||
                      global.user.type == 'city_admin' ||
                      global.user.type == 'zone_admin' ||
                      poc) && (
                      <FeatherIcon
                        name={'x-circle'}
                        size={30}
                        style={{
                          color: 'rgba(255,10,10,0.5)',
                          position: 'absolute',
                          right: 0,
                        }}
                        onPress={() => {
                          this.removeImage(item, index);
                        }}
                      />
                    )}
                  </View>
                )}
                //Setting the number of column
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        )}
        {(driveType == 'MenuUpcomingDriveDetail' ||
          driveType == 'UpcomingDriveDetail') && (
          <View>
            <Text
              style={[
                AppStyle.semiBoldFamily,
                AppStyle.textCenter,
                AppStyle.grayColor,
              ]}>
              {driveData.no_of_volunteers}+ Robins Required
            </Text>
            {driveData.joinStatus && driveData.joinStatus.status && (
              <Text
                style={[
                  AppStyle.semiBoldFamily,
                  AppStyle.textCenter,
                  AppStyle.grayColor,
                ]}>
                {driveData.joinStatus.status == 0
                  ? 'Request send'
                  : 'Already Joined'}{' '}
              </Text>
            )}

            {driveData.status != 3 &&
              driveData.joinStatus == null &&
              !isJoined &&
              !poc &&
              global.user.type !== 'city_admin' &&
              global.user.type != 'zone_admin' &&
              driveData.user_id != global.user.id && (
                <TouchableOpacity
                  style={[
                    {
                      marginTop: 20,
                      height: 44,
                      paddingHorizontal: 30,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    AppStyle.primaryBackgroundColor,
                  ]}
                  onPress={() => this.setState({isJoinDrive: true})}>
                  <Text
                    style={{
                      color: '#fff',
                      textTransform: 'uppercase',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    JOIN ME
                  </Text>
                </TouchableOpacity>
              )}

            {isJoined && !poc && (
              <TouchableOpacity
                style={[
                  {
                    marginTop: 20,
                    height: 44,
                    paddingHorizontal: 30,
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: AppStyle.darkGrayColor.color,
                  },
                ]}
                onPress={() => this.setState({leaveDrive: true})}>
                <Text
                  style={{
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Leave ME
                </Text>
              </TouchableOpacity>
            )}

            {(global.user.type == 'state_admin' ||
              global.user.type == 'city_admin' ||
              global.user.type == 'zone_admin' ||
              poc) && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {driveData.status != 3 &&
                    ((poc && driveData.status == 0) ||
                      driveData.status == 2 ||
                      global.user.type == 'state_admin' ||
                      global.user.type == 'city_admin' ||
                      global.user.type == 'zone_admin') && (
                      <TouchableOpacity
                        style={[
                          {
                            flex: 1,
                            marginTop: 20,
                            height: 44,
                            paddingHorizontal: 10,
                            borderRadius: 22,
                            marginRight: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: StyleApp.grayColor.color,
                          },
                        ]}
                        onPress={this.props.edit}>
                        <Text
                          style={{
                            color: '#fff',
                            textTransform: 'uppercase',
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 12,
                          }}>
                          {(global.user.type == 'state_admin' ||
                            global.user.type == 'city_admin' ||
                            global.user.type == 'zone_admin') &&
                          driveData.admin.length == 0 &&
                          driveData.status == 0
                            ? 'Confirm'
                            : 'Edit'}
                        </Text>
                      </TouchableOpacity>
                    )}

                  {driveData.status == 0 && poc && (
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        marginTop: 20,
                        height: 44,
                        paddingHorizontal: 10,
                        marginRight: 5,
                        borderRadius: 22,
                        backgroundColor: StyleApp.primaryColor.color,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={this.props.startDrive}>
                      <Text
                        style={{
                          color: '#fff',
                          textTransform: 'uppercase',
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 12,
                        }}>
                        Start
                      </Text>
                    </TouchableOpacity>
                  )}

                  {((driveData.status == 0 && driveData.drive_status == 0) ||
                    ((driveData.status == 0 || driveData.status == 2) &&
                      poc)) && (
                    <TouchableOpacity
                      style={[
                        {
                          flex: 1,
                          marginTop: 20,
                          height: 44,
                          paddingHorizontal: 10,
                          borderRadius: 22,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255,0,0,0.75)',
                        },
                      ]}
                      onPress={() => this.setState({showCancelPopup: true})}>
                      <Text
                        style={{
                          color: '#fff',
                          textTransform: 'uppercase',
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 12,
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {driveData.status == 2 && (
                  <TouchableOpacity
                    style={[
                      {
                        marginTop: 20,
                        height: 44,
                        paddingHorizontal: 30,
                        borderRadius: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      AppStyle.primaryBackgroundColor,
                    ]}
                    onPress={() =>
                      this.props.navigation.navigate('CompleteDrive', {
                        drive: driveData,
                      })
                    }>
                    <Text
                      style={{
                        color: '#fff',
                        textTransform: 'uppercase',
                        fontFamily: 'Montserrat-SemiBold',
                      }}>
                      COMPLETE
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {driveData.status == 2 && (isJoined || poc) && (
              <TouchableOpacity
                style={[
                  {
                    marginTop: 20,
                    height: 44,
                    paddingHorizontal: 30,
                    borderRadius: 22,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: AppStyle.cyanColor.color,
                  },
                ]}
                onPress={() =>
                  this.props.navigation.navigate('UploadDriveImage', {
                    drive: driveData,
                  })
                }>
                <Text
                  style={{
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Upload Image
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {driveType == 'MyUpcomingDriveDetail' && (
          <View>
            {!isJoined && isInvited && (
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity
                  style={[
                    {
                      left: '10%',
                      marginTop: 20,
                      height: 44,
                      paddingHorizontal: 30,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    AppStyle.primaryBackgroundColor,
                  ]}
                  onPress={this.props.accept}>
                  <Text
                    style={{
                      color: '#fff',
                      textTransform: 'uppercase',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    left: '10%',
                    marginTop: 20,
                    height: 44,
                    paddingHorizontal: 30,
                    borderRadius: 22,
                    backgroundColor: '#efefef',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={this.props.reject}>
                  <Text
                    style={{
                      color: '#000',
                      textTransform: 'uppercase',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {isJoined && (
              <Text
                style={[
                  AppStyle.semiBoldFamily,
                  AppStyle.textCenter,
                  AppStyle.grayColor,
                ]}>
                You already accept this drive
              </Text>
            )}
            {!isInvited && !isJoined && (
              <Text
                style={[
                  AppStyle.semiBoldFamily,
                  AppStyle.textCenter,
                  AppStyle.grayColor,
                ]}>
                You already reject this drive
              </Text>
            )}
          </View>
        )}

        {this.state.showCancelPopup && (
          <CancelDrive
            driveData={driveData}
            showModal={this.state.showCancelPopup}
            onClose={(isCancel) => {
              if (isCancel) {
                this.props.navigation.goBack();
                this.props.screenProps.eventEmitter.emit('ViewUpdate', {
                  count: 1,
                });
              }

              this.setState({showCancelPopup: false});
            }}
          />
        )}

        {this.state.showRemoveRobin && (
          <RemoveRobin
            showModal={this.state.showRemoveRobin}
            robin={this.state.selectedRobin}
            onClose={() => {
              this.setState({showRemoveRobin: false});
            }}
            onRemove={(message) => this.removeRobin(message)}
          />
        )}

        {this.state.leaveDrive && (
          <LeaveDrive
            showModal={this.state.leaveDrive}
            driveData={driveData}
            onClose={(isCancel) => {
              if (isCancel) {
                this.props.navigation.popToTop();
                this.props.screenProps.eventEmitter.emit('ViewUpdate', {
                  count: 1,
                });
              }
              this.setState({leaveDrive: false});
            }}
          />
        )}

        {this.state.isJoinDrive && (
          <JoinModal
            showModal={this.state.isJoinDrive}
            driveData={driveData}
            onClose={(reasonId) => {
              if (reasonId) {
                this.props.joinDrive(reasonId);
              }
              this.setState({isJoinDrive: false});
            }}
          />
        )}

        {this.state.isOpenGallary !== false && (
          <GallaryView
            showModal={this.state.isOpenGallary}
            images={driveData.complete_images}
            onClose={() => {
              this.setState({isOpenGallary: false});
            }}
          />
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
    height: 24,
    width: 24,
    borderRadius: 15,
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
  boxWithShadow: {
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    height: 120,
    width: '100%',
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    height: 200,
    width: '100%',
  },
  donerInfoText: {
    color: '#474747',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
});
