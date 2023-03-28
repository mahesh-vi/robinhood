import * as React from 'react';
import {Animated, TouchableOpacity, Text} from 'react-native';

const Tab = ({focusAnim, title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View
        style={{
          padding: 10,
          borderRadius: 10,
          backgroundColor: 'transparent',
        }}>
        <Text
          style={{
            color: '#444',
          }}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Tab;
