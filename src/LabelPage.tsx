import React, { useEffect,useState,useContext } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { MyContext } from "./App";

export function LabelPage(
){
        const updatedData = useContext(MyContext);
    return (
        <>
         <h2>ラベルページ</h2>
         <p>{updatedData.col1}</p>
        </>

    )
};
