import { StyleSheet } from 'react-native';

import { sw, sh } from '~src/styles/Mixins';

const base = (theme, insets) => {
  return StyleSheet.create({});
};

const shadowStyles = StyleSheet.create({
  card: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: sw(4),
    },
    shadowOpacity: 0.1,
    shadowRadius: sw(4),
    elevation: sw(4),
    marginBottom: sw(8),
  },
});

const containerStyles = ({ theme, insets }) => {
  return StyleSheet.create({
    transferInputSection: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: sw(16),
      paddingVertical: sh(24),
      borderRadius: theme.roundness.corner,
      marginTop: sh(16),
    },
  });
};

const inputStyles = ({ theme, insets }) => {
  return StyleSheet.create({
    selectDropDownView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: sh(16),
      borderBottomColor: theme.colors.separator,
      borderBottomWidth: 1,
    },
  });
};

export default function getBaseStyleSheet(theme, insets) {
  return base(theme, insets);
}

export { shadowStyles, containerStyles, inputStyles };
