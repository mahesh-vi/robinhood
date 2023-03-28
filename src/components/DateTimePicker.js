import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
  Platform,
  Modal,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

import AppStyle from '../style/AppStyle';

import FeatherIcon from 'react-native-vector-icons/Feather';

export default class CustomDateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // date: new Date(),
      mode: 'date',
      show: false,
    };
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
    this.props.onSelect(date);
  };

  show = (mode) => {
    this.setState({
      show: true,
      mode,
    });
  };

  datepicker = () => {
    this.show('date');
  };

  timepicker = () => {
    this.show('time');
  };

  render() {
    const {show} = this.state;
    const {date, mode, minimumDate, label} = this.props;

    if (Platform.OS === 'android') {
      return (
        <View>
          {mode == 'date' && (
            <View style={[styles.inputContainer]}>
              <TouchableOpacity
                style={[AppStyle.borderWidth2]}
                onPress={this.datepicker}>
                <Text
                  style={[
                    AppStyle.regularFont,
                    AppStyle.grayText,
                    AppStyle.text16,
                  ]}>
                  {' '}
                  {label ? label : 'Select Date'}{' '}
                </Text>
                <FeatherIcon name={'chevron-down'} size={20} />
                <Text style={[AppStyle.regularFont, AppStyle.blackColor]}>
                  {this.state.date &&
                    moment(this.state.date).format('DD-MM-YYYY')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {mode == 'time' && (
            <View style={[styles.inputContainer]}>
              <TouchableOpacity
                style={[AppStyle.borderWidth2]}
                onPress={this.timepicker}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.grayText,
                      AppStyle.text16,
                    ]}>
                    {label ? label : 'Select Time'}{' '}
                  </Text>
                  <FeatherIcon
                    name={'chevron-down'}
                    size={25}
                    style={{top: 2}}
                  />
                </View>
                <Text style={[AppStyle.regularFont, AppStyle.blackColor]}>
                  {this.state.date && moment(this.state.date).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {mode == 'datetime' && (
            <View style={[styles.inputContainer]}>
              <TouchableOpacity
                style={[AppStyle.borderWidth2]}
                onPress={this.timepicker}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.grayText,
                      AppStyle.text16,
                    ]}>
                    {label ? label : 'Select Time'}{' '}
                  </Text>
                  <FeatherIcon
                    name={'chevron-down'}
                    size={25}
                    style={{top: 2}}
                  />
                </View>
                <Text style={[AppStyle.regularFont, AppStyle.blackColor]}>
                  {this.state.date && moment(this.state.date).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {show && (
            <DateTimePicker
              value={date || new Date()}
              mode={mode}
              is24Hour={false}
              display="default"
              onChange={this.setDate}
              minimumDate={
                minimumDate || new Date(moment().format('YYYY-MM-DD'))
              }
            />
          )}
        </View>
      );
    } else {
      return (
        <View>
          {mode == 'date' && (
            <View style={[styles.inputContainer]}>
              <TouchableOpacity
                style={[AppStyle.borderWidth2]}
                onPress={this.datepicker}>
                <Text
                  style={[
                    AppStyle.regularFont,
                    AppStyle.blackColor,
                    AppStyle.text16,
                    {
                      top: !this.state.date
                        ? Platform.OS === 'ios'
                          ? 15
                          : 20
                        : 0,
                    },
                  ]}>
                  {label ? label : 'Select Date'}{' '}
                </Text>
                <Text style={[AppStyle.regularFont, AppStyle.grayText]}>
                  {this.state.date &&
                    moment(this.state.date).format('DD-MM-YYYY')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {mode == 'time' && (
            <View style={[styles.inputContainer]}>
              <TouchableOpacity
                style={[AppStyle.borderWidth2]}
                onPress={this.timepicker}>
                <Text
                  style={[
                    AppStyle.regularFont,
                    AppStyle.blackColor,
                    AppStyle.text16,
                    {
                      top: !this.state.date
                        ? Platform.OS === 'ios'
                          ? 15
                          : 20
                        : 0,
                    },
                  ]}>
                  {label ? label : 'Select Time'}{' '}
                </Text>
                <Text style={[AppStyle.regularFont, AppStyle.grayText]}>
                  {this.state.date && moment(this.state.date).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Modal animationType="slide" transparent={true} visible={show}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  backgroundColor: '#f0f0f0',
                  paddingHorizontal: 10,
                }}>
                <Button
                  onPress={() => {
                    this.setState({
                      show: false,
                      date,
                    });
                    this.props.onSelect(date);
                  }}
                  title="Done"
                />
              </View>
              <View style={{backgroundColor: '#fff'}}>
                <DateTimePicker
                  value={date || new Date()}
                  mode={mode}
                  is24Hour={false}
                  display="default"
                  onChange={this.setDate}
                  minimumDate={
                    minimumDate ||
                    moment(moment().format('YYYY-MM-DD')).toDate()
                  }
                />
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  inputContainer: {
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ececec',
  },
});
