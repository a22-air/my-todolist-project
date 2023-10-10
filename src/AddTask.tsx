import React from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';

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

export function AddTask(){

    const [task, setTask] = useState<string>('');

  // テキストをセットする関数
  const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
    console.log(event.target.value)
  }

    // 追加ボタンでデータの追加をする関数
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      // テキストが空だったら以下の処理は行わない
      if (task === '') return;
      //taskにテキストに入力されたデータをセットする
      setTask('');

      try {
        // 既存のデータを読み込む
        const existingData = await storage.load({
          key: 'keyWord',
        });

        let updatedData: { col1: string[] } = { col1: [] };
        // 既存のデータがあれば、それを取得し新しいデータを追加
        if (existingData) {
          updatedData = {
            ...existingData,
            col1: [...existingData.col1, task],
          };
        } else {
          // 既存のデータがない場合、新しいデータを作成
          updatedData.col1 = [task];
        }

        // 新しいデータを保存
        await storage.save({
          key: 'keyWord',
          data: updatedData,
        });

        window.location.reload(); // ページをリロードする

      } catch (err) {
        console.log('エラー:', err);
      }
    };

    return(
      <div className="flex justify-center items-center">
          <div className="text-2xl">
          Add Task : <input placeholder='Add New Task' onChange={handleNewTask}
          value={task}
          />
          </div>
          <div className="hover:opacity-60">
            <button onClick={handleClick}>
            <img src='/gesture02.png' alt='チェック' className='w-14 h-14' />
            </button>
          </div>
        </div>
    )
  }
