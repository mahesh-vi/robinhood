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

import AppStyle from '../../style/AppStyle';
import NewAppStyle from '../../style/NewAppStyle';
import UserService from '../../services/Userservice';
export default class DashboardStat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showDrivePopup: false,
    };
  }

  UNSAFE_componentWillMount() {
    Promise.all([UserService.dashboardCount()])
      .then((res) => {
        this.setState({
          dashboadDetail: res[0].data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const dashboadDetail = this.state.dashboadDetail || {};

    return (
      <View style={{marginVertical: 10}}>
        {/* <View style={{ marginHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[AppStyle.regularFont, { fontSize: 10 }]}>Food Donation Drives</Text>
                        <View style={{ marginLeft: 10, borderRadius: 10, backgroundColor: '#00CA9D', marginLeft: 10, paddingHorizontal: 10 }}>
                            <Text style={[AppStyle.mediumFont, { fontSize: 12, color: '#fff' }]}>Ahmedabad</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                        <Image source={require(`../../assets/images/app_icon.png`)} style={[{ width: 40, height: 40 }]} />
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={[AppStyle.regularFont,AppStyle.textCenter, { fontSize: 22 }]}>{dashboadDetail.total_drive}</Text>
                            <Text style={[AppStyle.regularFont, { fontSize: 8 }]}>Total Drive</Text>
                        </View>
                        <View style={{ backgroundColor: '#fff' }}>
                            <Svg height="50" width="15">
                                <Polyline
                                    points="0,0,0,20,7,25,0,30, 0,50"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="0.5"
                                />
                            </Svg>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[AppStyle.semiBoldFamily, { fontSize: 8 }]}>People served</Text>
                                <Text style={[AppStyle.regularFont, AppStyle.grayColor, { fontSize: 22 }]}>{dashboadDetail.total_people_serve}</Text>
                            </View>
                            <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
                                <Text style={[AppStyle.semiBoldFamily, { fontSize: 8 }]}>Volunteers</Text>
                                <Text style={[AppStyle.regularFont, AppStyle.grayColor, { fontSize: 22 }]}>{dashboadDetail.totle_volunteers}</Text>
                            </View>
                            <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
                                <Text style={[AppStyle.semiBoldFamily, { fontSize: 8 }]}>My Drives</Text>
                                <Text style={[AppStyle.regularFont, AppStyle.grayColor, { fontSize: 22 }]}>{dashboadDetail.my_drive}</Text>
                            </View>
                            <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
                                <FeatherIcon size={25} name={'arrow-right'} color={'rgb(114,191,112)'} onPress={() => this.props.navigation.navigate('DashboardDetails')} />
                            </View>
                        </View>
                    </View>
                </View> */}

        <View
          style={[
            {
              marginHorizontal: 20,
              flexDirection: 'row',
              backgroundColor: '#fff',
              borderRadius: 5,
              minHeight: 100,
            },
            styles.boxWithShadow,
          ]}
          onTouchEnd={() => this.props.navigation.navigate('DashboardDetails')}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flex: 1, padding: 20}}>
              <Text
                style={[
                  NewAppStyle.boldFont,
                  NewAppStyle.font12,
                  {color: '#24253D', textAlign: 'center'},
                ]}>
                Overall Drive
              </Text>
              <Text
                style={[
                  NewAppStyle.lightFont,
                  NewAppStyle.font34,
                  {color: '#24253D', textAlign: 'center'},
                ]}>
                {dashboadDetail.my_drive}
              </Text>
            </View>
            <View style={{backgroundColor: '#D8D8D8', width: 1, height: 50}} />
            <View style={{flex: 1, padding: 20}}>
              <Text
                style={[
                  NewAppStyle.boldFont,
                  NewAppStyle.font12,
                  {color: '#24253D', textAlign: 'center'},
                ]}>
                People Served
              </Text>
              <Text
                style={[
                  NewAppStyle.lightFont,
                  NewAppStyle.font34,
                  {color: '#24253D', textAlign: 'center', lineHeight: 42},
                ]}>
                {dashboadDetail.total_people_serve}
              </Text>
            </View>
          </View>
          <View style={[styles.triangleShapeCSS]} />
        </View>
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
  boxWithShadow: {
    shadowColor: '#25265E',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.58,
    shadowRadius: 0.0,

    elevation: 12,
  },
  triangleShapeCSS: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderTopWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: NewAppStyle.primaryColor.color,
    borderTopColor: NewAppStyle.primaryColor.color,
    borderTopRightRadius: 5,
    // position:'absolute',
    // right:0
  },
});
