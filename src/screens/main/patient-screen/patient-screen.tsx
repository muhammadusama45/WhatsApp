import React, {memo, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  ScrollView,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import styles from './styles';
import {TouchableOpacity} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Dropdown from '../../../components/drop-down/drop-down';

interface IProps {}

const PatientScreen = memo(({}: IProps) => {
  const [selectedButton, setSelectedButton] = useState<number>(0);
  const [id, setId] = useState<number>(0);

  // const [isVisible , setIsVisible] = useState(false)
  // const handleButtonPress = () => {
  //   setIsVisible(!isVisible);
  // };
  const arraydata = [
    {
      id: 1,
      title: 'New Prescriptionn Request',
      medicinneName: 'Vardanafil RDT ',
      formula: '(Vardenafil RDT) (Tadalafil / Vardenafil / Apomorphine)',
      dosage: ' 10 mg',
      prescription:
        '# 30 ODT / month (total dispensed 90 ODT for 3 months), #3 Refills',
    },
    {
      id: 2,
      title: 'New Prescriptionn Request',
      medicinneName: 'Vardanafil RDT ',
      formula: '(Vardenafil RDT) (Tadalafil / Vardenafil / Apomorphine) ',
      dosage: '10 mg',
      prescription:
        '# 30 ODT / month (total dispensed 90 ODT for 3 months), #3 Refills',
    },
  ];

  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.mainView}>
        <View
          style={{
            backgroundColor: 'blue',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginBottom: 10,
          }}>
          <Text
            style={{
              marginHorizontal: 10,
              padding: 10,
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {item.title}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              padding: 10,
              backgroundColor: 'green',
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white'}}>InProgress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: '#9acd32',
              marginLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              borderRadius: 5,
            }}>
            <FontAwesome6 name={'user-check'} color={'white'} size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: '#9acd32',
              marginLeft: 5,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              borderRadius: 5,
            }}>
            <MaterialCommunityIcons
              name={'text-box-plus-outline'}
              color={'white'}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              backgroundColor: '#9acd32',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
              padding: 10,
              borderRadius: 5,
            }}>
            <MaterialCommunityIcons
              name={'plus-minus-box'}
              color={'white'}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginHorizontal: 10,
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Text
            style={{fontSize: 12, fontWeight: 'bold', flexDirection: 'row'}}>
            <Text>{`${item.medicinneName}${item.formula}`}</Text>
            <Text style={{color: '#daa520'}}>{`${item.dosage}`}</Text>
          </Text>
        </View>

        <View style={{marginBottom: 20}}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
              marginBottom: 10,
            }}
            onPress={() => {
              //setIsVisible(true);
              setId(item?.id);
              setSelectedButton(1);
              console.log(selectedButton);
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 25,
                borderColor: '#daa520',
                borderWidth: 2,
                marginRight: 10,
              }}>
              {selectedButton === 1 && item.id == id && (
                <View
                  style={{
                    backgroundColor: '#daa520',
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    margin: 3,
                  }}></View>
              )}
            </View>
            <Text style={{fontSize: 14, fontWeight: '600'}}>
              Approve as order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
              marginBottom: 10,
            }}
            onPress={() => {
              //setIsVisible(false);
              setSelectedButton(2);
              setId(item?.id);
              console.log(selectedButton);
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 25,
                borderColor: '#daa520',
                borderWidth: 2,
                marginRight: 10,
              }}>
              {selectedButton == 2 && item.id == id && (
                <View
                  style={{
                    backgroundColor: '#daa520',
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    margin: 3,
                  }}></View>
              )}
            </View>
            <Text style={{fontSize: 14, fontWeight: '600'}}>
              Approve with Change
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
              marginBottom: 10,
            }}
            onPress={() => {
              setId(item?.id);
              //setIsVisible(false)
              setSelectedButton(3);
              console.log(selectedButton);
            }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 25,
                borderColor: '#daa520',
                borderWidth: 2,
                marginRight: 10,
              }}>
              {selectedButton == 3 && item.id == id && (
                <View
                  style={{
                    backgroundColor: '#daa520',
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    margin: 3,
                  }}></View>
              )}
            </View>
            <Text style={{fontSize: 14, fontWeight: '600'}}>Diapprove</Text>
          </TouchableOpacity>
        </View>

        {id === item?.id && (
          <View style={{backgroundColor: 'lightgrey'}}>
            <View style={{marginHorizontal: 10, marginVertical: 15}}>
              <Text style={{fontSize: 25, fontWeight: 'bold'}}>
                Prescription Writer
              </Text>
            </View>
            <View style={{marginHorizontal: 10, marginBottom: 10}}>
              <Text style={{fontSize: 25, fontWeight: '500'}}>
                Consultation Type
              </Text>
            </View>

            <Menu>
              <MenuTrigger
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  marginHorizontal: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                  height: 50,
                  paddingHorizontal: 10,
                }}>
                <Text style={{fontSize: 18}}>Select</Text>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={30}
                  color={'black'}
                />
              </MenuTrigger>

              <MenuOptions
                customStyles={optionsStyles}
                optionsContainerStyle={{width: '90%', alignSelf: 'center'}}>
                <ScrollView>
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 1"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 2"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 3"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 4"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                </ScrollView>
              </MenuOptions>
            </Menu>

            <View style={{marginHorizontal: 10, marginBottom: 10}}>
              <Text style={{fontSize: 25, fontWeight: '500'}}>Category</Text>
            </View>

            <View style={{marginHorizontal: 10, zIndex: 1000}}>
              <Dropdown zIndex={1000} />
            </View>

            {/* <Menu>
                <MenuTrigger  style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                marginHorizontal: 10,
                marginBottom: 10,
                borderRadius: 10,
                height: 50,
                paddingHorizontal: 10,}}>
             
              <Text style={{fontSize: 18}}>Select</Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={30}
                    color={'black'}
                  />
              
                </MenuTrigger>

                <MenuOptions
                  customStyles={optionsStyles}
                  optionsContainerStyle={{width: '90%', alignSelf:'center'}}>

                    <ScrollView>
                    <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 1"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 2"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 3"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                   <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 4"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  
                    </ScrollView>
                  
                </MenuOptions>
              </Menu> */}

            <View style={{marginHorizontal: 10, marginBottom: 10}}>
              <Text style={{fontSize: 25, fontWeight: '500'}}>
                Consultation Note
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                justifyContent: 'center',
              }}>
              <ScrollView
                contentContainerStyle={{}}
                style={{
                  borderRadius: 10,
                  minHeight: 50,
                  padding: Platform.OS === 'ios' ? 10 : 0,
                  maxHeight: 200,
                  backgroundColor: 'white',
                  marginBottom: 10,
                  shadowColor: 'black',
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  elevation: 10,
                  shadowRadius: 5.5,
                  shadowOpacity: 0.32,
                }}>
                <TextInput
                  placeholder="Add Note"
                  multiline={true}
                  scrollEnabled={true}
                  placeholderTextColor={'black'}
                  style={{fontSize: 18}}></TextInput>
              </ScrollView>
            </View>

            <View style={{marginHorizontal: 10, marginBottom: 10}}>
              <Text style={{fontSize: 25, fontWeight: '500'}}>Medicine</Text>
            </View>

            {/* <Menu>
                <MenuTrigger  style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                marginHorizontal: 10,
                marginBottom: 10,
                borderRadius: 10,
                height: 50,
                paddingHorizontal: 10,}}>
             
              <Text style={{fontSize: 18}}>Select</Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={30}
                    color={'black'}
                  />
              
                </MenuTrigger>

                <MenuOptions
                  customStyles={optionsStyles}
                  optionsContainerStyle={{width: '90%', alignSelf:'center'}}>

                    <ScrollView>
                    <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 1"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 2"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 3"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                   <MenuOption
                    onSelect={() => Alert.alert(`Save`)}
                    text="Type 4"
                    style={{
                      height: 50,
                      justifyContent: 'center',
                    }}
                  />
                  
                    </ScrollView>
                  
                </MenuOptions>
              </Menu> */}
            <View style={{marginHorizontal: 10}}>
              <Dropdown zIndex={2000} />
              <View style={{marginVertical: 10}}>
                <Text style={{fontSize: 25, fontWeight: '500'}}>Direction</Text>
              </View>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 18, fontWeight: '400'}}>
                  Take one under tongue, as needed 15-30 minutes before sexual
                  activity; no more than one per 24 hours
                </Text>
              </View>
              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 25, fontWeight: '500'}}>
                  Quantity per month
                </Text>
              </View>
              <Menu>
                <MenuTrigger
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    //marginHorizontal: 10,
                    marginBottom: 10,
                    borderRadius: 10,
                    height: 50,
                    paddingHorizontal: 10,
                  }}>
                  <Text style={{fontSize: 18}}>Select</Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={30}
                    color={'black'}
                  />
                </MenuTrigger>

                <MenuOptions
                  customStyles={optionsStyles}
                  optionsContainerStyle={{width: '90%', alignSelf: 'center'}}>
                  <ScrollView>
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 1"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 2"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 3"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 4"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                  </ScrollView>
                </MenuOptions>
              </Menu>

              <View style={{marginBottom: 10}}>
                <Text style={{fontSize: 25, fontWeight: '500'}}>
                  Number of month supply
                </Text>
              </View>
              <Menu>
                <MenuTrigger
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    // marginHorizontal: 10,
                    marginBottom: 10,
                    borderRadius: 10,
                    height: 50,
                    paddingHorizontal: 10,
                  }}>
                  <Text style={{fontSize: 18}}>Select</Text>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={30}
                    color={'black'}
                  />
                </MenuTrigger>

                <MenuOptions
                  customStyles={optionsStyles}
                  optionsContainerStyle={{width: '90%', alignSelf: 'center'}}>
                  <ScrollView>
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 1"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 2"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 3"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                    <MenuOption
                      onSelect={() => Alert.alert(`Save`)}
                      text="Type 4"
                      style={{
                        height: 50,
                        justifyContent: 'center',
                      }}
                    />
                  </ScrollView>
                </MenuOptions>
              </Menu>

              <TouchableOpacity
                onPress={() => {}}
                style={{
                  //marginHorizontal: 10,
                  borderRadius: 10,
                  height: 40,
                  marginBottom: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#E5A00F',
                }}>
                <Text style={{fontSize: 18, fontWeight: '800', color: 'white'}}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Topbar />

      <FlatList
        data={arraydata}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 10,
          //backgroundColor:"white"
        }}
      />
    </View>
  );
});

export default PatientScreen;

const Topbar = () => {
  return (
    <View
      style={{
        backgroundColor: 'blue',
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
      }}>
      <View>
        <Image
          style={{height: 40, width: 40, borderRadius: 20}}
          source={require('../../../assets/list-images/man5.png')}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            marginHorizontal: 10,
            textAlign: 'center',
            textTransform: 'capitalize',
          }}>
          Inquiries
        </Text>
      </View>
      <View>
        <Image
          style={{height: 40, width: 40, borderRadius: 20}}
          source={require('../../../assets/list-images/woman1.png')}
        />
      </View>
    </View>
  );
};

const optionsStyles = StyleSheet.create({
  optionsContainer: {
    maxHeight: 200,
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 10,
    marginTop: 50,
    marginHorizontal: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 10,
    shadowRadius: 5.5,
    shadowOpacity: 0.32,
  },
  optionWrapper: {
    backgroundColor: 'skyblue',
    alignItems: 'center',
    margin: 5,
  },
  optionText: {
    fontSize: 18,
    color: 'black',
  },
});
