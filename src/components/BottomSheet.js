import React, { useState, useCallback } from 'react';

import { StyleSheet, View, Dimensions } from 'react-native';
import Modal from 'react-native-modalbox';

import { sh } from '~src/styles/Mixins';

let DEFAULT_SWIPE_HIGHT = 50;
export default function BottomSheet(props) {
  const { view, isOpenBottomSheet, onSetIsOpenBottomSheet } = props;

  const styles = getStyle();
  const [contentHeight, setContentHeight] = useState(
    Dimensions.get('screen').height,
  );

  const setSwipeHightArea = useCallback((event) => {
    if (contentHeight !== null) {
      return;
    }
    const { height } = event.nativeEvent.layout;
    const layout = {
      height: height,
    };
    setContentHeight(layout);
  }, []);

  const closeBottomSheetModal = () => {
    onSetIsOpenBottomSheet(false);
  };

  return (
    <Modal
      swipeToClose={false}
      backdropPressToClose={false}
      entry="bottom"
      style={styles.modalBox}
      isOpen={isOpenBottomSheet}
      onClosed={closeBottomSheetModal}
      useNativeDriver={true}>
      <View
        onLayout={setSwipeHightArea}
        style={[styles.content, contentHeight]}>
        {view}
      </View>
    </Modal>
  );
}

const getStyle = () => {
  return StyleSheet.create({
    modalBox: {
      flex: 1,
      overflow: 'hidden',
      height: '100%',
      width: '100%',
      backgroundColor: 'transparent',
    },
    content: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      justifyContent: 'center',
      borderTopLeftRadius: 20,
      maxHeight: '95%',
      borderTopRightRadius: 20,
      paddingVertical: sh(20),
      backgroundColor: 'white',
    },
  });
};
