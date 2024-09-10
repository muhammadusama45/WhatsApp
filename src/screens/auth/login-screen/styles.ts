import {StyleSheet} from 'react-native';
export const styleslogin = StyleSheet.create({
  loginBtn:{
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    backgroundColor: 'blue',
    marginHorizontal:10,
    borderRadius:10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,

  },
  
  loginbtnText: {
    fontSize: 15,
    color: 'white'
  },
  createbtn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    marginBottom:10,
    backgroundColor: 'white',
    marginHorizontal:10,
    borderRadius:10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
  },
  createbtnText: {
    fontSize: 15,
    color: 'blue'
  },
});


