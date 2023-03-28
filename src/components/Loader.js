import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Animated,
  Image,
  Easing,
} from 'react-native';

class Loader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.loading}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={true}
              size="large"
              color={'rgb(113,200,158)'}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Loader;
