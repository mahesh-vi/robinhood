// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {Animated, Easing, Platform} from 'react-native';
import {
  forHorizontalIOS,
  forFadeFromBottomAndroid,
  forModalPresentationIOS,
  forVerticalIOS,
  forFade,
} from 'react-navigation-stack/src/vendor/TransitionConfigs/CardStyleInterpolators';

const TransitionSpec = {
  duration: 500,
  easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99),
  timing: Animated.timing,
};

const TransitionConfig = () => {
  return {
    transitionSpec: TransitionSpec,
    screenInterpolator: (sceneProps) => {
      const params = sceneProps.scene.route.params || {};
      const transition = params.transition || Platform.OS;

      return {
        horizontal: forHorizontalIOS(sceneProps),
        vertical: forVerticalIOS(sceneProps),
        modal: forModalPresentationIOS(sceneProps),
        fade: forFade(sceneProps),
        ios: forHorizontalIOS(sceneProps),
        android: forFadeFromBottomAndroid(sceneProps),
      }[transition];
    },
  };
};

export default TransitionConfig;
