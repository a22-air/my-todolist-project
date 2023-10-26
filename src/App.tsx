import React from 'react';
import {useState,useEffect,useCallback} from 'react';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import Linkify from 'linkify-react';
import { AddTask } from './AddTask';
import { CompletedList } from './CompletedList';
import { LabelList } from "./LabelList";

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import Chip from '@mui/material/Chip';

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
  // storage.save({
  //   key: 'completed',
  //   data:{
  //     col1:[],
  //     col2:[],
  //     col3:[],
  //     col4:[],
  //   },
  // }).then((data) => {
  //   console.log(' : ' + JSON.stringify(data));
  // }).catch((err) => {
  //   console.log(err);
  // });

  //keyの中身を調べる方法↓ -----------------------------------
  const keyName = 'completed'; // 取得したいキー名
  const storedValue = localStorage.getItem(keyName);

  if (storedValue !== null) {
    console.log(`キー ${keyName} の値は ${storedValue} です。`);
  } else {
    console.log(`キー ${keyName} は存在しません。`);
  }
// 　-----------------------------------------------------

//ストレージデータを削除する時 --------------------------------
  // storage.remove({
  //   key: 'completed'
  // }).then((data) => {
  //   console.log('削除成功');
  // }).catch((err) => {
  //   console.log(err);
  // });
