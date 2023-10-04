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

interface TodoItem{
  task : string;
  isCompleted : boolean;
}

// let dataArray : string[] = [];
let dataArray : string[] = [];

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
  setEditValue(event.target.value);
  console.log(event.target.value)
}

 // 編集ボタン押下でテキストにセットする関数
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

// 編集ボタンがクリックされたときの処理
const handleEditClick = (index: number, data: string) => {
  // 編集対象のデータを読み込む
  setEditValue(data);
  setEditingIndex(index);
};

// 更新ボタン押下でテキストの書き換えを行う
const editText = (event : React.MouseEvent<HTMLButtonElement>) => {
  if(editingIndex !== null){
   storage.save({
    key:editingIndex.toString(),
    data:{
      col1:editValue
    }
   }).then((data)=>{
    console.log('更新');
    window.location.reload(); // ページをリロードする
   }).catch((err)=>{
    console.log(err);
   });
  };
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
        value=
        {editingIndex === null ? task : editValue}
        />
        </div>
        <div>
          <button onClick={editingIndex === null ? handleClick : editText }>{editingIndex === null ? '追加' : '更新'}</button>
        </div>
        {/* <ul> */}
          {/* {todos.map((todo, index) => (
            <li key={index}>{todo.task}</li>
          ))}
        </ul>
        <p>{items}</p> */}

        {/* {dataArray.map((data,index) => (
          <div key={index}>
            <Linkify>
            <p>{data}</p>
            </Linkify>
          <button onClick={() => removeText(index)}>削除</button>
          <button onClick={() => handleEditClick(index, data)}>編集</button>
          </div>
        ))} */}

      </div>
  )
}
//======================================================================================

// AddTextコンポーネント　=================================================================
// 追加されたデータを画面に表示するコンポーネント
function AddText(){
  const [updatedData, setUpdatedData] = useState<{ col1: string[] }>({ col1: [] });
  const [indexNumber, setIndexNumber] = useState<number>(-1);

  console.log('indexNumber:'+JSON.stringify(indexNumber));

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

const [selectedData, setSelectedData] = useState('');
const inputEl = useRef<HTMLInputElement | null>(null);

// FIXME:編集中

// const focusInput = (node : HTMLInputElement | null, index : number) => {
//   let tempId = `input_${index}`;
//   console.log("focusInput : " + tempId);
//   if (node?.id === tempId) {
//     node?.focus();
//   }
//   console.log('inputEl.current',inputEl.current);
//   };

  // 編集ボタン押下でデータの値を取得する関数
const handleEditClick = (data : string) => {
  console.log('dataの中身は1:'+data);
  setSelectedData(data);
  console.log('dataの中身は2:'+selectedData);
}
  return(
    <div>
    <h1>keyWord</h1>
    {updatedData.col1.map((data,index) => (
      <div className="container border border-black bg-white bg-opacity-80 my-4">
      <p
      className={indexNumber === index ? 'hidden' : ''}
      >{data}</p>
      <input id={`input_${index}`}
      ref={inputEl}
      // ref={(node) => {focusInput(node, index);console.log('nodeの中身は : ',node);}}
       type='text' value={data}
      className={indexNumber !== index ? 'hidden' : '' }
      />
      <div>
      <button onClick={() => removeText(index)}>削除</button>
      <button
        onClick={() => {
          handleEditClick(data);
          setIndexNumber(index);
          }}
          >{indexNumber === index ? '更新' : '編集'}</button>
      </div>
      </div>
    ))}
    <p>{selectedData}</p>
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
