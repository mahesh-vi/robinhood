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
import FeatherIcon from 'react-native-vector-icons/Feather';
import moment from 'moment';
import AppStyle from '../../style/AppStyle';
import StyleApp from '../../style/NewAppStyle';
import Loader from '../../components/Loader';
import CompleteDriveModal from './CompleteDriveModal';

import ImagePicker from 'react-native-image-crop-picker';
import DriveService from '../../services/DriveService';
import CommonUtil from '../../utils/CommonUtil';

export default class CompleteDrive extends Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showComplete: false,
      drive: this.props.navigation.getParam('drive', null),
      album_images: [],
      formErrors: {},
    };
    this.getImage = this.getImage.bind(this);
  }

  /**
   * @name getImage
   * @description get drive image from device
   */
  getImage() {
    const _this = this;

    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    }).then((images) => {
      let album_images = [..._this.state.album_images, ...images];
      _this.setState({
        album_images: album_images,
      });
    });
  }

  submit = () => {
    try {
      if (Object.keys(this.validateField()).length == 0) {
        const {
          total_robins,
          food_quantity,
          album_images,
          description,
          count_serve,
        } = this.state;
        const {id, drive_id} = this.state.drive;
        const requestData = {
          food_quantity,
          total_robins,
          album_images,
          description,
          count_serve,
        };

        console.log(requestData);
        this.setState({loading: true});
        DriveService.completeDrive(id || drive_id, requestData)
          .then((res) => {
            this.setState({loading: false, showComplete: true});
            this.props.screenProps.eventEmitter.emit('ViewUpdate', {count: 1});
          })
          .catch((error) => {
            console.log(error);
            this.setState({loading: false});
            CommonUtil.errorMessage(error, this.props);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  validateField() {
    const {
      total_robins,
      food_quantity,
      album_images,
      description,
      count_serve,
    } = this.state;
    let fieldValidationErrors = {};

    if (!total_robins) {
      fieldValidationErrors.total_robins = 'Total robin is required';
    } else if (total_robins <= 0) {
      fieldValidationErrors.total_robins = 'Total robin must be greater than 0';
    }

    if (!food_quantity) {
      fieldValidationErrors.food_quantity = 'Food Quantity is required';
    } else if (food_quantity <= 0) {
      fieldValidationErrors.food_quantity =
        'Food Quantity must be greater than 0';
    }

    if (!count_serve) {
      fieldValidationErrors.count_serve = 'Served People is required';
    } else if (count_serve <= 0) {
      fieldValidationErrors.count_serve =
        'Served People must be greater than 0';
    }

    if (album_images.length < 4) {
      fieldValidationErrors.album_images =
        'Upload minimum 4 Photos is required';
    }

    if (!description) {
      fieldValidationErrors.description = 'Description is required';
    }

    this.setState({
      formErrors: fieldValidationErrors,
    });
    return fieldValidationErrors;
  }

  render() {
    const driveData = this.state.drive;
    return (
      <ScrollView style={styles.mainContainer}>
        <Loader loading={this.state.loading} />
        <View style={{marginVertical: 15}}>
          <View
            style={{
              marginHorizontal: 30,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <Text
                style={[
                  AppStyle.blackColor,
                  AppStyle.boldFamily,
                  AppStyle.text20,
                ]}>
                {driveData.drive_name}
              </Text>
              <Text style={[AppStyle.text12, {textTransform: 'uppercase'}]}>
                {moment(driveData.drive_date || driveData.date).format(
                  'DD MMMM YYYY',
                )}
              </Text>
            </View>
            <FeatherIcon
              size={25}
              name={'x'}
              color={AppStyle.grayColor.color}
              onPress={() => this.props.navigation.goBack()}
            />
          </View>

          <View style={[{padding: 20, borderWidth: 0, margin: 10}]}>
            <View style={{marginVertical: 10}}>
              <Text>Drive Number</Text>
              <Text style={[AppStyle.boldFamily]}>
                {driveData.drive_number}
              </Text>
            </View>
            <View style={{marginVertical: 10}}>
              <Text>Drive Description</Text>
              <Text style={[AppStyle.boldFamily]}>{driveData.description}</Text>
            </View>

            <View style={{marginVertical: 10}}>
              <Text style={[AppStyle.text12]}>Doner</Text>
              <Text style={[AppStyle.boldFamily, AppStyle.pramaryColor]}>
                {driveData.donar_name}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  StyleApp.regularFont,
                  StyleApp.font12,
                  {flex: 0.6, flexWrap: 'wrap'},
                ]}>
                Specify the overall Food Quantity
              </Text>
              <TextInput
                blurOnSubmit
                returnKeyType="done"
                style={[
                  AppStyle.boldFamily,
                  AppStyle.text20,
                  {borderBottomWidth: 2, width: 60, textAlign: 'center'},
                ]}
                value={this.state.food_quantity}
                keyboardType={'number-pad'}
                onChangeText={(text) => this.setState({food_quantity: text})}
              />
            </View>
            {this.state.formErrors.food_quantity && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.food_quantity}
              </Text>
            )}

            <View
              style={{
                flex: 1,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  StyleApp.regularFont,
                  StyleApp.font12,
                  {flex: 0.6, flexWrap: 'wrap'},
                ]}>
                Specify the total number of Robins
              </Text>
              <TextInput
                blurOnSubmit
                returnKeyType="done"
                style={[
                  AppStyle.boldFamily,
                  AppStyle.text20,
                  {borderBottomWidth: 2, width: 60, textAlign: 'center'},
                ]}
                value={this.state.total_robins}
                keyboardType={'number-pad'}
                onChangeText={(text) => this.setState({total_robins: text})}
              />
            </View>
            {this.state.formErrors.total_robins && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.total_robins}
              </Text>
            )}

            <View
              style={{
                flex: 1,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  StyleApp.regularFont,
                  StyleApp.font12,
                  {flex: 0.6, flexWrap: 'wrap'},
                ]}>
                Specify the total number of served people
              </Text>
              <TextInput
                blurOnSubmit
                returnKeyType="done"
                style={[
                  AppStyle.boldFamily,
                  AppStyle.text20,
                  {borderBottomWidth: 2, width: 60, textAlign: 'center'},
                ]}
                value={this.state.count_serve}
                keyboardType={'number-pad'}
                onChangeText={(text) => this.setState({count_serve: text})}
              />
            </View>
            {this.state.formErrors.count_serve && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.count_serve}
              </Text>
            )}

            <View style={{flex: 1, marginVertical: 10}}>
              <Text
                style={[
                  StyleApp.regularFont,
                  StyleApp.font12,
                  {flex: 0.6, flexWrap: 'wrap'},
                ]}>
                Upload Drive Images
              </Text>

              <View
                style={{
                  borderRadius: 4,
                  borderWidth: 0.5,
                  minHeight: 200,
                  marginTop: 10,
                }}>
                <FlatList
                  data={this.state.album_images}
                  renderItem={({item, index}) => (
                    <View style={{flex: 1, flexDirection: 'column', margin: 1}}>
                      <TouchableOpacity key={index} style={{flex: 1}}>
                        <Image
                          style={styles.image}
                          source={{
                            uri: item.path,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  //Setting the number of column
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity
                  style={{marginVertical: 5}}
                  onPress={this.getImage}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      padding: 20,
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../../assets/images/image_upload.png')}
                      style={{marginVertical: 10}}
                    />

                    <Text
                      style={[
                        AppStyle.text12,
                        {textAlign: 'center', flexWrap: 'wrap'},
                      ]}>
                      Upload minimum 4 Photos of the revent drive which reflects
                      food distribution.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {this.state.formErrors.album_images && (
                <Text style={[AppStyle.errorText]}>
                  {' '}
                  {this.state.formErrors.album_images}
                </Text>
              )}
            </View>

            <Text
              style={[
                AppStyle.text14,
                StyleApp.grayColor,
                StyleApp.mediumFont,
              ]}>
              Write short Description
            </Text>

            <TextInput
              style={[
                AppStyle.regularFont,
                {
                  justifyContent: 'flex-start',
                  height: 100,
                  textAlignVertical: 'top',
                  borderBottomWidth: 1,
                  borderBottomColor: '#dedede',
                },
              ]}
              underlineColorAndroid="transparent"
              placeholder="Message..."
              placeholderTextColor="grey"
              numberOfLines={5}
              multiline={true}
              value={this.state.description}
              onChangeText={(text) => this.setState({description: text})}
            />
            {this.state.formErrors.description && (
              <Text style={[AppStyle.errorText]}>
                {' '}
                {this.state.formErrors.description}
              </Text>
            )}

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
              onPress={() => {
                this.submit();
              }}>
              <Text
                style={{
                  color: '#fff',
                  textTransform: 'uppercase',
                  fontFamily: 'Montserrat-Bold',
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {this.state.showComplete && (
          <CompleteDriveModal
            showModal={this.state.showComplete}
            onClose={() => {
              this.setState({showComplete: false});
            }}
            navigation={this.props.navigation}
          />
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
    height: 30,
    width: 30,
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
});
