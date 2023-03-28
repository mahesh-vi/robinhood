import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import StyleApp from '../../style/NewAppStyle';

import AppStyle from '../../style/AppStyle';

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default class NotRobin extends Component {
  static navigationOptions = {
    headerShown: false,
    transitionSpec: {
      open: config,
      close: config,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userType: null,
      showModal: false,
    };
  }

  gotoNearByDrives() {
    this.props.navigation.navigate('NearByDrives');
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <View
          style={{
            marginHorizontal: 20,
            marginVertical: 15,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Ionicons
            name={'ios-arrow-back'}
            size={30}
            onPress={() => this.props.navigation.goBack()}
          />

          {/* <View style={{ marginLeft: 30 }}>
                        <Text style={[StyleApp.headerText]}>Great Job</Text>
                        <Text style={[StyleApp.headerSubText]}>Your Drive details are added successfully</Text>
                        </View> */}
        </View>

        <View style={{alignItems: 'center', marginTop: 20}}>
          <Image
            source={require('../../assets/images/post_successfull.jpg')}
            style={{height: 300, width: '80%'}}
            resizeMode={'stretch'}
          />
        </View>

        <View
          style={{alignItems: 'center', marginTop: 20, alignSelf: 'center'}}>
          <Text
            style={[
              AppStyle.semiBoldFamily,
              AppStyle.blackColor,
              {flexWrap: 'wrap', textAlign: 'center'},
            ]}>
            To create drive at least you need to attend 3 drives first.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            {
              left: '10%',
              marginVertical: 20,
              height: 44,
              width: '80%',
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            },
            AppStyle.primaryBackgroundColor,
          ]}
          onPress={() => this.gotoNearByDrives()}>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontFamily: 'Montserrat-Bold',
            }}>
            Near by Drives
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
