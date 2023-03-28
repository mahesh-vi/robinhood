import React, {Component} from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  BackHandler,
} from 'react-native';
import AppStyle from '../style/AppStyle';
import TextField from './TextField';
const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: '#e1e4e8',
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    color: '#000',
  },
  body: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: AppStyle.primaryBackgroundColor.backgroundColor,
    borderRadius: 25,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    width: '100%',
    color: '#FFF',
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

const AlertContect = React.createContext({});
const initialState = {
  visible: false,
  title: '',
  body: '',
};
export const AlertConsumer = AlertContect.Consumer;

export class AlertProvider extends Component {
  state = initialState;
  animatedValue = new Animated.Value(0);

  alert = ({
    title = '',
    body = '',
    display = 'modal',
    ctaText = '',
    ctaOnPress = null,
    ctaOnPressCancel = null,
    onChangeText = null,
    bodyTestStyle = {},
    buttons = [],
    type = 'alert',
  }) => {
    this.setState(
      {
        title,
        body,
        visible: true,
        ctaOnPress,
        type,
        buttons,
        ctaOnPressCancel,
        bodyTestStyle,
        onChangeText,
      },
      () => {
        Animated.timing(this.animatedValue, {
          toValue: 1,
          useNativeDriver: true,
          duration: 150,
        }).start();
      },
    );

    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  };

  close = () => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,
    }).start(() => {
      this.setState({...initialState});
    });

    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  };

  handleBackButtonClick = () => {
    // this.props.navigation.goBack(null);
    this.close();
    return true;
  };

  render() {
    const {
      title,
      body,
      visible,
      ctaOnPress,
      type,
      ctaOnPressCancel,
      bodyTestStyle,
      onChangeText,
    } = this.state;
    return (
      <AlertContect.Provider value={{alert: this.alert}}>
        {this.props.children}
        {visible && type == 'alert' && (
          <TouchableWithoutFeedback onPress={this.close}>
            <View style={[styles.modalContainer]}>
              <Animated.View
                style={[
                  styles.modal,
                  {
                    opacity: this.animatedValue,
                    transform: [
                      {
                        scale: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={[AppStyle.regularFont, styles.title]}>
                  {title}
                </Text>
                <Text
                  style={[
                    AppStyle.mediumLabelText,
                    styles.body,
                    bodyTestStyle,
                  ]}>
                  {body}
                </Text>
                <TouchableOpacity
                  style={[
                    AppStyle.button,
                    {
                      marginBottom: 0,
                      marginTop: 5,
                      alignSelf: 'center',
                      width: '95%',
                    },
                  ]}
                  onPress={() => {
                    if (ctaOnPress) {
                      ctaOnPress();
                    }
                    this.close();
                  }}>
                  <Text style={[AppStyle.buttonText]}>OK</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}

        {visible && type == 'confirm' && (
          <TouchableWithoutFeedback onPress={this.close}>
            <View style={[styles.modalContainer]}>
              <Animated.View
                style={[
                  styles.modal,
                  {
                    opacity: this.animatedValue,
                    transform: [
                      {
                        scale: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={[AppStyle.regularLabelText, styles.title]}>
                  {title}
                </Text>
                <Text
                  style={[
                    AppStyle.mediumLabelText,
                    styles.body,
                    bodyTestStyle,
                  ]}>
                  {body}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                  }}>
                  {/* <TouchableOpacity style={[styles.buttonContainer]} onPress={() => {
                                        if (ctaOnPressCancel)
                                            ctaOnPressCancel();
                                        this.close();
                                    }}> */}

                  <TouchableOpacity
                    style={[styles.buttonContainer]}
                    onPress={() => {
                      if (ctaOnPressCancel) {
                        ctaOnPressCancel();
                      }
                      this.close();
                    }}>
                    <Text
                      style={[
                        AppStyle.text18,
                        AppStyle.whiteColor,
                        {
                          paddingVertical: 5,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        },
                      ]}>
                      {this.state.buttons[1] || 'CANCEL'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonContainer]}
                    onPress={() => {
                      if (ctaOnPress) {
                        ctaOnPress();
                      }
                      this.close();
                    }}>
                    <Text
                      style={[
                        AppStyle.text18,
                        AppStyle.whiteColor,
                        {
                          paddingVertical: 5,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        },
                      ]}>
                      {this.state.buttons[0] || 'OK'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}

        {visible && type == 'inputconfirm' && (
          <TouchableWithoutFeedback onPress={this.close}>
            <View style={[styles.modalContainer]}>
              <Animated.View
                style={[
                  styles.modal,
                  {
                    opacity: this.animatedValue,
                    transform: [
                      {
                        scale: this.animatedValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}>
                <Text style={[AppStyle.regularFont, styles.title]}>
                  {title}
                </Text>
                <Text
                  style={[AppStyle.regularFont, styles.body, bodyTestStyle]}>
                  {body}
                </Text>
                <View style={[{height: 40, margin: 5}]}>
                  <TextField
                    placeholder={'No. of people serve'}
                    style={[{height: 40}]}
                    value={this.state.textInput}
                    keyboardType={'number-pad'}
                    onChangeText={(text) => this.setState({textInput: text})}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    style={[styles.buttonContainer]}
                    onPress={() => {
                      if (ctaOnPressCancel) {
                        ctaOnPressCancel();
                      }
                      this.setState({textInput: undefined});
                      this.close();
                    }}>
                    <Text
                      style={[
                        AppStyle.whiteColor,
                        {
                          paddingVertical: 5,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        },
                      ]}>
                      {this.state.buttons[1] || 'CANCEL'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.buttonContainer]}
                    onPress={() => {
                      if (ctaOnPress) {
                        ctaOnPress(this.state.textInput);
                      }
                      this.setState({textInput: undefined});
                      this.close();
                    }}>
                    <Text
                      style={[
                        AppStyle.whiteColor,
                        {
                          fontSize: 14,
                          paddingVertical: 5,
                          textAlign: 'center',
                          textTransform: 'uppercase',
                        },
                      ]}>
                      {this.state.buttons[0] || 'OK'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </AlertContect.Provider>
    );
  }
}
