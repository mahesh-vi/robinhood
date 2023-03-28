import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import AppStyle from '../../style/AppStyle';
import Loader from '../../components/Loader';
import {DriveListItem} from '../../components/DriveListItem';
import FilterOption from '../../components/FilterOption';

import DriveService from '../../services/DriveService';
import CommonUtil from '../../utils/CommonUtil';
import StyleApp from '../../style/NewAppStyle';
import CityAdminService from '../../services/CityAdminService';

export default class NextFoodDonationList extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showFilter: false,
      userType: null,
      drives: [],
    };
  }

  UNSAFE_componentWillMount = () => {
    // DriveService.getFoodDonationDrive()
    this.getDriveList();
  };

  getDriveList(filter) {
    this.setState({loading: true});

    DriveService.getNextFoodDonationDrive(filter)
      .then((res) => {
        console.log(res);

        this.setState({
          loading: false,
          drives: CommonUtil.sortBy(res.data.data, {
            prop: 'date',
            desc: true,
            parser: function (item) {
              return new Date(item);
            },
          }),
        });
      })
      .catch((error) => {
        this.setState({loading: false});
        console.log(error);
        CommonUtil.errorMessage(error, this.props);
      });
  }

  renderItem = (item) => {
    const drive = item.item;

    const privousDrive =
      item.index > 0 ? this.state.drives[item.index - 1] : item.item;

    let isNotSameMonth =
      item.index == 0 ||
      moment(drive.date).format('MM') !==
        moment(privousDrive.date).format('MM');
    return (
      <DriveListItem
        isNotSameMonth={isNotSameMonth}
        drive={drive}
        removeCounter={true}
        onPress={() => {
          this.props.navigation.navigate('UpcomingDriveDetail', {
            header: {
              title: 'Food Donation Drive',
              subTitle: 'Check all next donation drives hear',
            },
            drive: drive,
          });
        }}
      />
    );
  };

  onApplyFilter = (filter) => {
    this.setState({showFilter: false});
    console.log(filter);
    this.getDriveList(filter);
  };

  renderEmptyComponent = () => {
    if (this.state.loading) {
      return null;
    }
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
        <Text>No any drives.</Text>
      </View>
    );
  };

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View style={{marginHorizontal: 20}}>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              justifyContent: 'space-between',
            }}>
            <Ionicons
              name={'ios-arrow-back'}
              size={30}
              onPress={() => this.props.navigation.goBack()}
            />

            <View style={{marginLeft: 10}}>
              <Text style={[StyleApp.headerText]}>Food Donation Drive</Text>
              <Text style={[StyleApp.headerSubText]}>
                Check all next donation drives hear
              </Text>
            </View>
            <FeatherIcons
              name={'filter'}
              size={25}
              style={{alignSelf: 'center', justifyContent: 'center'}}
              onPress={() => this.setState({showFilter: true})}
            />
          </View>

          <Image
            source={require('../../assets/images/help_serve_2.png')}
            style={{width: '100%', height: 120}}
            resizeMode={'stretch'}
          />

          <FlatList
            data={this.state.drives}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item) => '' + item.drive_id}
            ListEmptyComponent={this.renderEmptyComponent.bind(this)}
          />
        </View>

        <FilterOption
          showModal={this.state.showFilter}
          onClose={() => this.setState({showFilter: false})}
          onApplyFilter={this.onApplyFilter}
        />
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
