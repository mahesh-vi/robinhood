import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';

export default class CompleteDriveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      enableScrollViewScroll: true,
    };
  }

  render() {
    return (
      <View
        style={{alignItems: 'center', flex: 1}}
        onStartShouldSetResponderCapture={() => {
          this.setState({enableScrollViewScroll: true});
        }}>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.props.showModal}
          onRequestClose={() => {}}>
          <View style={[styles.mainView, {backgroundColor: '#79d0aa'}]}>
            <TouchableWithoutFeedback>
              <Image
                source={require('../../assets/images/thank_for_help.png')}
                style={{marginTop: 40}}
              />
            </TouchableWithoutFeedback>

            <TouchableOpacity
              style={{
                marginTop: 20,
                height: 44,
                borderRadius: 22,
                width: '80%',
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                this.props.onClose();
                this.props.navigation.dispatch({
                  type: 'Navigation/RESET',
                  index: 0,
                  actions: [{type: 'Navigate', routeName: 'Dashboard'}],
                });
                this.props.navigation.navigate('Dashboard');
              }}>
              <Text
                style={{
                  color: '#000',
                  textTransform: 'uppercase',
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                GO TO DASHBOARD
              </Text>
            </TouchableOpacity>

            <TouchableWithoutFeedback
              onPress={() => {
                this.props.onClose();
                this.props.navigation.replace('UpcomingDrives');
              }}>
              <Image
                source={require(`../../assets/images/help_serve_2.png`)}
                style={{
                  width: '90%',
                  height: 120,
                  marginTop: 20,
                  borderRadius: 8,
                }}
                resizeMode={'stretch'}
              />
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#79d0aa',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    alignItems: 'center',
  },
  avtarImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
});
