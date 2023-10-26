import React, { useEffect } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';
import { LabelList } from "./LabelList";

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { log } from "console";

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
  //     col3:[],
  //     col4:[]
  //   }
  // });

  // keyの中身を調べる方法↓ -----------------------------------
  // const keyName = 'labelData'; // 取得したいキー名
  // const storedValue = localStorage.getItem(keyName);

  // if (storedValue !== null) {
  //   console.log(`キー ${keyName} の値は ${storedValue} です。`);
  // } else {
  //   console.log(`キー ${keyName} は存在しません。`);
  // }
//　---------------------------------------------------------

// 今日の日付を作成する処理
  let today = new Date();
  let formattedDate = today.getFullYear() * 100000000 +
                     (today.getMonth() + 1) * 1000000 +
                     today.getDate() * 10000 +
                     today.getHours() * 100 +
                     today.getMinutes() * 1;

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

    // setLabelTypeArray((prevLabelTypeArray) => [...prevLabelTypeArray, selectedLabel]);

  };

    // 追加ボタンでデータの追加をする関数
    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {

      // テキストが空だったら以下の処理は行わない
      if (task === ''){
      setWarningStatement(false);
      return;
      }

      try {
        // 既存のデータを読み込む
        const existingData = await storage.load({
          key: 'keyWord',
        });
        console.log('existingData:', existingData);

        // let updatedData: { col1: string[],col2: string[],col3:number[] } = { col1: [],col2: [],col3: [] };
        let updatedData: {
          col1: string[],
          col2: string[],
          col3: number[],
          col4: string[][]
            } = {
          col1: [],
          col2: [],
          col3: [],
          col4: []
        };

        console.log('labelTypeは : ' + labelType);


        // 既存のデータがあれば、それを取得し新しいデータを追加
        if (existingData) {
          updatedData = {
            ...existingData,
            col1: [...existingData.col1, task],
            col2: [...existingData.col2,taskData],
            col3: [...existingData.col3,day],
            col4: [...existingData.col4,labelTypeArray]
          };
        } else {
          // 既存のデータがない場合、新しいデータを作成
          updatedData = {
            col1: [task],
            col2: [taskData],
            col3: [day],
            col4: [[labelType]],
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

    const [showModal, setShowModal] = React.useState(false);
    const [hiddenLabelArray,setHiddenLabelArray] = useState<string[]>([]); // 非表示にするラベルデータを格納するuseState

    const [checkedValues, setCheckedValues] = useState<string[]>([]);//TODO:ここからスタート


    // 追加ボタン押下で追加ラベルの表示をする関数 TODO:再作成
    const labelDisplayArray = (() => {
      console.log('labelTypeArray : ' + JSON.stringify(labelTypeArray));


    })



    //追加ボタン押下で追加ラベルの表示をする関数
  //     const labelDisplayArray = (() => {
  //       console.log('labelTypeArray : ' + JSON.stringify(labelTypeArray));
  //       console.log('checkedValues : ' + JSON.stringify(checkedValues));

  //   // 追加　TODO:

  //   // 偶数個の要素を検出
  //     let counts : { [item: string]: number } = {};
  //     labelTypeArray.forEach((item) => {
  //       counts[item] = (counts[item] || 0) + 1;
  //     });
  //     console.log('counts : ' + JSON.stringify(counts));


  //   // 削除対象の要素を特定
  //     const elementsToDelete : string[] = [];
  //     for (const key in counts) {
  //       if (counts[key] % 2 === 0) {
  //         elementsToDelete.push(key);
  //       }
  //     };
  //     console.log('elementsToDelete : ' + JSON.stringify(elementsToDelete));

  //     // 削除対象の要素を配列から削除
  //     const newArray = labelTypeArray.filter((item) => !elementsToDelete.includes(item));
  //     console.log('newArray : ' + JSON.stringify(newArray));

  //   // // 配列の中の同じデータを取り除く処理
  //   //   const set = new Set(labelTypeArray);FIXME:ここが初期の関数の中身
  //   //   const newArr = [...set];FIXME:ここが初期の関数の中身
  //   //   console.log('newArr : ' + newArr);FIXME:ここが初期の関数の中身
  //     // setCheckedValues(newArray);//FIXME:ここが初期の関数の中身
  //     console.log('counts2 : ' + JSON.stringify(counts));

  // })

  // 追加されたラベルを削除するボタン
    const removeLabelArray = ((index:number) => {
  // 要素を削除して新しい配列を作成（指定されたインデックス以外を新しい配列で作成）
    const newCheckedValues = checkedValues.filter((value, i) => i !== index);
  // 新しい配列をステートに設定
    setCheckedValues(newCheckedValues);
  });


    return(
      <div className="flex justify-between my-10">
          <div className="w-full">
            <div className="">
              Add Task :
              <input
              placeholder={ warningStatement ? 'Add New Task' : 'Please enter'}
              onChange={handleNewTask}
              value={task}
              className={`w-2/3 ${warningStatement ? "" : "placeholder-red-500"}`}
              />
            </div>
            <div>
              Time Limit :
              <input
                onChange={handleNewData}
                placeholder='Time Limit'
                type="date"
                className="cursor-pointer opacity-60 hover:opacity-100"
                >
              </input>
            </div>

            <button
              className=""
              type="button"
              onClick={() => {setShowModal(true)}}
            >
            ラベル
            </button>

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

            <LabelList
              handleSetLabel={handleSetLabel}
              labelType={labelType}
              showModal={showModal}
              setShowModal={setShowModal}
              hiddenLabelArray={hiddenLabelArray}
              labelTypeArray={labelTypeArray}
              labelDisplayArray={labelDisplayArray}
            />

          </div>

          <div className="">
            <label className="inline-flex cursor-pointer hover:opacity-60">
              <div>new</div>
              <div>
                <button onClick={handleClick} className="">
                  <img src='/gesture02.png' alt='チェック' className='w-12 h-12' />
                </button>
              </div>
            </label>
          </div>


      </div>
    )
  }
