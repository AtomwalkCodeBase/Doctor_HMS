import React from 'react';
import { View, StyleSheet } from 'react-native';
import OutlinedButton from './OutlinedButton';
import PrimaryButton from './PrimaryButton';

const ViewTabFooter = ({
  onAddAnother,
  onDone,
  addAnotherText = 'Add Another',
  doneText = 'Done',
  style,
}) => (
  <View style={[styles.fixedBottomRow, style]}>
    <OutlinedButton style={styles.addAnotherBtn} onPress={onAddAnother}>
      {addAnotherText}
    </OutlinedButton>
    <PrimaryButton style={styles.doneBtn} onPress={onDone}>
      {doneText}
    </PrimaryButton>
  </View>
);

const styles = StyleSheet.create({
  fixedBottomRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    zIndex: 10,
  },
  addAnotherBtn: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flex: 1,
    marginRight: 8,
    borderWidth: 0,
  },
  doneBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    flex: 1,
    marginLeft: 8,
  },
});

export default ViewTabFooter; 