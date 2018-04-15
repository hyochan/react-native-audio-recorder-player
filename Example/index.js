import { AppRegistry, YellowBox } from 'react-native';
import App from './src/';

/**
 * React Native 0.54 warning message ignore.
 */
YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);

AppRegistry.registerComponent('dooboo', () => App);
