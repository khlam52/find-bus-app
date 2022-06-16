import React, { useEffect } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modalbox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from './AppButton';
import SelectionFlatList from './SelectionFlatList';
import { CloseIcon } from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Colors, Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';

BottomSelectionMenu.defaultProps = {
  title: '',
  selectedItem: null,
  menuList: [],
  menuRef: null,
  onSelectMenuItem: null,
  onCloseMenu: null,
  showCloseBtn: true,
};

export default function BottomSelectionMenu({
  title,
  selectedItem,
  menuList,
  menuRef,
  onSelectMenuItem,
  onCloseMenu,
  showCloseBtn,
}) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  useEffect(() => {
    console.log('BottomSelectionMenu -> useEffect');
  }, []);

  const closeMenu = () => {
    if (menuRef && menuRef.current) {
      menuRef.current.close();
      if (onCloseMenu) {
        onCloseMenu();
      }
    }
  };
  const onMenuOpen = () => {};
  const onMenuClose = () => {};
  const onCloseButtonPressed = () => {
    closeMenu();
  };

  const onSelectionListItemPressed = (item) => {
    if (onSelectMenuItem) {
      onSelectMenuItem(item);
    }
  };

  const onDoneButtonPressed = () => {
    closeMenu();
  };

  return (
    <Modal
      swipeToClose={false}
      backdropPressToClose={false}
      backdrop={true}
      onOpened={onMenuOpen}
      onClosed={onMenuClose}
      entry="bottom"
      style={styles.modalBox}
      useNativeDriver={true}
      ref={menuRef}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            {showCloseBtn && (
              <AppPressable onPress={onCloseButtonPressed}>
                <CloseIcon width={sw(28)} height={sw(28)} fill={Colors.BLACK} />
              </AppPressable>
            )}
            <AppButton
              text={t('BUTTONS.DONE')}
              btnHeight={sw(34)}
              onPress={onDoneButtonPressed}
              backgroundColor={Colors.BLACK}
            />
          </View>

          {title ? <Text style={styles.titleText}>{title}</Text> : null}
          <View style={styles.separator} />
          <SelectionFlatList
            selectedItem={selectedItem}
            itemList={menuList}
            onSelectionListItemPressed={onSelectionListItemPressed}
          />
        </View>
      </View>
    </Modal>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    modalBox: {
      flex: 1,
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      backgroundColor: 'transparent',
    },
    separator: {
      borderBottomColor: theme.colors.underlayerLt,
      borderBottomWidth: sh(1),
    },
    outerContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    container: {
      borderTopLeftRadius: sw(theme.roundness.container),
      borderTopRightRadius: sw(theme.roundness.container),
      backgroundColor: Colors.WHITE,
      paddingBottom: sh(20),
    },
    buttonContainer: {
      paddingHorizontal: sw(theme.spacings.s3),
      marginTop: sh(theme.spacings.s3),
      flexDirection: 'row',
      marginBottom: sh(13),
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleText: {
      textAlign: 'center',
      marginTop: sh(5),
      marginBottom: sh(18),
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h5),
      color: theme.colors.text,
    },
    doneButtonView: {},
  });
};
