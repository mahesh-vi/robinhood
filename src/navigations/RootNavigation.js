import React from 'react';

import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AuthLoading from '../pages/AuthLoading';

import Signin from '../pages/Signin';
import Registration from '../pages/Registration';
import Landing from '../pages/Landing';
import AdminLogin from '../pages/AdminLogin';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import VerifyOtp from '../pages/ForgotPassword/VerifyOtp';
import ResetPassword from '../pages/ForgotPassword/ResetPassword';

import {AppStack} from './TabNavigation';

const AuthStack = createStackNavigator(
  {
    Landing: {
      screen: Landing,
    },
    Signin: {
      screen: Signin,
    },
    Registration: {
      screen: Registration,
    },
    AdminLogin: {
      screen: AdminLogin,
    },
    ForgotPassword: {
      screen: ForgotPassword,
    },
    VerifyOtp: {
      screen: VerifyOtp,
    },
    ResetPassword: {
      screen: ResetPassword,
    },
  },
  {
    initialRouteName: 'Landing',
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      Auth: AuthStack,
      App: AppStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
