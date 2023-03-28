import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
import SectionHeader from '../../components/SectionHeader';

import UserService from '../../services/Userservice';

export default class CurrentDrive extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.driveUpdateListener = this.driveUpdateListener.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.getData();

    this.eventEmitter = this.props.screenProps.eventEmitter;

    if (!this.eventEmitter?.listeners('ViewUpdate').length) {
      this.eventEmitter?.addListener('ViewUpdate', this.driveUpdateListener);
    }

    // this.eventEmitter.addListener('ViewUpdate', (data) => {
    //     this.setState({
    //         driveData: undefined,
    //     });
    //     this.getData();
    // });
  }

  componentWillUnmount() {
    this.eventEmitter?.removeListener('ViewUpdate', this.driveUpdateListener);
  }

  driveUpdateListener(data) {
    console.log('Current Drive Update Listeneer');
    var _this = this;
    _this.setState({
      driveData: undefined,
    });
    _this.getData();
  }

  getData() {
    UserService.getCurrentDrive()
      .then((res) => {
        if (!res.data.message) {
          this.setState({
            driveData: res.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (!this.state.driveData) return null;
    return (
      <View
        style={{
          marginHorizontal: 0,
          paddingVertical: 5,
          position: 'absolute',
          bottom: 0,
          backgroundColor: '#fff',
          width: '100%',
        }}>
        {/* <SectionHeader title="Explore Robinhood" action="Show More" onPressAction={() => {
                    
                }} /> */}

        {/* <Image source={require(`../../assets/images/explore_robin.png`)} style={{ width: "100%" }} /> */}

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ActiveDrive', {
              driveId: this.state.driveData.id,
            })
          }
          style={{top: 0}}>
          <View
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                padding: 10,
                borderRadius: 5,
                justifyContent: 'space-between',
                marginHorizontal: 10,
                paddingHorizontal: 20,
                alignItems: 'center',
              },
              AppStyle.primaryBackgroundColor,
            ]}>
            <View
              style={[
                {flexDirection: 'row', alignItems: 'center', width: '80%'},
              ]}>
              <Image
                source={
                  this.state.driveData.image_url
                    ? {uri: `${this.state.driveData.image_url}`}
                    : require(`../../assets/images/app_icon.png`)
                }
                style={[{width: 50, height: 50, borderRadius: 30}]}
              />
              <View style={{paddingHorizontal: 10}}>
                <Text
                  style={[
                    AppStyle.whiteColor,
                    AppStyle.text18,
                    StyleApp.boldFont,
                  ]}>
                  {this.state.driveData.name}
                </Text>
                <Text
                  style={[
                    AppStyle.whiteColor,
                    AppStyle.text14,
                    StyleApp.regularFont,
                  ]}>
                  {moment(this.state.driveData.date).format('DD MMMM YYYY')}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginHorizontal: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require(`../../assets/images/arrow_right_white.png`)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
