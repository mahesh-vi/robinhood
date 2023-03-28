import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Alert,
  StyleSheet,
  TextInput,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AppStyle from '../style/AppStyle';
import StyleApp from '../style/NewAppStyle';

import moment from 'moment';
import PickerDropdown from './PickerDropdown';
import CommonService from '../services/CommonService';
import DriveService from '../services/DriveService';
import MaterialPicker from './MaterialPicker';

export default class JoinModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formErrors: {},
    };
  }

  UNSAFE_componentWillMount = () => {
    CommonService.getJoinReason()
      .then((res) => {
        this.setState({cancelReaons: res.data});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onJoin = () => {
    if (Object.keys(this.validateField()).length == 0) {
      const {selectedReason} = this.state;

      console.log('Selected Reason', selectedReason);
      this.props.onClose(selectedReason);
    }
  };

  validateField() {
    const {selectedReason, cancel_message} = this.state;
    let fieldValidationErrors = {};

    if (!selectedReason) {
      fieldValidationErrors.selectedReason = 'Please select any reason';
    } else {
      if (selectedReason == 5) {
        if (!cancel_message) {
          fieldValidationErrors.cancel_message =
            'Message required for Other reason';
        }
      }
    }

    this.setState({
      formErrors: fieldValidationErrors,
    });
    return fieldValidationErrors;
  }

  render() {
    const driveData = this.props.driveData;
    return (
      <View style={{alignItems: 'center', flex: 1}}>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.props.showModal}
          onRequestClose={() => {
            this.props.onClose();
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.onClose();
            }}>
            <View style={{backgroundColor: 'transparent', height: '28%'}} />
          </TouchableWithoutFeedback>
          <ScrollView style={{backgroundColor: '#fff'}}>
            <View style={[styles.mainView, AppStyle.boxWithShadow]}>
              <FeatherIcon
                name={'chevron-down'}
                size={30}
                style={{alignSelf: 'flex-start', left: 20, marginVertical: 10}}
                color={StyleApp.primaryColor.color}
                onPress={() => {
                  this.props.onClose();
                }}
              />
              <View style={{marginHorizontal: 20}}>
                <Text
                  style={[
                    AppStyle.mediumFont,
                    AppStyle.blackColor,
                    StyleApp.font24,
                  ]}>
                  {'Do you want to join this drive?'}
                </Text>

                <View style={{marginVertical: 20}}>
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
                <View style={{marginVertical: 10}}>
                  <Text style={[AppStyle.text14, AppStyle.mediumFont]}>
                    Please select a reason{' '}
                    <Text style={[{color: '#f00'}]}>*</Text>
                  </Text>
                  {this.state.cancelReaons && (
                    <View>
                      {/* <PickerDropdown
                                            style={{ backgroundColor: '#fff', borderBottomColor: '#afb4c0', borderBottomWidth: 1 }}
                                            data={this.state.cancelReaons.data}
                                            labelProps={'message'}
                                            value={this.state.selectedReason}
                                            onChange={(item) => {
                                                console.log(item);
                                                this.setState({ selectedReason: item });
                                            }}
                                        /> */}
                      <MaterialPicker
                        labelProps={'message'}
                        data={this.state.cancelReaons.data}
                        onChangeText={(item) => {
                          console.log(item);
                          this.setState({selectedReason: item});
                        }}
                      />
                    </View>
                  )}

                  {!this.state.cancelReaons && (
                    <ActivityIndicator size={'large'} />
                  )}
                  {this.state.formErrors.selectedReason && (
                    <Text style={[AppStyle.errorText]}>
                      {' '}
                      {this.state.formErrors.selectedReason}
                    </Text>
                  )}
                </View>

                <View>
                  <TouchableOpacity
                    style={[
                      {
                        marginTop: 10,
                        height: 44,
                        paddingHorizontal: 30,
                        borderRadius: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      AppStyle.primaryBackgroundColor,
                    ]}
                    onPress={this.onJoin}>
                    <Text
                      style={{
                        color: '#fff',
                        textTransform: 'uppercase',
                        fontFamily: 'Montserrat-Bold',
                      }}>
                      Join Drive
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    height: '100%',
    // top: "15%",
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: 20,
  },
  avtarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
