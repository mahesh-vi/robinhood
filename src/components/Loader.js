import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Animated, Image, Easing 
} from 'react-native';



class Loader extends Component {


  constructor(props) {
    super(props);
    this.RotateValueHolder = new Animated.Value(0);
  }

  componentDidMount() {
    this.StartImageRotateFunction();
  }

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);

    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
    }).start(() => this.StartImageRotateFunction());
  }

  render() {
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.loading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <Image source={require('../assets/images/gif-loader.gif')} style={{ height: 40, width: 40 }} />
            {/* <ActivityIndicator
            animating={loading} 
         size="large"/> */}
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default Loader;