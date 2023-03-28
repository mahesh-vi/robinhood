import React, {Component} from 'react';
import {
  StatusBar,
  StyleSheet,
  Dimensions,
  Alert,
  View,
  Text,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../navigations/NavigationService';

export default class AuthLoading extends Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    setTimeout(() => {
      if (Platform.OS === 'android') {
        PushNotification.popInitialNotification((notification) => {
          if (notification) {
            /* do things with the notification */
            console.log('Auth Loading Notification', notification);
            const notificationData = notification.data
              ? JSON.parse(notification.data.moredata)
              : JSON.parse(notification.moredata);
            // process the notification
            // Alert.alert(notification.title,notification.message);

            if (notificationData.type == 'Requested') {
              NavigationService.navigate('MenuUpcomingDriveDetail', {
                drive: notificationData,
              });
            }
          }
        });
      }
    }, 2000);

    try {
      const userToken = await AsyncStorage.getItem('token');
      if (userToken) {
        const user = await AsyncStorage.getItem('user');
        // Authentication.setAuthToken(userToken);
        global.user = JSON.parse(user);
        this.props.navigation.navigate('App');
      } else {
        const firstOpen = await AsyncStorage.getItem('firstOpen');
        if (firstOpen) {
          this.props.navigation.navigate('Auth');
          this.props.navigation.dispatch({
            type: 'Navigation/RESET',
            index: 0,
            actions: [{type: 'Navigate', routeName: 'Signin'}],
          });
        } else {
          this.props.navigation.navigate('Auth');
          let token = await AsyncStorage.multiSet([['firstOpen', 'true']]);
        }
      }

      // this.props.navigation.navigate('Auth');
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  // Render any loading content that you like here
  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
