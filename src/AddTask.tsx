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

  // storage.save({
  //   key: 'keyWord',
  //   data:{
  //     col1:[],
  //     col2:[],
  //       col3:[]
  //   }
  // });

  let today = new Date();
  let formattedDate = today.getFullYear() * 100000000 +
                     (today.getMonth() + 1) * 1000000 +
                     today.getDate() * 10000 +
                     today.getHours() * 100 +
                     today.getMinutes() * 1;
  console.log(formattedDate);

export function AddTask(){

    const [task, setTask] = useState<string>('');
    const [taskData,setTaskData] = useState<string>('');
    const [day,setDay] = useState<number>(formattedDate);
    const [warningStatement,setWarningStatement] = useState<boolean>(true);

  // テキストをセットする関数
  const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
    console.log(event.target.value)
  }

  //日付のテキストをセットする関数
  const handleNewData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/-/g, ''); // '-' を削除
    setTaskData(sanitizedValue);
    console.log(taskData);
  }

    // 追加ボタンでデータの追加をする関数 TODO:
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {

      // テキストが空だったら以下の処理は行わない
      if (task === ''){
      setWarningStatement(false);
      return;
      }

      console.log('day:'+taskData);

      try {
        // 既存のデータを読み込む
        const existingData = await storage.load({
          key: 'keyWord',
        });
        console.log('existingData:', existingData);
        let updatedData: { col1: string[],col2: string[],col3:number[] } = { col1: [],col2: [],col3: [] };
        // 既存のデータがあれば、それを取得し新しいデータを追加
        if (existingData) {
          updatedData = {
            ...existingData,
            col1: [...existingData.col1, task],
            col2: [...existingData.col2,taskData],
            col3: [...existingData.col3,day]
          };
        } else {
          // 既存のデータがない場合、新しいデータを作成
          updatedData = {
            col1: [task],
            col2: [taskData],
            col3: [day]
          };
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
      <div className="flex justify-center items-center  my-10">
          <div className="">
            Add Task :
            <input
            placeholder={ warningStatement ? 'Add New Task' : 'Please enter'}
            onChange={handleNewTask}
            value={task}
            className={ warningStatement ? "" : "placeholder-red-500" }
            />
            Time Limit : <input onChange={handleNewData} placeholder='Time Limit' type="date" className=""></input>
          </div>

          <div className="">
            <div className="flex justify-center items-center hover:opacity-60">
              <p>new</p>
              <button onClick={handleClick} className="">
                <img src='/gesture02.png' alt='チェック' className='w-12 h-12' />
              </button>
            </div>
          </div>
      </div>
    )
  }
