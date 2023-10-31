import React, { useEffect,useState,useContext } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { MyContext } from "./App";
import { NearMeDisabledSharp } from "@mui/icons-material";

export const useMyContext = () => {
    return useContext(MyContext);
  };
export function LabelPage(){
    const { updatedData, selectLabel,selectData } = useMyContext();

    const indices = updatedData.col4
        .map((subArray, index) => subArray.includes(selectData) ? index : -1)
        .filter((index) => index !== -1);
        console.log(indices);

        const selectedData = indices.map(index => ({
            col1: updatedData.col1[index],
            col2: updatedData.col2[index],
            col3: updatedData.col3[index],
            col4: updatedData.col4[index],
          }));

          console.log('selectedData'+JSON.stringify(selectedData));



    return (
        <>
         <h3>{selectData}</h3>
         {selectedData.map((data, index) => (
            <div key={`selectData_${index}`}>
              <p>{data.col1}</p>
              <p>{data.col2}</p>
              <p>{data.col3}</p>
            </div>
        ))}
        </>

    )
};
