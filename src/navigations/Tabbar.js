import React, {Component} from 'react';
import {View, TouchableOpacity} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import StyleApp from '../style/NewAppStyle';
const TabBar = (props) => {
  const {navigationState, navigation, position} = props;

  return (
    <View
      style={{
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: '#666',
      }}>
      {/* {navigation.state.routes.map((route, index) => {

      return (
        <Tab
          title={route.routeName}
          onPress={() => navigation.navigate(route.routeName)}
        />
      )
    })} */}

      <TouchableOpacity
        style={{padding: 2}}
        onPress={() => {
          navigation.getChildNavigation('Dashboard').popToTop();
          navigation.navigate('Dashboard');
        }}>
        <MaterialCommunityIcons
          name={'view-grid'}
          size={30}
          color={
            navigation.state.index == 0 ? StyleApp.primaryColor.color : '#666'
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{padding: 2}}
        onPress={() => {
          navigation.getChildNavigation('Notification').popToTop();
          navigation.navigate('Notification');
        }}>
        <FontAwesome
          name={'bell-o'}
          size={30}
          color={
            navigation.state.index == 1 ? StyleApp.primaryColor.color : '#666'
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{padding: 2}}
        onPress={() => {
          // navigation.getChildNavigation('Drive').popToTop();

          if (global.user.type == 'volunteer' && global.user.total_drive < 3) {
            navigation.navigate('NotRobin');
          } else {
            navigation.navigate('CreateDrive');
          }
        }}>
        <FeatherIcon
          name={'plus-circle'}
          size={30}
          color={StyleApp.primaryColor.color}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{padding: 2}}
        onPress={() => {
          navigation.getChildNavigation('Account').popToTop();
          navigation.navigate('Account');
        }}>
        <MaterialCommunityIcons
          name={'account-outline'}
          size={35}
          color={
            navigation.state.index == 2 ? StyleApp.primaryColor.color : '#666'
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{padding: 2}}
        onPress={() => {
          navigation.getChildNavigation('Menu').popToTop();
          navigation.navigate('Menu');
        }}>
        <FeatherIcon
          name={'menu'}
          size={30}
          color={
            navigation.state.index == 3 ? StyleApp.primaryColor.color : '#666'
          }
        />
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;
