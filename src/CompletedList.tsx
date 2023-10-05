import React from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';

type CompletedListProps = {
    updatedData: { col1: string[] } // updatedData を受け取るプロップス
    taskList : string[];
  };

export function CompletedList(props: CompletedListProps){
    // console.log('データの受け渡し成功：' + JSON.stringify(props.updatedData));
    const [taskList, setTaskList] = useState<string[]>([]);
    // const addTask = () => {
    //     if (props.task.trim() !== '') { // タスクが空でないことを確認
    //       setTaskList((prevTaskList) => [...prevTaskList, props.task]); // 配列に新しいタスクを追加
    //       console.log('addTask : ' + taskList);
    //     }

    return(
    <div>
        <h1>Completed List</h1>
        {props.taskList.map((task, index) => (
            <div className="container border border-black bg-white bg-opacity-80 my-4" key={index}>
                {task} {/* タスクの内容を表示 */}
            </div>
        ))}
    </div>
    )
};