import React from 'react';
import {useState} from 'react';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

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

let dataArray : string[] = [];
let taskArray : string[] = [];

for(let i =0; i < 5; i++){ // 現在dataArrayは２つのデータが保持されているのでi=2まで
  const keyName = i.toString(); // キーを文字列に変換
storage.load({
  key: keyName,
}).then((data: { col1: string }) => {
  dataArray.push(data.col1);
}).catch((err) => {
  console.log(err);
}).finally(()=>{
  console.log('dataArrayの中のデータ:'+dataArray);
});
}

// storage.load({
//   key: '2'
// }).then((data: { col1: string }) => {
//   dataArray.push(data.col1);
//   console.log('dataArray2:'+dataArray);
// }).catch((err) => {
//   console.log(err);
// });

function Todo(){
    return(
      <div>
      <h1>To Do List</h1>
    </div>
    );
  }

function AddTask(){
  const [todos,setTodos] = useState<TodoItem[]>([]);
  const [task, setTask] = useState<string>('');

const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
  setTask(event.target.value);
  console.log(event.target.value)
}

const handleClick = (event : React.MouseEvent<HTMLButtonElement>) => {
  if(task === '') return;
  setTodos((todos) => [...todos,{task,isCompleted:false}]);
  taskArray = todos.map((todo) => (todo.task));//[1,2]
  console.log('taskArray :' + taskArray);
  setTask('');
  console.log('todos : '+ JSON.stringify(todos));

  for(let i = 0; i < 5; i++){
  const keyName = i.toString(); // キーを文字列に変換
  storage.save({
    key:keyName,
    data: {
      col1:taskArray[i]//1
    },
  }).then((data) => {
    // keyの中身を調べる方法↓ -----------------------------------
    // const keyNam = '0'; // 取得したいキー名
    const storedValue = localStorage.getItem(keyName);

    if (storedValue !== null) {
      console.log(`キー ${keyName} の値は ${storedValue} です。`);
    } else {
      console.log(`キー ${keyName} は存在しません。`);
    }
    //　-----------------------------------------------------
  }).catch((err) => {
    console.log(err);
  });
  }
//   storage.save({
//     key: '2',
//     data: {
//       col1: taskArray[1]//2 key1とkey2にそれぞれ値が入っている
//     }
//   }).then(() => {
//     console.log('key2')
//   }).catch((err) => {
//     console.log(err);
//   });
}
  return(
    <div>
        <div>
        Add Task : <input placeholder='Add New Task' value={task} onChange={handleNewTask} />
        </div>
        <div>
          <button type="submit" onClick={handleClick}>追加</button>
        </div>
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>{todo.task}</li>
          ))}
        </ul>
        {dataArray.map((data,index) => (
          <p key={index}>{data}</p>
        ))}
      </div>
  )
}

function App() {
  return (
    <div>
      <header className="App-header">
        <Todo />
      </header>
      <main>
        <AddTask />
      </main>
    </div>
  );
}



export default App;