//---------------------------------------------------------

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
  // const [updatedData, setUpdatedData] = useState<{ col1: string[],col2:number[],col3: number[] }>({ col1: [],col2: [], col3: [] });
  const [updatedData, setUpdatedData] = useState<{ col1: string[],col2:number[],col3: number[],col4: string[][] }>({ col1: [],col2: [], col3: [], col4:[] });

  const [indexNumber, setIndexNumber] = useState<number>(-1);
  const [task, setTask] = useState<string>('');
  const [taskDate,setTaskDate] = useState<string>('');

  useEffect(() => {
    // ストレージデータのロード
    storage.load({
      key: 'keyWord'
    }).then((data) => {
      setUpdatedData(data);
      console.log('現在のupdatedData:'+JSON.stringify(updatedData,null,1));
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
      data.col1.splice(indexToRemove,1);
      data.col2.splice(indexToRemove,1);
      data.col3.splice(indexToRemove,1);
      data.col4.splice(indexToRemove,1);

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

  // 編集ボタン押下でテキストのデータの値を取得する関数
  const handleEditClick = (data : string, index : number) => {
  // 選択されたindex番号のidを取得
  var element = document.getElementById("input_"+index);
  // taskに選択されたdataをセット
  setTask(data);
  // 選択されたidのテキストにフォーカスする指定
  element?.focus();
}

// カレンダーの初期値をセットする関数
const calendarInitialValue = ((index:number) => {
  // col2のデータをnumber型から文字列に変更
  const originalNumber = updatedData.col2[index].toString();
  // - を追加して日付の表示設定
  const formattedDate = originalNumber.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  // - 追加後の日付を返す
  return formattedDate;
})

// 編集後のカレンダーのデータを取得する関数
  const editDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/-/g, ''); // '-' を削除
    setTaskDate(sanitizedValue);
    console.log('編集後の日付 : '+taskDate);
  }

// テキストボックスにテキストをセットする関数
const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
  setTask(event.target.value);
}

// 更新ボタン押下でデータの更新を行う関数 TODO:
const upDateData = ((index : number) => {

// col4の配列の中身と選択されたラベルを同じ配列に追加する
const editLabelData = updatedData.col4[index].concat(labelTypeArray);

// 配列の中の同じデータを取り除く処理
const set = new Set(editLabelData);
const newArr = [...set];

  // スロレージデータのロード
  storage.load({
    key : 'keyWord',
  }).then((data) => {
    // 選択したインデックスのデータにtaskを代入
    data.col1[index] = task;
    data.col2[index] = taskDate;
    data.col4[index] = newArr;

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
  const [checkedNum,setCheckedNum] = useState<number>(0);
  const [checkedTaskArray, setCheckedTaskArray] = useState<{ col1: string, col2: number, col3: number,col4:string[] }>({
    col1: '',
    col2: 0,
    col3: 0,
    col4:[]
  });

  const checkTask = ((index : number) => {
    setCheckedTask(updatedData.col1[index]);
    setCheckedTaskArray({col1:updatedData.col1[index],col2:updatedData.col2[index],col3:updatedData.col3[index],col4:updatedData.col4[index]});
    console.log('checkedTaskArray : ' + JSON.stringify(checkedTaskArray));
    setCheckedNum(1);

    // ストレージデータをロードする
    storage.load({
      key:'keyWord'
    }).then((data) => {
      // 配列のindex番目を削除
      data.col1.splice(index,1)
      data.col2.splice(index,1)
      data.col3.splice(index,1)
      data.col4.splice(index,1)

      // 変更後のストレージデータの配列を保存する処理
        storage.save({
          key:'keyWord',
          // ここで削除後のデータを入れ込む
          data:updatedData
        }).then((data) => {
          // ページをリロードする
          // window.location.reload();
        }).catch((err) => {
        console.log(err);
        });
      console.log('data : ' + JSON.stringify(data));

        }).catch((err) => {
          console.log(err);
        });
  });

  // 未完成
  // const [checkBox, setCheckBox] = useState<boolean>();
  // // チェックボックス押下で色をグレーにする関数
  // const strikeThrough = (( ) => {
  //   console.log('strikeThrough : ' + checkBox);
  //   console.log('strikeThrough : ' + checkBox);
  // })

  // ソートする関数
  const clickSort = ((num:number) =>{
    console.log('ソート前のcol2 : '+JSON.stringify(updatedData.col2));

    // 数値のソート関数を作成
    function numericSort(arr: number[], ascending: boolean): number[] {
      return arr.slice().sort((a, b) => (ascending ? a - b : b - a));
    }
    // ソート前のcol2のインデックスを取得
    const sortedIndexes = updatedData.col2.map((_, index) => index);

    if (num === 0 || num === 1) {
      // col2 のソート後のインデックスを取得
      sortedIndexes.sort((a, b) => (num === 0 ? updatedData.col2[a] - updatedData.col2[b] : updatedData.col2[b] - updatedData.col2[a]));

      // col1 を col2 のソート後の順序に並び替え
      updatedData.col1 = sortedIndexes.map((index) => updatedData.col1[index]);
      updatedData.col3 = sortedIndexes.map((index)=> updatedData.col3[index]);
      updatedData.col4 = sortedIndexes.map((index)=> updatedData.col4[index]);

      // col2 をソート
        updatedData.col2 = numericSort(updatedData.col2, num === 0);
    } else {
      console.log('ソートできませんでした');
      return;
    }

    storage.load({
      key: 'keyWord'
    }).then((data) => {
      // ソート後の配列を保存する
      storage.save({
        key:'keyWord',
        data:updatedData
      }).then((data) => {
        // ページをリロードする
        window.location.reload();
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
      console.log();
    })

  });

  // 追加日の日付表示方法を変更する関数
    const middleDateArray = updatedData.col3.map((number) => {
      const numberString = number.toString(); // 数値を文字列に変換
      const middleData = numberString.substring(0, 8); // 0番目から8文字取得
      const formattedDate = `${middleData.substring(0, 4)}/${middleData.substring(6,4)}/${middleData.substring(6)}`; // フォーマット
      return formattedDate;
    });

  // 期限の日付表示方法を変更する関数
  const timeLimitArray = updatedData.col2.map((number) => {
    const numberString = number.toString(); // 数値を文字列に変換
    // 期限があればフォーマットする
    if(number){
    const formattedDay = `${numberString.substring(0, 4)}/${numberString.substring(6,4)}/${numberString.substring(6)}`; // フォーマット
    return formattedDay;
    }
    // 無ければ処理はしない
    return number;
  })

  // 今日の日付のデータを取得
  let today = new Date();
  let judgmentDate = today.getFullYear() * 10000 +
                     (today.getMonth() + 1) * 100 +
                      today.getDate()

  const [colorNumArray, setColorNumArray] = useState<number[]>([]); // 初期値を空の配列に設定

  // 期限によって日付に色をつける関数
  const colorLabel = useCallback(() => {
  // col2(期限)をString型からNumber型へ変換
  const col2Num = updatedData.col2.map((data) => Number(data));

  const updatedArray = [];

  for (let i = 0; i < col2Num.length; i++) {
    // 今日の日付よりもcol2の方が前だったら（期限が過ぎていたら）
    if (judgmentDate > col2Num[i]) {
      updatedArray.push(1);
    } else if (judgmentDate === col2Num[i]) {
      updatedArray.push(2);
    } else {
      // 期限が過ぎていなければ
      updatedArray.push(0);
    }
  }
  setColorNumArray(updatedArray); // ループの外で一度だけセット
}, [judgmentDate,updatedData.col2,setColorNumArray]);

  // カラーラベルを描画する関数を最初に実行
  useEffect(() => {
    colorLabel();
  }, [colorLabel]);

  // 完了リストの戻すボタンを押下された時に発動する処理
  const [completedIndex,setCompletedIndex] = useState<number>(-1);

  // 完了リストから戻す処理
  if (completedIndex !== -1) {
    // Dataの型をセットする
    type Data = {
      col1: string[];
      col2: number[];
      col3: number[];
      col4: string[][];
    };

    // 戻ってきた値を格納する変数
    let returnUpDatedData: { col1: string[], col2: number[], col3: number[],col4: string[][] } = {
      col1: [],
      col2: [],
      col3: [],
      col4: []
    };

    // 既存の完了リストのデータをロード
    storage.load<Data>({
      key: 'completed'
    }).then((data: Data) => {

      // すでにAddTask配列がある場合は配列の最後に追加する
      if (updatedData) {
        returnUpDatedData = {
          col1: [...updatedData.col1, data.col1[completedIndex]],
          col2: [...updatedData.col2, data.col2[completedIndex]],
          col3: [...updatedData.col3, data.col3[completedIndex]],
          col4: [...updatedData.col4, data.col4[completedIndex]]
        };

      // 無ければ戻ってきたデータをAddTaskに入れる
      }else{
        returnUpDatedData = {
          col1: [data.col1[completedIndex]],
          col2: [data.col2[completedIndex]],
          col3: [data.col3[completedIndex]],
          col4: [data.col4[completedIndex]]
        };
      }

      // 戻すボタンを押下した際のindex番目のデータを削除する
        data.col1.splice(completedIndex,1);
        data.col2.splice(completedIndex,1);
        data.col3.splice(completedIndex,1);
        data.col4.splice(completedIndex,1);

      // 変更後のストレージデータの配列を保存する処理
        storage.save({
          key:'completed',
          // ここで削除後のデータを入れ込む
          data:data
        }).then((data) => {
          // AddTaskの配列のデータを書き換える
          storage.save({
            key: 'keyWord',
            data:returnUpDatedData
          })
          // ページをリロードする
          window.location.reload();
        }).catch((err) => {
        console.log(err);
        });

    }).catch((err) => {
      console.log(err);
    });
  }
  const [labelType,setLabelType] = useState<string>('');
  const [labelTypeArray,setLabelTypeArray] = useState<string[]>([]);

  // ラベルのテキストをセットする関数（チェックボックスのvalueの値を取得) TODO:
  const handleSetLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedLabel = event.target.value;

    setLabelType(selectedLabel);

    setLabelTypeArray((prevLabelTypeArray) => {
      if (prevLabelTypeArray.includes(selectedLabel)) {
        // すでに含まれている場合は削除
        return prevLabelTypeArray.filter((label) => label !== selectedLabel);
      } else {
        // 含まれていない場合は追加
        return [...prevLabelTypeArray, selectedLabel];
      }
    });

  };

  // ラベルを削除する関数
  const deleteLabel = ((number:number,index:number) => {
    updatedData.col4[index].splice(number,1);

    storage.save({
      key: 'keyWord',
      data:updatedData
    }).then((data) => {
      setUpdatedData({ col1: [],col2: [], col3: [], col4:[] });
      console.log(' : ' + data);
    }).catch((err) => {
      console.log(err);
    });
  })

  const [showModal, setShowModal] = React.useState(false);
  const [hiddenLabelArray,setHiddenLabelArray] = useState<string[]>([]); // 非表示にするラベルデータを格納するuseState

  // ラベルのデータの確認 TODO:
  const hiddenLabelData = ((index:number) => {
    setHiddenLabelArray(updatedData.col4[index]);
    console.log('hiddenLabels : ' + JSON.stringify(hiddenLabelArray));
  });

   // 追加されたラベルを削除するボタン
   const removeLabelArray = ((index:number) => {
    // 要素を削除して新しい配列を作成（指定されたインデックス以外を新しい配列で作成）
      const newCheckedValues = labelTypeArray.filter((value, i) => i !== index);
    // 新しい配列をステートに設定
      setLabelTypeArray(newCheckedValues);
    });

  return(
    <div className=''>
      <div className='my-10'>
      {updatedData.col1.map((data,index) => (

        <div key={`col1${index}`}>

            <div key={`col2${index}`} className="border-b border-black my-4 flex justify-between">

              <div className='flex justify-center items-center w-3/5'>
                <label className="inline-flex cursor-pointer">
                <button>
                <img className='w-12 h-12' onClick= {() => checkTask(index) }src='/heart.png' alt='' />
                </button>
                </label>
                <Linkify>
                <input
                className='w-full'
                  // className='bg-white'
                  // className={`bg-gray-200 ${indexNumber !== index ? '' : 'bg-white'}`}
                  id={`input_${index}`}
                  type='text'
                  value={indexNumber !== index ? data : task }
                  onChange={handleNewTask}
                  // disabled={indexNumber !== index}
                />
                </Linkify>
              </div>

              <div className='text-center my-auto flex'>

                <div className='mx-2'>
                  <p className='text-xs'>追加日</p>
                  <p>{middleDateArray[index]}</p>
                </div>
                <div className='mx-2'>
                  <p className='text-xs'>期限</p>
                  {indexNumber === index ?
                    <input type='date'
                      onChange={editDate}
                      defaultValue={calendarInitialValue(index)}
                      className='bg-blue-200 focus:bg-red-200'>
                    </input> :
                    <p className=
                    {colorNumArray[index] === 1 ? 'bg-red-200' : colorNumArray[index] === 2 ? 'bg-yellow-200' : ''}
                    >{timeLimitArray[index]}</p>}
                </div>
                <button
                  onClick={() => removeText(index)} className='mx-1'
                  hidden={indexNumber === index}>削除</button>
                <button className='mx-1'
                  onClick={() => {
                  setIndexNumber(index);
                  indexNumber === index ? upDateData(index) : handleEditClick(data, index);
                  }}
                >{indexNumber === index ? '更新' : '編集'}</button>
                <button
                  className='mx-1'
                  hidden={indexNumber !== index}
                  onClick={() => {setIndexNumber(-1)}}>
                x</button>
              </div>

            </div>

          <div className="flex" key={`category${index}`}>
            {updatedData.col4[index].map((data,number) => (
              <div key={`labelEdit${number}`}>
                <p key={`label${number}`}className="text-xs font-semibold inline-block py-1 px-2 mx-2 uppercase rounded text-purple-600 bg-purple-200 uppercase last:mr-0 mr-1">
                  {data}
                </p>
                {indexNumber === index ? (
                <IconButton aria-label="delete" size="small" onClick={() => deleteLabel(number,index)}>
                <DeleteIcon fontSize="small" />
                </IconButton>
                ) : null}
              </div>
            ))}
            {indexNumber === index ? (
              <button className="mx-2" onClick={() => setShowModal(true)}>
                <AddCircleOutlineIcon
                  className='text-pink-600'
                  onClick={() => hiddenLabelData(index)}
                />
              </button>
            ) : null}
          </div>

          {indexNumber === index ? (
            <div className="flex">
            {labelTypeArray.map((data,index) => (
              <div
                key={index}
              >
              <Stack direction="row" spacing={1} className="mx-1"
              >
                <Chip
                color="secondary"
                label={data}
                variant="outlined"
                size="small"
                onDelete={() => removeLabelArray(index)} />
              </Stack>
              </div>
            ))}
            </div>
          ) : null}

            <LabelList
              handleSetLabel={handleSetLabel}
              labelType={labelType}
              showModal={showModal}
              setShowModal={setShowModal}
              hiddenLabelArray={hiddenLabelArray}
              labelTypeArray={labelTypeArray}
            />
          </div>

    ))}

</div>


<button onClick={()=>clickSort(0)}>昇順に並び替える</button>
<button onClick={()=>clickSort(1)}>降順に並び替える</button>
<button>戻す</button>

      <div>
        <CompletedList
          checkedTaskArray={checkedTaskArray}
          checkedNum={checkedNum}
          completedIndex={completedIndex}
          setCompletedIndex={setCompletedIndex}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className='bg-red-100 p-8'>
    <div className='flex justify-center bg-white h-screen'>
      <div className='font-mono w-4/5'>
        <header className="">
        <Todo />
        </header>
        <main>
          <AddTask />
          <AddText />
        </main>
        <footer>
        </footer>
      </div>
    </div>
    </div>
  );
}


export default App;
