import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  Button,
  StyleSheet,
  Platform,
} from 'react-native';
// import { Input } from 'react-native-elements';

import DateTimePicker from '@react-native-community/datetimepicker';
// import XDate from 'xdate';
import moment from 'moment';
import AppStyle from '../style/AppStyle';
import FeatherIcon from 'react-native-vector-icons/Feather';

class ShiftTimingScreen extends Component {
  state = {
    // The values, which we get from each of the DateTimePickers.
    // These values can be saved into your app's state.
    StartingDateTimeValue: null,
    ToDateValue: null,
    ToTimeValue: null,

    // for iOS & Android: When this flag is true, the relevant <DateTimePicker> is displayed
    isStartingDateTimePickerVisible: false,
    isToDatePickerVisible: false,
    isToTimePickerVisible: false,

    // The value of the <DateTimePicker> is stored in this variable, which is used to pass data between the date & time pickers
    dateOrTimeValue: null,

    // ONLY FOR ANDROID: note that the current version of the <DateTimePicker> does NOT support "datetime" mode on Android.
    // So, I am using the following 2 flags (datePickerVisible & timePickerVisible) to provide this functionality.

    // (1) ONLY FOR ANDROID: When the datePickerVisible flag is true, the <DateTimePicker> is displayed in "date" mode
    datePickerVisible: false,

    // (2) ONLY FOR ANDROID: When the timePickerVisible flag is true, the <DateTimePicker> is displayed in "time" mode
    timePickerVisible: false,
    show: false,
  };

  saveStartingDateTime = (value) => {
    console.log('saveStartingDateTime - value:', value);
    this.setState({
      StartingDateTimeValue: value,
    });
  };

  saveEndingDate = (value) => {
    console.log('saveEndingDate - value:', value);
    this.setState({
      ToDateValue: value,
    });
  };

  saveEndingTime = (value) => {
    console.log('saveEndingTime - value:', value);
    this.setState({
      ToTimeValue: value,
    });
  };

  fRenderDateTimePicker = (
    dateTimePickerVisible,
    visibilityVariableName,
    dateTimePickerMode,
    defaultValue,
    saveValueFunctionName,
  ) => {
    // dateTimePickerVisible:   a flag, which is used to show/hide this DateTimePicker
    // visibilityVariableName:              the name of the state variable, which controls showing/hiding this DateTimePicker.
    // The name of the variable is received in (visibilityVariableName), and the value of it is received in the argument (dateTimePickerVisible).
    // dateTimePickerMode:      the mode mode of this DateTimePicker
    // defaultValue:                the default value, which should be selected initially when the DatTimePicker is displayed
    // saveValueFunctionName:   the function, which would be called after the user selects a value.
    // In my case it is a Redux's action creator, which saves the selected value in the app's state.
    return (
      <View>
        {/* A. For iOS, display the picker in "date", "time" or "datetime" mode - No need for any customisation */}

        {/* B.1 For Android - "date" mode:      display the picker in "date" mode */}
        {/*       For Android - "datetime" mode: display the picker in "date" mode (to be followed by another picker (below) in "time" mode) */}
        {Platform.OS === 'android' &&
          dateTimePickerVisible &&
          this.state.datePickerVisible && (
            <DateTimePicker
              mode={'date'}
              display="default" // 'default', 'spinner', 'calendar', 'clock' // Android Only
              value={defaultValue}
              minimumDate={this.props.minimumDate}
              maximumDate={this.props.maximumDate}
              onChange={(event, value) => {
                this.setState({
                  // In case of (mode == datetime), the TIME part will be added to "dateOrTimeValue" using another DateTimePicker (below).
                  dateOrTimeValue: value,
                  datePickerVisible: false,
                });

                // When the mode is "datetime" & this picker was set (the user clicked on OK, rather than cancel),
                // we need to display another DateTimePicker in TIME mode (below)
                if (event.type === 'set' && dateTimePickerMode === 'datetime') {
                  this.setState({
                    timePickerVisible: true,
                  });
                }

                // When the mode is "date" & this picker was set (the user clicked on OK, rather than cancel),
                // (1) We need to hide this picker.
                // (2) Save the data. Otherwise, do nothing. Date will be saved after the TIME picker is launched (below).
                else if (
                  event.type === 'set' &&
                  dateTimePickerMode === 'date'
                ) {
                  // console.log("saveValueFunctionName: ", saveValueFunctionName);
                  this.setState({
                    [visibilityVariableName]:
                      Platform.OS === 'ios' ? true : false,
                  });

                  saveValueFunctionName(value);
                  // console.log("visibilityVariableName:", [visibilityVariableName], " - value:", value);
                }
              }}
            />
          )}

        {/* B.2 For Android - "time" mode:      display the picker in "time" mode */}
        {/*       For Android - "datetime" mode: display the picker in "time" mode (following another picker (above) in "date" mode) */}
        {Platform.OS === 'android' &&
          dateTimePickerVisible &&
          this.state.timePickerVisible && (
            <DateTimePicker
              mode={'time'}
              display="clock" // 'default', 'spinner', 'calendar', 'clock' // Android Only
              is24Hour={false} // Android Only
              value={defaultValue}
              onChange={(event, value) => {
                // 1. In case of (mode == "time"), (value) is assigned to (newDateTime), which will be used below (as is with no additions)
                let newDateTime = value;

                // 2. In case of (mode == "datetime"),
                if (event.type === 'set' && dateTimePickerMode === 'datetime') {
                  // 2.1. Get the (date) part from the previously displayed DATE picker, which saved its value into (this.state.dateValue)
                  newDateTime = this.state.dateOrTimeValue;

                  // 2.2. Get the (hours & minutes) parts from this TIME Picker, which saved its value into (value)
                  const newHours = value.getHours();
                  const newMinutes = value.getMinutes();

                  // 2.3 Combine 2.1 & 2.2 (above) into (newDateTime).
                  newDateTime.setHours(newHours);
                  newDateTime.setMinutes(newMinutes);
                  newDateTime.setSeconds(0);
                }

                this.setState({
                  dateOrTimeValue: newDateTime,
                  datePickerVisible: false,
                  timePickerVisible: false,

                  // We are done. Hide the <DatTimePicker>
                  // Technically speaking, since this part of the script is only relevant to a certain platform, I don't need to check for the platform (below).
                  [visibilityVariableName]:
                    Platform.OS === 'ios' ? true : false,
                });

                if (event.type === 'set') {
                  saveValueFunctionName(newDateTime);
                  // console.log("visibilityVariableName:", [visibilityVariableName], " - newDateTime:", newDateTime);
                }
              }}
            />
          )}
      </View>
    );
  };

