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
  FlatList,
} from 'react-native';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
import Svg, {Polyline} from 'react-native-svg';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import moment from 'moment';
import FeatherIcon from 'react-native-vector-icons/Feather';
import TextField from '../../components/TextField';
import TopRobins from '../../components/TopRobins';
import DriveService from '../../services/DriveService';

const duration = ['day', 'week', 'month', 'year'];

export default class DriveDetail extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedIndex: 0,
      items: [1, 2, 3],
      driveDetail: this.props.navigation.getParam('driveDetail', null),
      zoneDetail: this.props.navigation.getParam('zoneDetail', null),
      isDrive: true,
    };
  }

  UNSAFE_componentWillMount = async () => {
    const {drive_id} = this.state.driveDetail;
    try {
      this.getOverallSnapshop();
      const driveDetail = await DriveService.getDriveDetail(drive_id);
      this.setState({driveData: driveDetail.data});
    } catch (error) {
      console.log(error);
    }
  };

  handleIndexChange = index => {
    this.setState(
      {
        ...this.state,
        selectedIndex: index,
      },
      () => {
        this.getOverallSnapshop();
      },
    );
  };

  getOverallSnapshop() {
    const {zoneId} = this.state.zoneDetail;
    const dur = duration[this.state.selectedIndex];
    DriveService.getOverallSnapshop(zoneId, dur)
      .then(res => {
        this.setState({driveSnapshot: res.data});
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderItem = item => {
    const driveStatus = item.item;

    return (
      <View>
        {item.index == 0 && (
          <View style={{flexDirection: 'row', top: 5}}>
            <View style={{alignItems: 'center', width: 40}}>
              <View
                style={{
                  backgroundColor: '#21D1AA',
                  width: 15,
                  height: 15,
                  borderRadius: 20,
                }}></View>
            </View>
            <View style={{justifyContent: 'center', marginHorizontal: 10}}>
              <Text
                style={[
                  AppStyle.semiBoldFamily,
                  StyleApp.assentGray,
                  {fontSize: 12},
                ]}>
                {moment(driveStatus.time.date).format('dddd DD,MMM')}
              </Text>
            </View>
          </View>
        )}

        <View style={{flexDirection: 'row'}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{backgroundColor: '#21D1AA', width: 2, height: 20}}></View>
            <View
              style={{
                backgroundColor: '#21D1AA',
                width: 40,
                height: 40,
                borderRadius: 20,
              }}></View>
            {item.index !== this.state.driveData.drive_status.length - 1 && (
              <View
                style={{
                  backgroundColor: '#21D1AA',
                  width: 2,
                  height: 20,
                }}></View>
            )}
          </View>
          <View style={{justifyContent: 'center', marginHorizontal: 10}}>
            <Text
              style={[
                AppStyle.semiBoldFamily,
                StyleApp.assentGray,
                {fontSize: 16},
              ]}>
              {driveStatus.title}
            </Text>
            <Text
              style={[
                AppStyle.semiBoldFamily,
                StyleApp.assentGray,
                {fontSize: 12},
              ]}>
              {' '}
              {moment(driveStatus.time.date).format('dddd HH:mm')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  renderRobinItem = item => {
    const robin = item.item;
    return (
      <View style={{marginBottom: 10}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require(`../../assets/images/avtar.png`)}
            style={[{width: 30, height: 30, borderRadius: 15}]}
          />
          <View style={{marginHorizontal: 10}}>
            <Text style={[AppStyle.semiBoldFamily, {fontSize: 12}]}>
              {robin.name}
            </Text>
            {/* <View style={{ borderRadius: 10, backgroundColor: '#fcf7e2', paddingHorizontal: 5 }}>
                            <Text style={[AppStyle.mediumFont, { fontSize: 10, color: '#e7c560', textAlign: 'center' }]}>{CommonUtil.capitalize(robin.type)}</Text>

                        </View> */}
          </View>
          {/* <Menu style={{ right: 10, position: 'absolute' }}>
                        <MenuTrigger  >
                            <Text><FeatherIcon name={'more-horizontal'} size={25} /></Text>
                        </MenuTrigger>
                        <MenuOptions customStyles={{ optionText: { padding: 0, fontFamily: 'Montserrat-Medium', margin: 0 } }}>
                            <MenuOption onSelect={() => console.log('Test')} text={'Remove'} />
                            <MenuOption onSelect={() => console.log('Test')} text='Make Admin' />
                        </MenuOptions>
                    </Menu> */}
        </View>
      </View>
    );
  };

  render() {
    const {driveData, driveSnapshot} = this.state;
    const imageUrl = require(`../../assets/images/app_icon.png`);

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

          <View style={{flex: 1, marginLeft: 10, flexDirection: 'row'}}>
            <View style={{width: '90%'}}>
              <Text style={[StyleApp.headerText]}>
                {this.state.driveDetail.name}
              </Text>
              <Text style={[StyleApp.headerSubText]}>
                {this.state.driveDetail.zone_name}
              </Text>
            </View>
            <FeatherIcon
              name={'x'}
              size={24}
              style={[{right: 10}, StyleApp.grayColor]}
              onPress={() => {
                this.props.navigation.goBack();
              }}
            />
          </View>
        </View>

        <View style={{marginHorizontal: 20, marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                AppStyle.semiBoldFamily,
                AppStyle.blackColor,
                {fontSize: 20},
              ]}>
              Detailed View
            </Text>
          </View>
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
          {driveSnapshot && (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                alignItems: 'center',
                backgroundColor: '#21D1AA',
                padding: 20,
                borderRadius: 10,
              }}>
              <View style={{marginHorizontal: 10}}>
                <Text
                  style={[
                    AppStyle.mediumFont,
                    AppStyle.whiteColor,
                    {fontSize: 34, textAlign: 'center'},
                  ]}>
                  {this.state.driveSnapshot.tota_drive}
                </Text>
                <Text
                  style={[
                    AppStyle.boldFamily,
                    AppStyle.whiteColor,
                    {fontSize: 10},
                  ]}>
                  Total Drive
                </Text>
              </View>

              <View style={{marginHorizontal: 10}}>
                <Svg height="50" width="15">
                  <Polyline
                    points="0,0,0,20,7,25,0,30, 0,50"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </Svg>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text
                    style={[
                      AppStyle.boldFamily,
                      AppStyle.whiteColor,
                      AppStyle.text10,
                      AppStyle.textCenter,
                      {flex: 1, flexWrap: 'wrap'},
                    ]}>
                    People served
                  </Text>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.whiteColor,
                      StyleApp.font24,
                    ]}>
                    {this.state.driveSnapshot.total_count_serve}
                  </Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text
                    style={[
                      AppStyle.boldFamily,
                      AppStyle.whiteColor,
                      AppStyle.textCenter,
                      {fontSize: 10, flex: 1, flexWrap: 'wrap'},
                    ]}>
                    Total Volunteers
                  </Text>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.whiteColor,
                      StyleApp.font24,
                    ]}>
                    {this.state.driveSnapshot.total_no_of_volunteers}
                  </Text>
                </View>
                <View style={{alignItems: 'center', flex: 1}}>
                  <Text
                    style={[
                      AppStyle.boldFamily,
                      AppStyle.whiteColor,
                      AppStyle.textCenter,
                      {fontSize: 10, flex: 1, flexWrap: 'wrap'},
                    ]}>
                    My Drives
                  </Text>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.whiteColor,
                      StyleApp.font24,
                    ]}>
                    {this.state.driveSnapshot.tota_my_drive}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <TopRobins />

        {driveData && (
          <View style={{marginVertical: 10, marginHorizontal: 20}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,0.3)',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({isDrive: true});
                }}
                style={{top: 2}}>
                <Text
                  style={[
                    AppStyle.semiBoldFamily,
                    {
                      color: this.state.isDrive
                        ? StyleApp.primaryColor.color
                        : null,
                      borderBottomWidth: this.state.isDrive ? 2 : 0,
                      borderBottomColor: StyleApp.primaryColor.color,
                      paddingVertical: 5,
                    },
                  ]}>
                  {'Area Drive'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.setState({isDrive: false});
                }}
                style={{top: 2}}>
                <Text
                  style={[
                    AppStyle.semiBoldFamily,
                    {
                      color: !this.state.isDrive
                        ? StyleApp.primaryColor.color
                        : null,
                      borderBottomWidth: !this.state.isDrive ? 2 : 0,
                      borderBottomColor: StyleApp.primaryColor.color,
                      paddingVertical: 5,
                      paddingLeft: 20,
                    },
                  ]}>
                  Area Robins
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{marginVertical: 20}}>
              {this.state.isDrive && (
                <FlatList
                  data={driveData.drive_status}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={item => item.title}
                  maxHeight={400}
                />
              )}
              {!this.state.isDrive && (
                <View>
                  <TextField
                    placeholder="Search Ronins"
                    style={{paddingHorizontal: 10, minHeight: 32}}
                  />
                  <View>
                    <FlatList
                      data={driveData.robins}
                      renderItem={this.renderRobinItem.bind(this)}
                      keyExtractor={item => item.image_url}
                      maxHeight={400}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
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
    width: 72,
    height: 72,
    //    borderColor: '#71c89e',
    // borderWidth: 0.75,
    borderRadius: 4,
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
});
