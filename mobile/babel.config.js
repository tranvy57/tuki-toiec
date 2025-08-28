module.exports = function (api) {
  api.cache(true);
  let plugins = [
    'expo-router/babel',
    'react-native-reanimated/plugin', // LUÔN đặt cuối cùng
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
