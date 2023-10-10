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

  // keyの中身を調べる方法↓ -----------------------------------
  const keyName = 'completed'; // 取得したいキー名
  const storedValue = localStorage.getItem(keyName);

  if (storedValue !== null) {
    console.log(`キー ${keyName} の値は ${storedValue} です。`);
  } else {
    console.log(`キー ${keyName} は存在しません。`);
  }
//　-----------------------------------------------------

  // storage.remove({
  //   key: 'completed'
  // }).then((data) => {
  //   console.log('削除成功');
  // }).catch((err) => {
  //   console.log(err);
  // });
function Todo(){
    return(
      <div className='flex justify-center items-center'>
      <h1 className='text-3xl p-5'>To Do List</h1>
      <img src='/star-shirokuro.png' alt='チェック' className='w-14 h-14' />
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
// チェックボックス押下で完了リストにデータを移動
  const [checkedTask,setCheckedTask] = useState<string>('');

  const checkTask = ((index : number) => {
    setCheckedTask(updatedData.col1[index]);

    // ストレージデータをロードする
    storage.load({
      key:'keyWord'
    }).then((data) => {
      // 配列のindex番目を削除
      data.col1.splice(index,1)

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
  });

  return(
    <div className=''>
      <div className='my-10'>
    {updatedData.col1.map((data,index) => (
      <div key={index} className="container border-b border-black bg-white bg-opacity-80 my-4 flex justify-between">
        <input type="checkbox" onClick= {() => checkTask(index)}/>

        <label className="inline-flex items-center space-x-2 cursor-pointer">
        <img className='w-12 h-12' src='/heart.png' alt='' />
        <img className='w-12 h-12' src='/check02.png' alt='' />
        <div className="h-5 w-5 bg-checkbox"></div>
        <span>チェックボックスのラベル</span>
        </label>

        <Linkify>
        <input className=''
          id={`input_${index}`}
          type='text'
          value={indexNumber !== index ? data : task }
          onChange={handleNewTask}
        />
        </Linkify>
          <div className='text-center my-auto'>
            <button onClick={() => removeText(index)} className='mx-1 '>削除</button>
            <button className='mx-1'
              onClick={() => {
                setIndexNumber(index);
                indexNumber === index ? upDateData(index) : handleEditClick(data, index);
                }}
                >{indexNumber === index ? '更新' : '編集'}</button>
              <button className='mx-1' onClick={() => {setIndexNumber(-1)}}>x</button>
          </div>
      </div>
    ))}
</div>
      <div>
        <CompletedList
          updatedData={updatedData}
          checkedTask={checkedTask}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className='bg-red-100 p-8'>
    <div className='flex justify-center bg-white h-screen'>
      <div className='font-mono'>
        <header className="">
        <Todo />
        </header>
        <main>
          <AddTask />
          <AddText />
        </main>
        <footer></footer>
      </div>
    </div>
    </div>
  );
}


export default App;
