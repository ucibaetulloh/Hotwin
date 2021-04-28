import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  WebView,
  Image,
  TouchableHighlight,
} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {YellowBox} from 'react-native';
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
]);

import IntroScreen from './screens/IntroScreen/index';
import HomeScreen from './screens/Home/index';

const App = createStackNavigator(
  {
    IntroScreen: {screen: IntroScreen},
    Home: {screen: HomeScreen},
  },
  {
    headerMode: 'none',
    initialRouteName: 'IntroScreen',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#0066ff',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        textAlign: 'center',
      },
    },
  },
);

export default App;
