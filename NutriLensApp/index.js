/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.tsx'; // This will automatically find your App.tsx or App.jsx
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);