import React from 'react';

import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';

export default function Loader(props) {
  const { isLoaderShow } = props;
  return (
    <Modal transparent={true} visible={isLoaderShow}>
      <View style={styles.mainContainer}>
        <ActivityIndicator size="large" color={'#4444FF'} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
