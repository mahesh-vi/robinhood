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
  TouchableWithoutFeedback,
} from 'react-native';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DriveService from '../../services/DriveService';
import CommonUtil from '../../utils/CommonUtil';
import SectionHeader from '../../components/SectionHeader';

export default class RecentCompleted extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showDrivePopup: false,
    };
  }

  UNSAFE_componentWillMount() {
    Promise.all([DriveService.getComletedDrive()])
      .then((res) => {
        this.setState({
          completedDrive: res[0].data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onPressDrive = (drive) => {
    console.log(drive);
    this.props.navigation.navigate('MyDriveDetail', {
      drive: drive,
    });
    // this.setState({selectedDrive:drive, showDrivePopup: true });
  };

  renderVolunteer = (item) => {
    const imageUrl = item.image_url
      ? {uri: item.image_url}
      : require('../../assets/images/user_male.png');

    return (
      <Image key={item.id} source={imageUrl} style={[styles.avtarImage]} />
    );
  };

  render() {
    return (
      <View>
        <SectionHeader
          title="Recently Completed"
          action="Show More"
          onPressAction={() => {
            this.props.navigation.navigate('MyDrives');
          }}
        />

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{paddingRight: 10, marginLeft: 10}}>
          {this.state.completedDrive &&
            this.state.completedDrive.slice(0, 5).map((drive) => {
              return (
                <TouchableOpacity
                  key={drive.id}
                  style={[
                    {
                      margin: 10,
                      padding: 10,
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      borderLeftWidth: 5,
                      borderColor: '#75c672',
                      justifyContent: 'space-between',
                      minHeight: 100,
                    },
                    ,
                    StyleApp.boxShadow,
                  ]}
                  onPress={() => {
                    this.onPressDrive(drive);
                  }}>
                  <View
                    style={[
                      {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        minWidth: 200,
                      },
                    ]}>
                    <View>
                      <Text style={[styles.driveName]}>{drive.name}</Text>
                      <Text style={[styles.description]}>
                        {CommonUtil.getTime(drive.start_time) +
                          '-' +
                          CommonUtil.getTime(drive.end_time)}
                      </Text>
                    </View>
                    <View
                      style={[
                        {
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginHorizontal: 10,
                          padding: 10,
                          borderRadius: 50,
                        },
                        StyleApp.primaryBackgroundColor,
                      ]}>
                      <Text
                        style={[
                          StyleApp.boldFont,
                          AppStyle.whiteColor,
                          {fontSize: 11},
                        ]}>
                        {drive.count_serve ? drive.count_serve + '+' : 0}
                      </Text>
                      <Text
                        style={[
                          StyleApp.boldFont,
                          AppStyle.whiteColor,
                          {fontSize: 7},
                        ]}>
                        Served
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 5,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      {drive.invite_peoples.map((item) => {
                        return this.renderVolunteer(item);
                      })}
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 34,
                        height: 24,
                        marginRight: 12.5,
                        backgroundColor: 'rgb(237,248,239)',
                        borderRadius: 50,
                      }}>
                      <FeatherIcon size={10} name={'check'} color={'#2DC76D'} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

          {/* { this.state.showDrivePopup &&
                    <DriveModal driveDetail={this.state.selectedDrive} showModal={this.state.showDrivePopup} onClose={() => { this.setState({ showDrivePopup: false }) }} />
                    } */}
        </ScrollView>
        {!this.state.completedDrive && (
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
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 5,
  },
  boxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  driveName: {
    ...StyleApp.semiBoldFont,
    ...StyleApp.blackColor,
    ...StyleApp.font12,
  },
  description: {
    ...StyleApp.mediumFont,
    ...StyleApp.grayColor,
    ...StyleApp.font10,
  },
});
