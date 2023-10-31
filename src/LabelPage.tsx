import React, { useEffect,useState,useContext } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { MyContext } from "./App";
import { NearMeDisabledSharp } from "@mui/icons-material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


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
        <span className="m-2 text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-purple-600 bg-purple-200 uppercase last:mr-0 mr-1">
            {selectData}
        </span>
        <div className="m-2">
         {selectedData.map((data, index) => (
            <div key={`selectData_${index}`} className="my-5 flex justify-between border-b border-black">
                <div className="flex justify-center items-center">
                    <FavoriteBorderIcon className="mr-2"/>
                    <p>{data.col1}</p>
                </div>

            <div className="flex w-1/3 text-center">
                <div className="w-1/2">
                    <p className="text-xs">追加日</p>
                    <p>{data.col2}</p>
                </div>
                <div>
                    <p className="text-xs">期限</p>
                    <p>{data.col3}</p>
                </div>
            </div>

            </div>
        ))}
        </div>

        </>

    )
};
