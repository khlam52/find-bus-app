import React, { useState } from 'react';

import { useStoreActions } from 'easy-peasy';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackIcon } from '~src/assets/images';
import BaseHeader from '~src/components/BaseHeader';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';

export default function TestScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [isOpenBottomSheet, onSetIsOpenBottomSheet] = useState(true);
  const setLogin = useStoreActions((actions) => actions.user.setLogin);

  const insets = useSafeAreaInsets();
  const styles = getStyle(insets);

  return (
    <View style={styles.container}>
      <BaseHeader
        title={'Test Screen'}
        leftElement={
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon stroke={'#FFFFFF'} fill={'#FFFFFF'} />
          </Pressable>
        }
      />
      <Text>test screen</Text>
    </View>
  );
}

const getStyle = (insets) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
  });
};
