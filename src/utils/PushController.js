import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import messaging from '@react-native-firebase/messaging';
import NavigationService from '../navigations/NavigationService';

export default class PushController extends Component {
  componentDidMount() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        global.fcmToken = token.token;
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        const notificationData = notification.data.moredata
          ? JSON.parse(notification.data.moredata)
          : JSON.parse(notification.moredata);
        console.log(notification);
        // process the notification
        // Alert.alert(notification.title,notification.message);

        if (notification.data.moredata && !notification.userInteraction) {
          return;
        }

        if (
          notificationData.type == 'Requested' ||
          notificationData.type == 'Rejected'
        ) {
          NavigationService.navigate('MenuUpcomingDriveDetail', {
            drive: notificationData,
          });
        } else if (notificationData.type == 'Confirmed') {
          NavigationService.navigate('MyUpcomingDriveDetail', {
            drive: notificationData,
          });
        }

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

    //     messaging().onMessage(async remoteMessage => {
    //       console.log('A new FCM message arrived!', (remoteMessage));

    //   });

    //   messaging().setBackgroundMessageHandler(async remoteMessage => {
    //       console.log('A new FCM message arrived! BackgroundHandler', (remoteMessage));

    //   });

    //   messaging().onNotificationOpenedApp(remoteMessage => {
    //       console.log(
    //         'Notification caused app to open from background state:',
    //         remoteMessage.notification,
    //       );
    //     });

    //     messaging()
    // .getInitialNotification()
    // .then(remoteMessage => {
    //   if (remoteMessage) {
    //     console.log(
    //       'Notification caused app to open from quit state:',
    //       remoteMessage.notification,
    //     );

    //   }
    // });
  }

  render() {
    return null;
  }
}
