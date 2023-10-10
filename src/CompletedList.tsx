import React from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState,useEffect} from 'react';

//ストレージの作成
const storage: Storage = new Storage({
    // 最大容量
    size: 1000,
    // バックエンドにAsyncStorageを使う
    storageBackend: AsyncStorage,
    // キャッシュ期限(null=期限なし)
    defaultExpires: null,
    // メモリにキャッシュするかどうか
    enableCache: true,
  })

type CompletedListProps = {
    updatedData: { col1: string[] } // updatedData を受け取るプロップス
    taskList : string[];
    checkedTask : string;
  };

export function CompletedList(props: CompletedListProps){
    const [completedData, setCompletedData] = useState<{ col1: string[] }>({ col1: [] });

    useEffect(() => {
        // データの読み込み
        storage.load({
          key: 'completed',
        }).then((data) => {
          setCompletedData(data);
        }).catch((err) => {
          console.log(err);
        });
      }, []);

    //   データの更新
  useEffect(() => {
    if (props.checkedTask) {
      // 新しいデータを作成
      const updatedData = {
        col1: [...completedData.col1, props.checkedTask],
      };

      console.log('completedData  : ' + JSON.stringify(completedData));

      // データの保存
      storage.save({
        key: 'completed',
        data: updatedData,
      }).then((data) => {
        // setCompletedData(updatedData); // 状態を更新
        console.log('データの中身は : ' +data);
        window.location.reload(); // ページをリロードする

      }).catch((err) => {
        console.log(err);
      });
    }
  }, [props.checkedTask, completedData.col1]);

    return(
    <div>
        <h1>Completed List</h1>
        {props.taskList.map((task, index) => (
            <div className="container border border-black bg-white bg-opacity-80 my-4" key={index}>
                {task} {/* タスクの内容を表示 */}
            </div>
        ))}
        <h1>{props.checkedTask}</h1>
        {completedData.col1.map((data,index) => (
            <div key={index}>{data}</div>
        ))}
    </div>
    )
};