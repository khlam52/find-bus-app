import React, { useEffect } from 'react';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GoArrowIcon,
  GoLeftArrowIcon,
  KeyboardBackIcon,
} from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import ListHelper, { KEYBOARD_LIST } from '~src/utils/ListHelper';

SearchKeyboardButtonView.defaultProps = {
  searchRoute: null,
  setSearchRoute: () => {},
};

export default function SearchKeyboardButtonView({
  searchRoute,
  setSearchRoute,
}) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme, locale);

  useEffect(() => {
    console.log('SearchKeyboardButtonView -> useEffect');
  }, []);

  const onKeyboardItemPressed = (item) => {
    if (item === 'Clear') {
      setSearchRoute('');
    } else if (item === 'Close') {
      setSearchRoute(String(searchRoute).slice(0, -1));
    } else {
      setSearchRoute(searchRoute + item);
    }
  };

  const listHeaderComponent = () => {
    return <View style={styles.listHeaderView} />;
  };

  const listFooterComponent = () => {
    return <View style={styles.listFooterView} />;
  };

  const renderAlphabetItem = ({ item, index }) => {
    return (
      <AppPressable
        key={index}
        onPress={() => {
          onKeyboardItemPressed(item);
        }}
        style={styles.alphabetBlockView}>
        <Text style={styles.alphabetText}>{item}</Text>
      </AppPressable>
    );
  };

  const renderAlphabetKeyboardView = () => {
    return (
      <View style={styles.alphabetKeyboardView}>
        <GoLeftArrowIcon fill={theme.colors.secondary} />

        <View style={styles.flatListView}>
          <FlatList
            data={ListHelper.getSearchAlplabetList(searchRoute)}
            renderItem={renderAlphabetItem}
            horizontal={true}
            ListFooterComponent={listFooterComponent}
            ListHeaderComponent={listHeaderComponent}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <GoArrowIcon fill={theme.colors.secondary} />
      </View>
    );
  };

  const renderNumberKeyboardView = () => {
    return (
      <View style={styles.numberKeyboardView}>
        {KEYBOARD_LIST.map((item, index) => {
          let isDisabled =
            item !== 'Clear' && item !== 'Close'
              ? !ListHelper.getSearchKeyboardItemEnable(searchRoute, item)
              : false;
          return (
            <AppPressable
              key={index}
              onPress={() => {
                onKeyboardItemPressed(item);
              }}
              disabled={isDisabled}
              style={styles.numberBlockView}>
              {item !== 'Close' ? (
                <Text style={styles.numberText}>{item}</Text>
              ) : (
                <KeyboardBackIcon fill={theme.colors.text} />
              )}
            </AppPressable>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.keyboardView}>
      {renderAlphabetKeyboardView()}
      {renderNumberKeyboardView()}
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    keyboardView: {
      flex: 1,
      backgroundColor: theme.colors.keyboardBackground,
      paddingBottom: sw(120),
      borderRadius: sw(10),
    },
    numberKeyboardView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginLeft: sw(16),
      marginRight: sw(10),
      marginTop: sw(8),
    },
    numberBlockView: {
      flex: 1,
      backgroundColor: theme.colors.keyboardTextBlock,
      marginRight: sw(6),
      flexBasis: '30%',
      borderRadius: sw(10),
      alignItems: 'center',
      paddingVertical: sw(12),
      marginBottom: sw(6),
    },
    numberText: {
      flex: 1,
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.lead),
      color: theme.colors.text,
    },
    alphabetKeyboardView: {
      marginHorizontal: sw(16),
      flexDirection: 'row',
      marginTop: sw(10),
      alignItems: 'center',
    },
    alphabetBlockView: {
      flex: 1,
      backgroundColor: theme.colors.keyboardTextBlock,
      marginRight: sw(8),
      borderRadius: sw(10),
      alignItems: 'center',
      paddingVertical: sw(12),
      width: sw(66),
    },
    alphabetText: {
      flex: 1,
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.lead),
      color: theme.colors.text,
    },
    listHeaderView: {
      paddingLeft: sw(8),
    },
    listFooterView: {
      paddingRight: sw(8),
    },
    flatListView: {
      marginHorizontal: sw(8),
      flex: 1,
    },
  });
};
