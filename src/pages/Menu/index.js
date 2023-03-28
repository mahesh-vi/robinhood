import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Loader from '../../components/Loader';
import Authentication from '../../services/Authentication';
import CommonUtil from '../../utils/CommonUtil';
import StyleApp from '../../style/NewAppStyle';

export default class Menu extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userType: null,
    };
  }

  logout = () => {
    this.props.screenProps.alert({
      title: 'Robinhood',
      body: 'Are you sure you want to logout?',
      type: 'confirm',
      buttons: ['Yes', 'No'],
      ctaOnPress: (text) => {
        this.setState({loading: true});
        Authentication.logout()
          .then((res) => {
            console.log(res);
            this.setState({loading: false});
            CommonUtil.logout(this.props.navigation);
          })
          .catch((error) => {
            this.setState({loading: false});
            console.log(error);
          });
      },
    });
  };

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View style={{marginHorizontal: 20, marginVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name={'ios-arrow-back'}
              size={30}
              onPress={() => this.props.navigation.navigate('Dashboard')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={[StyleApp.headerText]}>Menu</Text>
              <Text style={[StyleApp.headerSubText]}>
                Navigate the App from the menu
              </Text>
            </View>
          </View>

          {/* <View style={{ borderBottomWidth: 1, borderBottomColor: '#efefef',marginTop: 20 }}>

                        <TouchableOpacity style={[styles.menuItem]}   onPress={()=>{
                            this.props.navigation.navigate('Profile');
                        }}>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ backgroundColor: "#eaeaea", width: 20, borderRadius: 10, height: 20, marginRight: 25 }}></View>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Profile</Text>

                            </View>

                        </TouchableOpacity>


                    </View> */}

          <View style={{borderBottomWidth: 1, borderBottomColor: '#efefef'}}>
            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                this.props.navigation.navigate('MyDrives');
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.oval}></View>
                <Text style={styles.menuItemText}>My Drives</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{borderBottomWidth: 1, borderBottomColor: '#efefef'}}>
            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                this.props.navigation.navigate('UpcomingDrives');
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.oval}></View>
                <Text style={styles.menuItemText}>Upcoming Drives</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{borderBottomWidth: 1, borderBottomColor: '#efefef'}}>
            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                this.props.navigation.navigate('MyAchivement');
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.oval}></View>
                <Text style={styles.menuItemText}>My Achivements</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{borderBottomWidth: 1, borderBottomColor: '#efefef'}}>
            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                this.props.navigation.navigate('AboutRha');
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.oval}></View>
                <Text style={styles.menuItemText}>About RHA</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{borderBottomWidth: 1, borderBottomColor: '#efefef'}}>
            <TouchableOpacity style={[styles.menuItem]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.oval}></View>
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{borderBottomWidth: 1, borderBottomColor: '#efefef'}}>
            <TouchableOpacity style={[styles.menuItem]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.oval}></View>
                <Text style={styles.menuItemText}>News</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{borderBottomWidth: 1, borderBottomColor: '#efefef'}}>
            <TouchableOpacity style={[styles.menuItem]} onPress={this.logout}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.oval}></View>
                <Text style={styles.menuItemText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
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
  menuItem: {
    marginVertical: 10,
    height: 75,
    justifyContent: 'center',
  },
  menuItemText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#5F5D70',
  },
  oval: {
    backgroundColor: '#eaeaea',
    width: 30,
    borderRadius: 15,
    height: 30,
    marginRight: 30,
  },
});
