import React, {memo, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
interface IProps {}
const MaleFemale = memo(({}: IProps) => {
  const [selectgender, setselectgender] = useState(true);
  return (
    <View style={{margin: 10, flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => setselectgender(false)}>
     
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles1.btn}>
            {selectgender == false ? <View style={styles1.bgbtn}></View> : null}
          </View>
          <Text style={styles1.text}>Female</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setselectgender(true)}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
       
          <View style={styles1.btn}>
            {selectgender == true ? <View style={styles1.bgbtn}></View> : null}
          </View>
          <Text style={styles1.text}>Male</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});
export default MaleFemale;
const styles1 = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  btn: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: 'grey',
    borderWidth: 3,
    marginRight: 10,
  },
  bgbtn: {
    backgroundColor: 'black',
    height: 10,
    width: 10,
    borderRadius: 5,
    margin: 2,
  },
});
