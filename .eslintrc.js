module.exports = {
  root: true,
  extends: ['@react-native-community', 'plugin:prettier/recommended'],
  rules: {
    'react/jsx-filename-extension': 'off',
    //You can override any rules you want
  },
  parser: 'babel-eslint',
  plugins: ['import', 'unused-imports'],
  settings: {
    'import/resolver': {
      'babel-plugin-root-import': {
        '~src/': 'src',
      },
    },
  },
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
