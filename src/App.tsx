import React from 'react';
import {useState,useEffect,useRef} from 'react';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Linkify from 'linkify-react';

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

// AddTaskコンポーネント　========================================================
// 追加ボタン押下時に発動する関数
function AddTask(){
  const [task, setTask] = useState<string>('');

// テキストをセットする関数
const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
  setTask(event.target.value);
  console.log(event.target.value)
}

  // 追加ボタンでデータの追加をする関数
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (task === '') return;
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
    <div>
        <div>
        Add Task : <input placeholder='Add New Task' onChange={handleNewTask}
        value={task}
        />
        </div>
        <div>
          <button onClick={handleClick}>追加</button>
        </div>
      </div>
  )
}
//======================================================================================

// AddTextコンポーネント　=================================================================
// 追加されたデータを画面に表示するコンポーネント
function AddText(){
  const [updatedData, setUpdatedData] = useState<{ col1: string[] }>({ col1: [] });
  const [indexNumber, setIndexNumber] = useState<number>(-1);

  // console.log('indexNumber:'+JSON.stringify(indexNumber));

  useEffect(() => {
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

// TODO:編集ボタンを押下時、テキストをセットする関数

const [task, setTask] = useState<string>('');

  // 編集ボタン押下でデータの値を取得する関数
const handleEditClick = (data : string, index : number) => {
  console.log('dataの中身は:'+data);
  var element = document.getElementById("input_"+index);
  setTask(data);
  console.log('element : ' , element);
  element?.focus();
  console.log('task:'+task);
}

// テキストボックスにテキストをセットする関数
const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
  // console.log('task:'+task);
  setTask(event.target.value);
  // console.log(event.target.value)
}

// 更新ボタン押下でデータの更新を行う関数 TODO:
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

  return(
    <div>
    <h1>keyWord</h1>
    {updatedData.col1.map((data,index) => (
      <div key={index} className="container border border-black bg-white bg-opacity-80 my-4">
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
              if(indexNumber === index){
                upDateData(index);
              }else{
                handleEditClick(data,index)
              }
              }}
              >{indexNumber === index ? '更新' : '編集'}</button>
              <button onClick={() => {setIndexNumber(-1)}}>X</button>
        </div>
      </div>
    ))}
    <p>{task}</p>
    </div>
  );
}
//======================================================================================
// function Test() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     console.log('useEffectが実行されました');
//   });

//   return (
//     <div className="App">
//       <h1>Learn useEffect</h1>
//       <h2>Count: {count}</h2>
//       <button onClick={() => setCount(count + 1)}>+</button>
//     </div>
//   );
// }


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
    </div>
  );
}

export default App;
