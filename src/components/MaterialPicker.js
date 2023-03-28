import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Modal,
  Animated,
  Text,
  TouchableWithoutFeedback,
  Picker,
  TextInput,
  Keyboard,
  Button,
} from 'react-native';

import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import AppStyle from '../style/AppStyle';
import {Dropdown} from 'react-native-material-dropdown';

export default class MaterialPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  render() {
    if (Platform.OS === 'android') {
      return (
        <View style={[{width: '100%', marginTop: -15}]}>
          {/* <Animated.Text style={labelStyle}  onPress={() => { this.dropdown.focus(); }}>
                        {'Select Reason'}
                    </Animated.Text> */}

          <Dropdown
            valueExtractor={(value) => {
              return typeof value == 'object' ? value.id : value;
            }}
            labelExtractor={(value) => {
              return typeof value == 'object'
                ? value[this.props.labelProps]
                : value;
            }}
            itemTextStyle={[AppStyle.regularFont, AppStyle.text14]}
            style={[AppStyle.regularFont, AppStyle.text16]}
            labelTextStyle={[AppStyle.regularFont]}
            // inputContainerStyle={[AppStyle.borderWidth2]}
            data={this.props.data}
            value={this.props.value}
            onChangeText={(item) => {
              this.props.onChangeText(item);
            }}
            useNativeDriver={true}
            pickerStyle={{marginTop: 30}}
            dropdownPosition={0}
            ref={(ref) => {
              this.dropdown = ref;
            }}
          />
        </View>
      );
    } else {
      const selectedItem = this.props.data.find(
        (i) => (typeof i == 'object' ? i.key : i) === this.props.value,
      );

      const selectedLabel = selectedItem
        ? typeof selectedItem == 'object'
          ? selectedItem.key
          : selectedItem
        : '';
      return (
        <View
          style={[
            styles.inputContainer,
            AppStyle.borderWidth2,
            {paddingVertical: 5, marginVertical: 10},
          ]}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.setState({modalVisible: true});
            }}>
            <View>
              <Text
                style={[
                  AppStyle.regularFont,
                  AppStyle.text16,
                  {marginRight: 30, top: this.props.value ? 0 : 15},
                ]}>
                {this.props.label}
              </Text>
              <AntDesignIcon
                style={[
                  {
                    position: 'absolute',
                    right: 10,
                    top: this.props.value ? 0 : 15,
                    color: 'rgba(150,150,150,0.9)',
                  },
                ]}
                name="caretdown"
                size={11}
              />

              <Text style={[AppStyle.regularFont, AppStyle.text16]}>
                {typeof selectedItem == 'object'
                  ? selectedItem.value
                  : selectedItem}
              </Text>
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
                {/* <View style={styles.buttonContainer}> */}
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    backgroundColor: '#f0f0f0',
                    paddingHorizontal: 10,
                  }}>
                  <Button
                    onPress={() => {
                      if (!this.props.value || this.props.value == '') {
                        this.props.onChangeText(
                          typeof this.props.data[0] == 'object'
                            ? this.props.data[0].key
                            : this.props.data[0],
                        );
                      }
                      this.setState({modalVisible: false});
                    }}
                    title="Done"
                  />
                </View>
                <View style={{backgroundColor: '#fff'}}>
                  <Picker
                    selectedValue={selectedLabel}
                    onValueChange={(item, itemPosition) => {
                      this.props.onChangeText(
                        typeof this.props.data[itemPosition] == 'object'
                          ? this.props.data[itemPosition].key
                          : item,
                      );
                    }}
                    itemStyle={[AppStyle.regularFont, AppStyle.text16]}>
                    {this.props.data.map((i, index) => (
                      <Picker.Item
                        key={index}
                        label={typeof i == 'object' ? i.value : i}
                        value={typeof i == 'object' ? i.key : i}
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
    ...Platform.select({
      ios: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
      },
    }),
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
});
