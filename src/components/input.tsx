import React, {memo} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
interface IProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}
const Input = memo(
  ({placeholder, value, onChangeText, secureTextEntry}: IProps) => {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          style={{}}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
        />
      </View>
    );
  },
);
export default Input;
const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: 'center',
    backgroundColor:'#fff',
    paddingHorizontal: 10,
    height: 48,
    marginBottom:10,
    marginHorizontal:10,
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
