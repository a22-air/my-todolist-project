import React from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';

type CompletedListProps = {
    updatedData: { col1: string[] }; // updatedData を受け取るプロップス
  };

export function CompletedList(props: CompletedListProps){
    const dd = props.updatedData;
    console.log('データの受け渡し成功：' + JSON.stringify(dd));


    return(
      <div>
      <h1>Completed List</h1>
        <div>
        <button>ボタン</button>
        </div>
    </div>
    )
}