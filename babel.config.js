module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  retainLines: true,
  plugins: [
    [
      'babel-plugin-root-import',
      {
        rootPathPrefix: '~src/',
        rootPathSuffix: 'src',
      },
    ],
  ],
};
