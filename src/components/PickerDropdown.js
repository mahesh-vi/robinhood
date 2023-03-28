import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Modal,
  Animated,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Picker,
  Button,
} from 'react-native';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import AppStyle from '../style/AppStyle';
import StyleApp from '../style/NewAppStyle';

export default class PickerDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  renderLable = (item) => {
    if (typeof this.props.labelProps == 'string') {
      return item[this.props.labelProps];
    } else if (Array.isArray(this.props.labelProps)) {
      let label = '';
      this.props.labelProps.map((i) => (label = label + ' ' + item[i]));

      return label;
    }
  };

  render() {
    const data = this.props.data || [];

    if (Platform.OS === 'android') {
      return (
        <View
          style={[
            {
              minHeight: 64,
              width: '100%',
              marginTop: 10,
              marginBottom: 10,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(250,250,254,1)',
            },
            this.props.style,
          ]}>
          {this.props.placeholder && (
            <TouchableWithoutFeedback>
              <Text style={styles.label}>{this.props.placeholder}</Text>
            </TouchableWithoutFeedback>
          )}
          <Picker
            selectedValue={this.props.value}
            style={{width: this.props.placeholder ? '60%' : '100%'}}
            onValueChange={(itemValue, itemIndex) => {
              this.props.onChange(itemValue);
            }}>
            {data.map((i, index) => (
              <Picker.Item
                key={index}
                label={
                  typeof i == 'object'
                    ? this.props.labelProps
                      ? this.renderLable(i)
                      : i.name
                    : i
                }
                value={typeof i == 'object' ? i.id : i}
                color={
                  (typeof i == 'object' ? i.id : i) == this.props.value
                    ? 'black'
                    : 'gray'
                }
              />
            ))}
          </Picker>
        </View>
      );
    } else {
      const selectedItem = data.find(
        (i) => (typeof i == 'object' ? i.id : i) === this.props.value,
      );

      const selectedLabel = selectedItem
        ? typeof selectedItem == 'object'
          ? this.props.labelProps
            ? selectedItem[this.props.labelProps]
            : selectedItem.name
          : selectedItem
        : '';

      return (
        <View
          style={[
            styles.inputContainer,
            {
              minHeight: 64,
              paddingVertical: 5,
              justifyContent: 'center',
              marginVertical: 10,
              flexDirection: 'row',
              backgroundColor: 'rgba(250,250,254,1)',
            },
          ]}>
          {this.props.placeholder && (
            <TouchableWithoutFeedback>
              <Text style={styles.label}>{this.props.placeholder}</Text>
            </TouchableWithoutFeedback>
          )}
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({modalVisible: true});
            }}>
            <View
              style={{
                width: '60%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[AppStyle.regularFont, AppStyle.text16]}>
                {selectedLabel}
              </Text>
              <AntDesignIcon
                style={[
                  {
                    position: 'absolute',
                    right: 10,
                    color: 'rgba(150,150,150,0.9)',
                  },
                ]}
                name="caretdown"
                size={11}
              />
            </View>
          </TouchableWithoutFeedback>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.setState({modalVisible: false});
              }}>
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
                      this.setState({modalVisible: false});
                    }}
                    title="Done"
                  />
                </View>
                <View style={{backgroundColor: '#fff'}}>
                  <Picker
                    selectedValue={this.props.value}
                    onValueChange={(itemValue, itemIndex) =>
                      this.props.onChange(itemValue)
                    }
                    itemStyle={[AppStyle.regularFont, AppStyle.text16]}>
                    {data.map((i, index) => (
                      <Picker.Item
                        key={index}
                        label={
                          typeof i == 'object'
                            ? this.props.labelProps
                              ? i[this.props.labelProps]
                              : i.name
                            : i
                        }
                        value={typeof i == 'object' ? i.id : i}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  inputContainer: {
    // ...Platform.select({
    //     ios: {
    //         borderBottomColor: 'gray',
    //         borderBottomWidth: 1,
    //     },
    // }),
  },
  input: {
    height: 40,
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
  label: {
    paddingLeft: 5,
    // backgroundColor: 'rgba(250,250,254,1)',
    marginBottom: 5,
    width: '40%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    // paddingVertical: 10
  },
});
