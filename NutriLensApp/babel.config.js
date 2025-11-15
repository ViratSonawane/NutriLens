const nativewind = require('nativewind/babel');

const nativewindPlugins = nativewind().plugins.filter(
  plugin => plugin !== 'react-native-worklets/plugin'
);

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [...nativewindPlugins],
};
