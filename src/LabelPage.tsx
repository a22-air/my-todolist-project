import React, { useEffect,useState,useContext } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { MyContext } from "./App";

export const useMyContext = () => {
    return useContext(MyContext);
  };
export function LabelPage(){
        const { updatedData, selectLabel } = useMyContext();

    return (
        <>
         <h2>ラベルページ</h2>
         <p>{selectLabel}</p>
         <p>{updatedData.col1}</p>
        </>

    )
};
