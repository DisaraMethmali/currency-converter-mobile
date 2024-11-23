import React from 'react';
import RNPickerSelect from 'react-native-picker-select';

const Dropdown = ({ items, value, onValueChange }) => {
  return (
    <RNPickerSelect
      onValueChange={onValueChange}
      items={items}
      value={value}
      style={{
        inputIOS: {
          fontSize: 16,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 5,
        },
        inputAndroid: {
          fontSize: 16,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 5,
        },
      }}
    />
  );
};

export default Dropdown;
