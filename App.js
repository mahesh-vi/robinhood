/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

import {SafeAreaView} from 'react-navigation';
import RootNavigation from './src/navigations/RootNavigation';
import {AlertProvider, AlertConsumer} from './src/components/GlobalAlert';
import NavigationService from './src/navigations/NavigationService';

import PushNotification from 'react-native-push-notification';

console.disableYellowBox = true;
console.reportErrorsAsExceptions = false;
class App extends Component {
  unsubscribe;
  constructor(props) {
    super(props);

    this.state = {};

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the
        global.notificationData = notification.data;

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)

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
       */
      requestPermissions: true,
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <RootNavigation
          screenProps={this.props.alert}
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </SafeAreaView>
    );
  }
}

// export default App;

export default () => {
  return (
    <AlertProvider>
      <AlertConsumer>{({alert}) => <App alert={alert} />}</AlertConsumer>
    </AlertProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: (Platform.OS == "ios") ? 20 : 0,
  },
});
