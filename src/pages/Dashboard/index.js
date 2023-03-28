import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  PermissionsAndroid,
} from 'react-native';

import StyleApp from '../../style/NewAppStyle';

import Loader from '../../components/Loader';
import RecentCompleted from './RecentCompleted';
import DashboardStat from './DashboardStat';
import NearDrive from './NearDrive';
import Accomplishment from './Accomplishment';

import DriveService from '../../services/DriveService';
import UserService from '../../services/Userservice';

import FoodDonationDrive from './FoodDonationDrive';
import CurrentDrive from './CurrentDrive';

export default class Dashboard extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showDrivePopup: false,
      showDriveMap: false,
      userDetail: global.user,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.navigation.addListener('didFocus', async () => {
      this.setState({userDetail: global.user});
    });

    Promise.all([UserService.dashboardCount(), DriveService.getRecentRobins()])
      .then((res) => {
        this.setState({
          dashboadDetail: res[0].data,
          recentRobins: res[1].data,
        });
      })
      .catch((error) => {
        console.log('Dashboard Error', error);
      });
  }

  render() {
    const {dashboadDetail} = this.state;
    const user = this.state.userDetail;
    const imageURL = user.image
      ? {uri: user.image}
      : require('../../assets/images/user_male.png');
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={[styles.mainContainer]}>
          <Loader loading={this.state.loading} />

          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              marginHorizontal: 10,
              alignItems: 'center',
            }}>
            <Image source={imageURL} style={[styles.iconImage]} />

            <View style={{marginLeft: 20}}>
              <Text style={[StyleApp.headerText]}>
                Hey {global.user.firstname}
              </Text>
              <Text style={[StyleApp.headerSubText]}>
                Explore the Donation Drive near you
              </Text>
            </View>
          </View>

          {/* <View style={{ marginHorizontal: 20 }}>

                    <TextField placeholder={'Where to?'}
                        style={AppStyle.inputContainer} />
                </View> */}

          <DashboardStat navigation={this.props.navigation} />

          <View style={{marginHorizontal: 0}}>
            <RecentCompleted navigation={this.props.navigation} />
          </View>

          <Accomplishment navigation={this.props.navigation} />

          {/* <RobinRequest /> */}

          <View style={{marginLeft: 20}}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  StyleApp.mediumFont,
                  StyleApp.blackColor,
                  StyleApp.font14,
                ]}>
                Recently Added Robins
              </Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {this.state.recentRobins &&
                this.state.recentRobins.map((robin) => {
                  const imageUrl = robin.image_url
                    ? {uri: robin.image_url}
                    : require('../../assets/images/user_male.png');

                  return (
                    <View style={{marginHorizontal: 5}} key={robin.id}>
                      <Image source={imageUrl} style={[styles.avtarImage]} />
                    </View>
                  );
                })}
            </ScrollView>
          </View>

          <NearDrive navigation={this.props.navigation} />

          <View style={{marginBottom: 80}}>
            <FoodDonationDrive navigation={this.props.navigation} />

            {/* <FlatList
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        contentInsetAdjustmentBehavior="automatic"
                        legacyImplementation={false}
                        data={this.state.items}
                        renderItem={this.renderItem}
                        ListFooterComponent={<View style={{ width: 20 }}></View>}
                    /> */}
          </View>
        </ScrollView>
        {/* <View style={{position:'absolute',bottom:0,backgroundColor:'#fff',width:'100%'}}> */}

        <CurrentDrive
          navigation={this.props.navigation}
          screenProps={this.props.screenProps}
        />
        {/* </View> */}
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
    borderWidth: 1,
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
