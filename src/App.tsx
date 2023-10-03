import React from 'react';
import {useState,useEffect} from 'react';
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

const ARRAY_LENGTH = 5;

interface TodoItem{
  task : string;
  isCompleted : boolean;
}

// let dataArray : string[] = [];
let taskArray : string[] = [];
let dataArray : string[] = [];

// // ストレージに保存されているデータを読み込む
// for(let i =0; i < ARRAY_LENGTH; i++){ // 一旦、５つまで読み込めるように実装（今後修正予定）
//   const keyName = i.toString(); // キーを文字列に変換
//   storage.load({
//     key: keyName,
//   }).then((data: { col1: string }) => {
//     dataArray.push(data.col1);
//   }).catch((err) => {
//     console.log(err);
//   }).finally(()=>{
//     console.log('dataArrayの中のデータ:'+dataArray);
//   });
//   }

  // ストレージのデータを削除する関数
  const removeText = (index : number ) : Promise<void> => {
    return storage.remove({
      key: index.toString() // indexを文字列に変換してキーとして使用
    }).then(() => {
      window.location.reload(); // ページをリロードする
    }).catch((err) => {
      console.log(err);
    });
  };


  // keyの中身を調べる方法↓ -----------------------------------
  const keyName = 'keyWord'; // 取得したいキー名
  const storedValue = localStorage.getItem(keyName);

  if (storedValue !== null) {
    console.log(`キー ${keyName} の値は ${storedValue} です。`);
  } else {
    console.log(`キー ${keyName} は存在しません。`);
  }
//　-----------------------------------------------------

function Todo(){
    return(
      <div>
      <h1>To Do List</h1>
    </div>
    );
  }

// 追加ボタン押下時に発動する関数
function AddTask(){
  const [todos,setTodos] = useState<TodoItem[]>([]);
  const [task, setTask] = useState<string>('');
  const [items, setItems] = useState<string[]>([]); // itemsをstateとして管理

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

// // テキストの追加（画面上）
// const handleClick = (event : React.MouseEvent<HTMLButtonElement>) => {
//   if(task === '') return;
//   setTask('');

//   setTodos((todos) => [...todos,{task,isCompleted:false}]);
//   taskArray = todos.map((todo) => (todo.task));
//   console.log('taskArray :' + taskArray);
//   console.log('todos : '+ JSON.stringify(todos));


//   // ストレージにデータを保存する
//   // 一旦keyは0〜５まで発行されるように実装

//   for(let i = 0; i < 5; i++){
//     const keyName = i.toString(); // キーを文字列に変換
//     storage.save({ // ストレージにデータを保存
//       key:keyName,
//       data: {
//         col1:taskArray[i],
//         col2:i
//       },
//     }).then(() => {
//       console.log('データが保存されました')
//     }).catch((err) => {
//       console.log(err);
//     }).finally(() => {
//       storage.save({
//         key :'keyWord',
//         data: {
//           col1:i
//         }
//       })
//     })
//     };
//   }

// TODO:復活させるかも
  // const handleClick = (event : React.MouseEvent<HTMLButtonElement>) => {

  //   if(task === '') return;
  //   setTask('');
  //   setItems((prevItems) => [...prevItems, task]);
  //   console.log('prevItems:' + items);

  //   storage.save({
  //     key:'keyWord',
  //     data : {
  //       col1:items
  //     }
  //   }).then((data) => {
  //     console.log('ストレージデータのkeyの中身:'+items);
  //   }).catch((err) => {
  //     console.log('era'+err);
  //   });
  // };
// TODO:
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

      console.log('ストレージデータのkeyの中身:', updatedData.col1);
    } catch (err) {
      console.log('エラー:', err);
    }
  };


// keyの中身を調べる方法↓ -----------------------------------
const keyName = '2'; // 取得したいキー名
const storedValue = localStorage.getItem(keyName);

if (storedValue !== null) {
  console.log(`キー ${keyName} の値は ${storedValue} です。`);
} else {
  console.log(`キー ${keyName} は存在しません。`);
}
//　-----------------------------------------------------

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
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo.task}</li>
          ))}
        </ul>
        <p>{items}</p>

        {dataArray.map((data,index) => (
          <div key={index}>
            <Linkify>
            <p>{data}</p>
            </Linkify>
          <button onClick={() => removeText(index)}>削除</button>
          <button onClick={() => handleEditClick(index, data)}>編集</button>
          </div>
        ))}

      </div>
  )
}

// TODO:
function AddText(){
  const [updatedData, setUpdatedData] = useState<{ col1: string[] }>({ col1: [] });

  storage.load({
    key: 'keyWord'
  }).then((data) => {
    setUpdatedData(data);
    console.log('updatedData:'+JSON.stringify(updatedData));
  }).catch((err) => {
    console.log(err);
  });

  return(
    <div>
    <h1>keyWord</h1>
    <p>{updatedData.col1.join(', ')}</p>
    </div>
  );
    }

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
