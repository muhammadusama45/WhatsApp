import React, {memo, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
interface IProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  children?: JSX.Element;
}
const Input = memo(
  ({placeholder, value, onChangeText, secureTextEntry, children}: IProps) => {
    const [secure, onsecure] = useState(true);
    const handleSecure = () => {
      onsecure(toggle => !toggle);
    };
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={{flex: 1}}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
        {children}
      </View>
    );
  },
);
export default Input;
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',

    paddingHorizontal: 10,
    height: 48,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    fontSize: 20,
    //fontWeight:"bold",
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
  wrapper: {flexDirection: 'row', justifyContent: 'center'},
});