  // This function formats date values. Obviously, using it is optional.
  // If you decide to use it, remember that it needs the XDate library:
  // import XDate from 'xdate';
  fFormatDateTime = (date1, format1 = 'datetime') => {
    // date1:   the date to be formatted
    // format1: the date mode - "datetime" , "date" OR "time"
    if (date1 === null) {
      return null;
    }

    // else:
    const format2 = format1.toLowerCase();
    let dateFormatted;
    const date2 = moment(date1);

    switch (format2) {
      case 'datetime': {
        // dateFormatted = date2.format('/MM/yyyy - hh:mm TT');
        dateFormatted = date2.calendar(null, {
          sameDay: '[Today], hh:mm A',
          nextDay: '[Tomorrow], hh:mm A',
          nextWeek: 'dddd, hh:mm A',
          lastDay: '[Yesterday], hh:mm A',
          lastWeek: 'DD/MM/YYYY hh:mm A',
          sameElse: 'DD/MM/YYYY hh:mm A',
        });
        return dateFormatted;
      }
      case 'date': {
        return date2.format('YYYY-MM-DD');
        // dateFormatted = date2.calendar(null, {
        //     sameDay: '[Today]',
        //     nextDay: '[Tomorrow]',
        //     nextWeek: 'dddd',
        //     lastDay: '[Yesterday]',
        //     lastWeek: 'DD/MM/YYYY',
        //     sameElse: 'DD/MM/YYYY'
        // });
        // return dateFormatted;
      }
      case 'time': {
        dateFormatted = date2.format('hh:mm A');
        return dateFormatted;
      }
      default:
        return null;
    }
  };

  // This function shows/hides the initial DateTimePicker
  // If the mode is "datetime", another picker will be displayed by the DATE picker
  fRenderDatePicker = (mode, visibilityVariableName) => {
    // mode:                        specifies the mode of the <DateTimePicker>
    // visibilityVariableName:  the name of the state variable, which controls showing/hiding this DateTimePicker.
    switch (mode) {
      case 'datetime':
        return this.setState({
          [visibilityVariableName]: true,
          datePickerVisible: true,
          timePickerVisible: false,
        });
      case 'date':
        return this.setState({
          [visibilityVariableName]: true,
          datePickerVisible: true,
          timePickerVisible: false,
        });
      case 'time':
        return this.setState({
          [visibilityVariableName]: true,
          datePickerVisible: false,
          timePickerVisible: true,
        });
    }
  };

