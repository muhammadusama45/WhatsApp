import React, { memo, useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; 

interface IProps{
    zIndex: number
}

const Dropdown = memo(({zIndex}:IProps)=>{

    const [open,setOpen] =useState(false);
    const [value,setValue] = useState(null);
    const [item,setItems]=useState([
        {
            label: "Option1",
            value: "Value1"
        },
        {
            label: "Option2",
            value: "Value2"
        },
        {
            label: "Option3",
            value: "Value3"

        },
        {
            label: "Option4",
            value: "Value4"

        },
        {
            label: "Option5",
            value: "Value5"

        },
        {
            label: "Option6",
            value: "Value6"

        }
    ])



    return(
        
       
            <DropDownPicker
            items={item}
            setItems={setItems}
            listItemLabelStyle={{fontSize:18,fontWeight:"500",}}
            value={value}
            setValue={setValue}
            open={open}
            setOpen={setOpen}
           
            closeAfterSelecting={true}
            placeholder="Select an item"
            placeholderStyle={{fontSize:18}}
            searchable={true}
            autoScroll={true}
            listMode={'SCROLLVIEW'}
            //maxHeight={200}
            
           
            style={{
                borderRadius:10,
                elevation:10,
                
                height:50,
                zIndex:1,
                borderColor:"white"    
                
            }}
            listItemContainerStyle={{
                zIndex:zIndex,
                
                
                
             
                
            }}
            modalContentContainerStyle={{zIndex:zIndex}}
            scrollViewProps={{
                decelerationRate: "fast"
              }}
            dropDownContainerStyle={{
                zIndex:zIndex,
                maxHeight:200,
                
                
               // marginHorizontal:10
               

            }}
            containerStyle={
                {
                    
                    ///marginHorizontal:10
                    
                    

                }
            }
            labelStyle={{
                //backgroundColor:"green",
                fontSize:18,
                
               // marginHorizontal:10
            
            
            }}
            

            
            />
       
        
    );
}  
) 

export default Dropdown;