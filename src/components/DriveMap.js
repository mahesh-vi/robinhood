import React, {Component} from 'react';
import {
  View,
  StatusBar,
  Alert,
  StyleSheet,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AppStyle from '../style/AppStyle';
import moment from 'moment';
import {Map} from './MapView';
export default class DriveMap extends Component {
  constructor(props) {
    super(props);
    this.onViewTouch = this.onViewTouch.bind(this);
  }

  onViewTouch = (e) => {
    console.log('Touch event', e);

    this.props.onClose();
  };

  render() {
    const {driveDetail} = this.props;
    console.log(driveDetail);
    return (
      <View style={{alignItems: 'center', flex: 1}}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.showModal}
          onRequestClose={() => {
            this.props.onClose();
          }}>
          <View style={{backgroundColor: 'rgba(0,0,0,0.5)', height: '100%'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.onClose();
              }}>
              <View style={{height: '15%', width: '100%'}}></View>
            </TouchableWithoutFeedback>

            <View
              style={[
                styles.mainView,
                {backgroundColor: '#fff', justifyContent: 'flex-start'},
              ]}>
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 10,
                  paddingVertical: 15,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{marginHorizontal: 10}}>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.darkGrayColor,
                      AppStyle.text14,
                    ]}>
                    {moment(driveDetail.time).format('HH:mm A')}
                  </Text>
                </View>
                <View style={{marginHorizontal: 20}}>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.blackColor,
                      {fontSize: 18},
                    ]}>
                    {driveDetail.name}
                  </Text>
                  <Text
                    style={[
                      AppStyle.regularFont,
                      AppStyle.darkGrayColor,
                      AppStyle.text14,
                    ]}>
                    {driveDetail.zone.name}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  marginHorizontal: 10,
                  paddingVertical: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    AppStyle.mediumFont,
                    AppStyle.blackColor,
                    AppStyle.pramaryColor,
                    {fontSize: 16},
                  ]}>
                  {driveDetail.require_robins} Robins Required Drive
                </Text>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  height: 150,
                  borderRadius: 5,
                  backgroundColor: '#f9f9f9',
                }}>
                <Map style={styles.map} data={driveDetail} />
              </View>
              <TouchableOpacity
                style={[
                  {
                    height: 80,
                    borderRadius: 5,
                    margin: 10,
                    justifyContent: 'center',
                  },
                  AppStyle.primaryBackgroundColor,
                ]}>
                <Text
                  style={[
                    AppStyle.mediumFont,
                    {color: '#fff', fontSize: 14, textAlign: 'center'},
                  ]}>
                  Serve Needly
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.onClose();
              }}>
              <View style={{flex: 1, height: '15%', width: '100%'}}></View>
            </TouchableWithoutFeedback>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    // marginTop: (Platform.OS) === 'ios' ? 20 : 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    height: 150,
    width: '100%',
  },
});
