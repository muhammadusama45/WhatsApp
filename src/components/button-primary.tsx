import React, {memo} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

interface IProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loading?: boolean;
}

const ButtonPrimary = memo(
  ({title, onPress, style, textStyle, loading, disabled}: IProps) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, style]}
        disabled={disabled}>
        {loading ? (
          <ActivityIndicator
            size={'small'}
            color={'white'}
            style={{backgroundColor: 'transparent', alignSelf: 'center'}}
          />
        ) : (
          <Text style={[styles.title, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  },
);

export default ButtonPrimary;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    backgroundColor: 'blue',
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    fontSize: 15,
    color: 'white',
  },
});
