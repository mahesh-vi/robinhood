import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from '';
import TextField from '../../components/TextField';
import CommonService from '../../services/CommonService';
import PickerDropdown from '../../components/PickerDropdown';
import ExtendDatePicker from '../../components/ExtendDatePicker';
import Loader from '../../components/Loader';
import Userservice from '../../services/Userservice';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
var options = {
  title: 'Select image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class EditProfile extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  user = global.user;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isDonor: null,
      countriesList: [],
      userDetail: JSON.parse(JSON.stringify(global.user)),
      formErrors: {},
    };
    this.getImage = this.getImage.bind(this);
  }

  UNSAFE_componentWillMount = () => {
    CommonService.getCountries()
      .then((res) => {
        this.setState({countriesList: res.data});
        this.onChangeCountries(this.state.userDetail.country.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * @method onChangeCountries
   * @description country picker onChange listener when change value
   */
  onChangeCountries = (countryid) => {
    CommonService.getState(countryid)
      .then((res) => {
        const stateList = res.data;
        this.setState({stateList: stateList});
        const state_id =
          this.user.countryid == countryid
            ? this.user.state_id
            : stateList[0].id;
        this.onChangeState(state_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * @method onChangeState
   * @description state picker onChange listener when change value
   */
  onChangeState = (stateid) => {
    CommonService.getCity(stateid)
      .then((res) => {
        this.setState({cityList: res.data});
        // this.onChangeCity(this.state.userDetail.city_id);

        const city_id =
          this.user.city_id == stateid ? this.user.city_id : res.data[0].id;
        this.onChangeCity(city_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * @method onChangeState
   * @description state picker onChange listener when change value
   */
  onChangeCity = (cityid) => {
    CommonService.getZone(cityid)
      .then((res) => {
        this.setState({zoneList: res.data});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * @function register
   * @description register user in application
   */

  updateProfile = () => {
    try {
      const {userDetail, image_uri} = this.state;
      if (Object.keys(this.validateField()).length == 0) {
        console.log(userDetail);
        this.setState({loading: true});

        Userservice.updateProfile(userDetail, image_uri)
          .then((res) => {
            console.log('Update Profile', res);
            const {data} = res;
            global.user = data;
            AsyncStorage.multiSet([['user', JSON.stringify(data)]]);

            this.setState({loading: false});
            this.props.navigation.goBack();
          })
          .catch((error) => {
            console.log(error);
            const {message, errors} = error;
            let errorList = [];

            Object.keys(errors).forEach((item) => {
              errorList.push(errors[item][0]);
            });

            let fieldValidationErrors = {
              generalError: errorList,
            };
            this.setState({formErrors: fieldValidationErrors, loading: false});
          });
      }
    } catch (error) {
      console.log('Catch', error);
      this.setState({loading: false});
    }
  };

  /**
   * @method validateField
   * @description check validation of all user information
   */
  validateField() {
    const {
      firstname,
      lastname,
      phone,
      country_id,
      state_id,
      city_id,
      email,
      password,
      password_confirmation,
    } = this.state.userDetail;
    let fieldValidationErrors = {};

    if (!firstname) {
      fieldValidationErrors.firstname = 'First Name is required.';
    }

    if (!lastname) {
      fieldValidationErrors.lastname = 'Last Name is required.';
    }

    if (!phone) {
      fieldValidationErrors.phone = 'WhatsApp Number is required.';
    }

    if (!country_id) {
      fieldValidationErrors.country_id = 'Country is required.';
    }

    if (!state_id) {
      fieldValidationErrors.state_id = 'State is required.';
    }

    if (!city_id) {
      fieldValidationErrors.city_id = 'City is required.';
    }

    if (!email) {
      fieldValidationErrors.email = 'Email is required.';
    }

    this.setState({
      formErrors: fieldValidationErrors,
    });
    console.log(fieldValidationErrors);
    return fieldValidationErrors;
  }

  /**
   * @name getImage
   * @description get drive image from device
   */
  getImage() {
    const _this = this;
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Image picker response', response);
      const data = response;
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(data);
        let imageData = data;
        delete imageData.data;
        _this.setState({
          image_uri: imageData,
        });
      }
    });
  }

  render() {
    const imageURL = this.state.image_uri
      ? {uri: this.state.image_uri.uri}
      : this.state.userDetail.image
      ? {uri: this.state.userDetail.image}
      : require('../../assets/images/user_male.png');
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View
          style={{
            flex: 1,
            marginHorizontal: 20,
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Image
            source={require('../../assets/images/app_icon.png')}
            style={[styles.iconImage]}
            resizeMode={'stretch'}
          />
          <View style={{marginLeft: 10}}>
            <Text style={StyleApp.headerText}>Profile</Text>
            {/* <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 10, color: '#615f71' }}>Fill the below form to join the army</Text> */}
          </View>

          <TouchableOpacity
            style={{borderRadius: 40, width: 80, height: 80}}
            onPress={this.getImage}>
            <Image
              source={imageURL}
              style={[{width: 80, height: 80, borderRadius: 40}]}
            />
            <Text style={{width: 80, fontSize: 12, textAlign: 'center'}}>
              Change
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{marginLeft: '10%', width: '80%'}}>
          <TextField
            placeholder={'First Name'}
            style={styles.inputContainer}
            value={this.state.userDetail.firstname}
            onChangeText={(text) =>
              this.setState({
                userDetail: Object.assign(this.state.userDetail, {
                  firstname: text,
                }),
              })
            }
          />
          {this.state.formErrors.firstname &&
            !this.state.userDetail.firstname && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.firstname}
              </Text>
            )}

          <TextField
            placeholder={'Last Name'}
            style={styles.inputContainer}
            value={this.state.userDetail.lastname}
            onChangeText={(text) =>
              this.setState({
                userDetail: Object.assign(this.state.userDetail, {
                  lastname: text,
                }),
              })
            }
          />
          {this.state.formErrors.lastname &&
            !this.state.userDetail.lastname && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.lastname}
              </Text>
            )}

          <TextField
            placeholder={'Whatsapp Number'}
            style={styles.inputContainer}
            keyboardType={'number-pad'}
            value={this.state.userDetail.phone}
            maxLength={10}
            onChangeText={(value) => {
              if (/^\d+$/.test(value.toString())) {
                this.setState({
                  userDetail: Object.assign(this.state.userDetail, {
                    phone: value,
                  }),
                });
              } else if (value == '') {
                this.setState({
                  userDetail: Object.assign(this.state.userDetail, {
                    phone: value,
                  }),
                });
              }
              // this.setState({ userDetail: Object.assign(this.state.userDetail, { phone: text }) });
            }}
            // onChangeText={text => this.setState({ userDetail: Object.assign(this.state.userDetail, { phone: text }) })}
          />
          {this.state.formErrors.phone && !this.state.userDetail.phone && (
            <Text style={[AppStyle.errorText]}>
              {' '}
              {this.state.formErrors.phone}
            </Text>
          )}

          <View>
            <ExtendDatePicker
              label="Date of birth"
              mode="date"
              maximumDate={new Date()}
              date={this.state.userDetail.bod}
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 20,
                  paddingHorizontal: 5,
                },
                styles.inputContainer,
              ]}
              removeIcon={true}
              onSelect={(date) => {
                this.setState({
                  userDetail: Object.assign(this.state.userDetail, {bod: date}),
                });
              }}
            />
            {this.state.formErrors.bod && (
              <Text style={[AppStyle.errorText]}>
                {this.state.formErrors.bod}
              </Text>
            )}
          </View>

          <PickerDropdown
            placeholder={'Country'}
            data={this.state.countriesList}
            value={this.state.userDetail.country_id}
            onChange={(item) => {
              this.setState({
                userDetail: Object.assign(this.state.userDetail, {
                  country_id: item,
                }),
              });
              this.onChangeCountries(item);
            }}
          />

          <PickerDropdown
            placeholder={'State'}
            data={this.state.stateList}
            value={this.state.userDetail.state_id}
            onChange={(item) => {
              this.setState({
                userDetail: Object.assign(this.state.userDetail, {
                  state_id: item,
                }),
              });
              this.onChangeState(item);
            }}
          />

          <PickerDropdown
            placeholder={'City'}
            data={this.state.cityList}
            value={this.state.userDetail.city_id}
            onChange={(item) => {
              console.log(item);
              this.setState({
                userDetail: Object.assign(this.state.userDetail, {
                  city_id: item,
                }),
              });
              this.onChangeCity(item);
            }}
          />

          <PickerDropdown
            placeholder={'Zone'}
            data={this.state.zoneList}
            value={this.state.userDetail.zone_id}
            onChange={(item) => {
              console.log(item);
              this.setState({
                userDetail: Object.assign(this.state.userDetail, {
                  zone_id: item,
                }),
              });
            }}
          />

          <TextField
            editable={false}
            placeholder={'Email'}
            keyboardType={'email-address'}
            autoCapitalize="none"
            style={styles.inputContainer}
            value={this.state.userDetail.email}
            onChangeText={(text) =>
              this.setState({
                userDetail: Object.assign(this.state.userDetail, {email: text}),
              })
            }
          />
          {this.state.formErrors.email && !this.state.userDetail.email && (
            <Text style={[AppStyle.errorText]}>
              {' '}
              {this.state.formErrors.email}
            </Text>
          )}

          <Text style={[AppStyle.errorText]}>
            {this.state.formErrors.generalError}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            {
              left: '10%',
              marginVertical: 20,
              height: 44,
              width: '80%',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            },
            AppStyle.primaryBackgroundColor,
          ]}
          onPress={this.updateProfile}>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontFamily: 'Montserrat-Regular',
            }}>
            Update
          </Text>
        </TouchableOpacity>
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
    width: 80,
    height: 80,
    borderRadius: 10,
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
    marginBottom: 0,
    marginTop: 5,
    width: '100%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
});
