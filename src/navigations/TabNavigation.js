import React from 'react';
import {View, Image} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {fromLeft, flipX, flipY} from 'react-navigation-transitions';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Dashboard from '../pages/Dashboard';
import DashboardDetails from '../pages/DashboardDetails';
import AddZone from '../pages/AddZone';
import DriveDetail from '../pages/DriveDetail';
import ActiveDrive from '../pages/ActiveDrive';
import CompleteDrive from '../pages/CompleteDrive';
import NextFoodDonationList from '../pages/NextFoodDonationList';
import NearByDrives from '../pages/NearByDrives';
import NotRobin from '../pages/NotRobin';

import CreateDrive from '../pages/CreateDrive';
import AfterDriveCreated from '../pages/AfterDriveCreated';
import Account from '../pages/Account';
import ConfirmDrive from '../pages/ConfirmDrive';
import Notification from '../pages/Notification';
import Menu from '../pages/Menu';
// import EditProfile from '../pages/EditProfile/index';

import MyDrives from '../pages/MyDrives';
import Profile from '../pages/Profile';
import MyDriveDetail from '../pages/MyDriveDetail';
import UpcomingDrives from '../pages/UpcomingDrives';
import MyAchivement from '../pages/MyAchivement';
import UpcomingDriveDetail from '../pages/UpcomingDriveDetail';
import AboutRha from '../pages/AboutRha';
import UploadDriveImage from '../pages/UploadDriveImage';
import TransitionConfig from './react-navigation-transistioner';

import TabBar from './Tabbar';

export const DashboardTab = createStackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
    },
    DashboardDetails: {
      screen: DashboardDetails,
    },
    AddZone: {
      screen: AddZone,
    },
    DriveDetail: {
      screen: DriveDetail,
    },
    ActiveDrive: {
      screen: ActiveDrive,
    },
    CompleteDrive: {
      screen: CompleteDrive,
    },
    UpcomingDrives: {
      screen: UpcomingDrives,
    },
    UpcomingDriveDetail: {screen: UpcomingDriveDetail},
    MyDriveDetail: {
      screen: MyDriveDetail,
    },
    NextFoodDonationList: {
      screen: NextFoodDonationList,
    },
    NearByDrives: {
      screen: NearByDrives,
    },
    CreateDrive: {
      screen: CreateDrive,
    },
    AfterDriveCreated: {
      screen: AfterDriveCreated,
    },
    NotRobin: {
      screen: NotRobin,
    },
    DashboardConfirmDrive: {
      screen: ConfirmDrive,
    },
    UploadDriveImage: {
      screen: UploadDriveImage,
    },
  },
  {
    initialRouteName: 'Dashboard',
  },
);

export const NotificationTab = createStackNavigator(
  {
    Notification: {
      screen: Notification,
    },
    MyUpcomingDriveDetail: {
      screen: UpcomingDriveDetail,
    },
  },
  {},
);

export const DriveTab = createStackNavigator(
  {
    CreateDrive: {
      screen: CreateDrive,
    },
    AfterDriveCreated: {
      screen: AfterDriveCreated,
    },
  },
  {
    initialRouteName: 'CreateDrive',
    transitionConfig: () => flipY(2000),
  },
);

export const AccountTab = createStackNavigator(
  {
    Account: {
      screen: Account,
    },
    MyDriveDetail: {
      screen: MyDriveDetail,
    },
    // EditProfile: {
    //   screen: EditProfile,
    // },
    MyUpcomingDriveDetail: {
      screen: UpcomingDriveDetail,
    },
    ConfirmDrive: {
      screen: ConfirmDrive,
    },
  },
  {},
);

export const MenuTab = createStackNavigator(
  {
    Menu: {
      screen: Menu,
    },
    MyDrives: {
      screen: MyDrives,
    },
    Profile: {
      screen: Profile,
    },

    MyDriveDetail: {
      screen: MyDriveDetail,
    },
    UpcomingDrives: {
      screen: UpcomingDrives,
    },
    MyAchivement: {
      screen: MyAchivement,
    },
    MenuUpcomingDriveDetail: {
      screen: UpcomingDriveDetail,
    },
    MenuConfirmDrive: {
      screen: ConfirmDrive,
    },
    AboutRha: {
      screen: AboutRha,
    },
  },
  {},
);

export const AppStack = createBottomTabNavigator(
  {
    Dashboard: {
      screen: DashboardTab,
      navigationOptions: () => ({
        tabBarIcon: ({focused, tintColor}) => {
          return (
            <MaterialCommunityIcons
              name={'view-grid'}
              size={25}
              color={tintColor}
            />
          );
        },
        tabBarOnPress: props => {
          props.navigation.popToTop();

          props.navigation.navigate('Dashboard');
        },
      }),
    },
    Notification: {
      screen: NotificationTab,
      navigationOptions: () => ({
        tabBarIcon: ({focused, tintColor}) => {
          return <FontAwesome name={'bell-o'} size={25} color={tintColor} />;
        },
        tabBarOnPress: props => {
          props.navigation.popToTop();

          props.navigation.navigate('Notification');
        },
      }),
    },
    // Drive: {
    //     screen: DriveTab,
    //     navigationOptions: () => ({
    //         tabBarIcon: ({ focused, tintColor }) => {
    //             return (<FeatherIcon name={'plus-circle'} size={35} color={tintColor} />);
    //         }, tabBarOnPress: (props) => {
    //             props.navigation.popToTop();

    //             props.navigation.navigate('CreateDrive');
    //         }
    //     }),

    // },
    Account: {
      screen: AccountTab,
      navigationOptions: () => ({
        tabBarIcon: ({focused, tintColor}) => {
          return (
            <MaterialCommunityIcons
              name={'account-outline'}
              size={35}
              color={tintColor}
            />
          );
        },
        tabBarOnPress: props => {
          props.navigation.popToTop();

          props.navigation.navigate('Account');
        },
      }),
    },
    Menu: {
      screen: MenuTab,
      navigationOptions: () => ({
        tabBarIcon: ({focused, tintColor}) => {
          return <FeatherIcon name={'menu'} size={25} color={tintColor} />;
        },
        tabBarOnPress: props => {
          console.log(props);
          props.navigation.popToTop();

          props.navigation.navigate('Menu');
        },
      }),
    },
  },
  {
    tabBarComponent: ({navigation}) => <TabBar navigation={navigation} />,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#71c89e',
      inactiveTintColor: '#666',
      style: {
        backgroundColor: '#fff',
      },
      iconStyle: {color: '#000'},
      tabStyle: {},
      indicatorStyle: {
        backgroundColor: '#FF0',
      },
    },
  },
);
