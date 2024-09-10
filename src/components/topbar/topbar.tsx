import React, {memo} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';

interface Iprops {
  text: string;
  icon?: JSX.Element;
}

const Topbar = memo(({text, icon}: Iprops) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});

export default Topbar;
