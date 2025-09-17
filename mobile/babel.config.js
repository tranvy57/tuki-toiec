module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '~': './', // để import "~/types/..." chạy được
          },
        },
      ],
      'react-native-reanimated/plugin', // LUÔN đặt cuối cùng
    ],
  };
};
