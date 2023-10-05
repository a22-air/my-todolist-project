import React from 'react';
import {useState,useEffect,useRef} from 'react';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Linkify from 'linkify-react';
import { AddTask } from './AddTask';
import { CompletedList } from './CompletedList';

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

//   // keyの中身を調べる方法↓ -----------------------------------
//   const keyName = 'keyWord'; // 取得したいキー名
//   const storedValue = localStorage.getItem(keyName);

//   if (storedValue !== null) {
//     console.log(`キー ${keyName} の値は ${storedValue} です。`);
//   } else {
//     console.log(`キー ${keyName} は存在しません。`);
//   }
// //　-----------------------------------------------------

function Todo(){
    return(
      <div>
      <h1>To Do List</h1>
    </div>
    );
  }

// AddTextコンポーネント　=================================================================
// 追加されたデータを画面に表示するコンポーネント
function AddText(){
  const [updatedData, setUpdatedData] = useState<{ col1: string[] }>({ col1: [] });
  const [indexNumber, setIndexNumber] = useState<number>(-1);
  const [task, setTask] = useState<string>('');

  useEffect(() => {
    // ストレージデータのロード
    storage.load({
      key: 'keyWord'
    }).then((data) => {
      setUpdatedData(data);
      console.log('現在のupdatedData:'+JSON.stringify(updatedData));
    }).catch((err) => {
      console.log(err);
    });
  }, [updatedData]); // updateData の変更時に実行

  // 削除する関数
  const removeText = (indexToRemove: number) => {
    // ストレージデータをロードする
    storage.load({
      key:'keyWord'
    }).then((data) => {
      // 配列のindex番目を削除
      data.col1.splice(indexToRemove,1)

      // 変更後のストレージデータの配列を保存する処理
        storage.save({
          key:'keyWord',
          // ここで削除後のデータを入れ込む
          data:updatedData
        }).then((data) => {
          // ページをリロードする
          window.location.reload();
        }).catch((err) => {
        console.log(err);
        });

        }).catch((err) => {
          console.log(err);
        });

    };

  // 編集ボタン押下でデータの値を取得する関数
const handleEditClick = (data : string, index : number) => {
  // 選択されたindex番号のidを取得
  var element = document.getElementById("input_"+index);
  // taskに選択されたdataをセット
  setTask(data);
  // 選択されたidのテキストにフォーカスする指定
  element?.focus();
}

// テキストボックスにテキストをセットする関数
const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
  // console.log('task:'+task);
  setTask(event.target.value);
  // console.log(event.target.value)
}

// 更新ボタン押下でデータの更新を行う関数
const upDateData = ((index : number) => {
  // スロレージデータのロード
  storage.load({
    key : 'keyWord',
  }).then((data) => {
    // 選択したインデックスのデータにtaskを代入
    data.col1[index] = task;

    // 書き換えたdataを保存する
    storage.save({
      key : 'keyWord',
      // ここで書き換えた配列を更新
      data : data
    }).then(() => {
    // ページをリロードする
    window.location.reload();
    }).catch((err) => {
      console.log(err);
    });

  }).catch((err) => {
    console.log(err);
  });
})
// TODO:編集中
const [taskList, setTaskList] = useState<string[]>([]);
const [checkedTask,setCheckedTask] = useState<string>('');
// チェックボックスの値を取得する関数
// const checkTask = (data : string) => {
//   // taskに選択されたdataをセット
//   setCheckedTask(data);
//         if (checkedTask.trim() !== '') { // タスクが空でないことを確認
//           // setTaskList((prevTaskList) => [...prevTaskList, checkedTask]); // 配列に新しいタスクを追加
//           console.log('addTask : ' + taskList);
//         }
// }
// useEffect(() => {
//   console.log('checkedTask : ' + checkedTask);
//   setTaskList((prevTaskList) => [...prevTaskList, checkedTask]); // 配列に新しいタスクを追加
//   },[checkedTask]);
// TODO: 編集中
const checkTask = ((index : number) => {
  console.log(updatedData);
  storage.save({
    key : 'completed',
      data: {
        col1 : updatedData.col1[index]
      }
  }).then((data) => {
    console.log('completed : ' + JSON.stringify(data));
  }).then((err) => {
    console.log(err);
  });
});

  return(
    <div>
    <h1>keyWord</h1>
    {updatedData.col1.map((data,index) => (
      <div key={index} className="container border border-black bg-white bg-opacity-80 my-4">
        <input type="checkbox" onClick= {() => checkTask(index)}/>
        <Linkify>
        <input
          id={`input_${index}`}
          type='text'
          value={indexNumber !== index ? data : task }
          onChange={handleNewTask}
        />
        </Linkify>
        <div>
          <button onClick={() => removeText(index)}>削除</button>
          <button
            onClick={() => {
              setIndexNumber(index);
              indexNumber === index ? upDateData(index) : handleEditClick(data, index);
              }}
              >{indexNumber === index ? '更新' : '編集'}</button>
              <button onClick={() => {setIndexNumber(-1)}}>X</button>
        </div>
      </div>
    ))}
    <p>{taskList}</p>
    {/* <p>{checkedTask}</p> */}
    <div>
    <CompletedList
    updatedData={updatedData}
    taskList={taskList}
    />
    </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <header className="App-header">
        <Todo />
      </header>
      <main>
        <AddTask />
        <AddText />
      </main>
      <footer>
      </footer>
    </div>
  );
}


export default App;
