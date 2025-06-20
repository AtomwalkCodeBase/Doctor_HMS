import React from 'react';
import styled from 'styled-components/native';
import { Dropdown } from 'react-native-element-dropdown';
import { Text } from 'react-native';
import {colors} from '../Styles/appStyle';

const FieldContainer = styled.View`
  margin-bottom: 10px;
  margin-top: 5px;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const PickerContainer = styled.View``;

const DropdownPicker = ({ error, label, data, value, setValue, style, showLabel = true }) => {
  const dropdownStyle = {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 0,
    justifyContent: 'center',
    textAlignVertical: 'center',
    marginTop: 10,
    ...style,
  };
  return (
    <FieldContainer style={!showLabel ? { marginTop: 0, marginBottom: 0 } : {}}>
      {showLabel && <Label>{label}</Label>}
      <PickerContainer>
        <Dropdown
          data={(data || []).map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          labelField="label"
          valueField="value"
          placeholder={label ? `Select ${label}` : 'Select'}
          value={value}
          onChange={(item) => setValue(item.value)}
          style={dropdownStyle}
          containerStyle={{}}
          placeholderStyle={{
            color: '#ccc',
            fontSize: 16,
          }}
          selectedTextStyle={{
            fontSize: 16,
          }}
        />
      </PickerContainer>
      {error && (
        <Text style={{marginTop: 7, color: colors.red, fontSize: 12}}>
          {error}
        </Text>
      )}
    </FieldContainer>
  );
};

export default DropdownPicker;
