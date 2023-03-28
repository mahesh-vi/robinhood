import React, {Component} from 'react';
import {
  View,
  TextInput,
  Animated,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import AppStyle from '../style/AppStyle';

import FeatherIcon from 'react-native-vector-icons/Feather';

export default class TextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      icon: 'eye-off',
    };
  }

  render() {
    const {label, ...props} = this.props;

    return (
      <View
        style={{
          flex: 1,
          paddingTop: 0,
          borderColor: '#666666',
          backgroundColor: '#fff',
          marginBottom: 5,
        }}>
        <TextInput
          {...props}
          blurOnSubmit
          returnKeyType="done"
          style={[
            AppStyle.inputContainer,
            props.style,
            {padding: Platform.OS == 'ios' ? 10 : 5},
          ]}
        />
      </View>
    );
  }
}
