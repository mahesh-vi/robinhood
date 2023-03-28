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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TextField from '../../components/TextField';
import Loader from '../../components/Loader';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';

import CommonService from '../../services/CommonService';
import Authentication from '../../services/Authentication';

export default class AboutRha extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      formErrors: {},
      favSport0: undefined,
      favSport1: undefined,
    };
  }

  componentDidMount() {
    this.setState({loading: true});
    CommonService.getCMS('abount_rha')
      .then((res) => {
        this.setState({data: res.data, loading: false});
      })
      .catch((error) => {
        console.log(error);
        this.setState({loading: false});
      });
  }

  submit = () => {
    // this.props.navigation.navigate('VerifyOtp');
    try {
      const {email} = this.state;
      if (Object.keys(this.validateField()).length == 0) {
        this.setState({loading: true});
        Authentication.forgotPassword(email)
          .then((res) => {
            this.setState({loading: false});
            let data = res.data;
            data.email = email;

            this.props.navigation.navigate('VerifyOtp', {
              data: data,
            });
          })
          .catch((error) => {
            console.log('Forgot', error);
            this.setState({formErrors: error.data, loading: false});
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  validateField() {
    const {email} = this.state;
    let fieldValidationErrors = {};

    if (!email || email.trim() == '') {
      fieldValidationErrors.email = 'Email is required';
    }

    this.setState({
      formErrors: fieldValidationErrors,
    });
    return fieldValidationErrors;
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View style={{marginHorizontal: 20, marginVertical: 15}}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons
              name={'ios-arrow-back'}
              size={30}
              onPress={() => this.props.navigation.goBack()}
            />
            <View style={{marginLeft: 20}}>
              <Text style={[StyleApp.headerText]}>About RHA</Text>
              <Text style={[StyleApp.headerSubText]}>Check about RHA</Text>
            </View>
          </View>

          {this.state.data && (
            <View style={[styles.formContainer]}>
              <Text style={[StyleApp.semiBoldFont, StyleApp.font16]}>
                {this.state.data.description}
              </Text>
            </View>
          )}
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
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginTop: 40,
  },
  formContainer: {
    margin: 20,
    marginTop: 30,
  },
  seperation: {
    width: '80%',
    height: 20,
    left: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  orLable: {
    height: 20,
    top: -10,
    display: 'flex',
    backgroundColor: '#ffffff',
    zIndex: 9999,
    paddingHorizontal: 5,
    color: '#9B99A9',
    fontFamily: 'Montserrat-Regular',
  },
});