  datepicker = () => {
    this.show('date');
  };

  show = (mode) => {
    this.setState({
      show: true,
      mode,
    });
  };

  setDate = (date) => {
    console.log(date);
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
    this.props.onSelect(date);
  };

  render() {
    // 1. For the "Shift Start", Initial/Default value for the DateTimePicker
    // // defaultShiftStartDateTime: (tomorrow's date at 9 AM)
    let defaultShiftStartDateTime = new Date();
    defaultShiftStartDateTime.setDate(defaultShiftStartDateTime.getDate() + 1);
    defaultShiftStartDateTime.setHours(9);
    defaultShiftStartDateTime.setMinutes(0);
    defaultShiftStartDateTime.setSeconds(0);

    const {show} = this.state;
    const {date, mode, minimumDate, label} = this.props;

    if (date) {
      defaultShiftStartDateTime = new Date(date);
    }

    if (Platform.OS !== 'ios') {
      return (
        <View>
          <TouchableOpacity
            // THE FOLLOWING ARGUMENT VALUE IS THE (1st place OF 2) PLACES, WHICH DIFFERENTIATE BETWEEN THE DIFFERENT MODES (DATETIME, DATE & TIME)
            onPress={() => {
              // this.setState({ isStartingDateTimePickerVisible: true, });
              this.fRenderDatePicker(mode, 'isStartingDateTimePickerVisible');
            }}
            style={this.props.style}>
            {/* <Text>{this.fFormatDateTime(this.state.date,mode)}</Text> */}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  AppStyle.regularFont,
                  AppStyle.grayText,
                  AppStyle.text16,
                ]}>
                {label ? label : 'Select' + mode}{' '}
              </Text>
              {!this.props.removeIcon && (
                <FeatherIcon name={'chevron-down'} size={25} style={{top: 2}} />
              )}
            </View>
            <Text style={[AppStyle.regularFont, AppStyle.blackColor]}>
              {date && this.fFormatDateTime(date, mode)}
            </Text>
          </TouchableOpacity>

          {
            // This function would render the necessary DateTimePicker only if the relevant state variable is set (above)
            this.fRenderDateTimePicker(
              this.state.isStartingDateTimePickerVisible,
              ' ',

              // THE FOLLOWING ARGUMENT VALUE IS THE (2nd place OF 2) PLACES, WHICH DIFFERENTIATE BETWEEN THE DIFFERENT MODES (DATETIME, DATE & TIME)
              mode,

              defaultShiftStartDateTime,

              // This is my function, which saves the selected value to my app's state.
              // YOU NEED TO REPLACE IT WITH SOMETHING RELEVANT TO YOUR APP.
              this.setDate,
            )
          }
        </View>
      );
    } else {
      return (
        <View>
          <View style={[styles.inputContainer]}>
            <TouchableOpacity
              style={[AppStyle.borderWidth2, this.props.style]}
              onPress={this.datepicker}>
              {/* <Text style={[AppStyle.regularFont, AppStyle.blackColor, AppStyle.text16, { top: (!this.state.date ? (Platform.OS === 'ios' ? 15 : 20) : 0) }]}>{label?label:'Select Date'} </Text> */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 5,
                }}>
                <Text
                  style={[
                    AppStyle.regularFont,
                    AppStyle.grayText,
                    AppStyle.text16,
                  ]}>
                  {label ? label : 'Select Time'}{' '}
                </Text>
                {!this.props.removeIcon && (
                  <FeatherIcon
                    name={'chevron-down'}
                    size={25}
                    style={{top: 2}}
                  />
                )}
              </View>
              <Text style={[AppStyle.regularFont, AppStyle.grayText]}>
                {this.state.date && this.fFormatDateTime(this.state.date, mode)}
              </Text>
            </TouchableOpacity>
          </View>

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
                  display="spinner"
                  onChange={(event, date) => {
                    this.setDate(date);
                  }}
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
  } // end of: render()
} // end of: component

export default ShiftTimingScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  inputContainer: {
    width: '100%',
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
