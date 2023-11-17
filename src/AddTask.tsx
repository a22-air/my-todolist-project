import React, { useEffect } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState} from 'react';
import { LabelList } from "./LabelList";

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import { LabelPage } from "./LabelPage";
import LabelIcon from '@mui/icons-material/Label';
// labelColorsをインポートする
import labelColors from './labelColors.json'; // JSONファイルのパスを指定
import ModalPortal from "./MordalPortal";

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
  //     col4:[],
  //     col5:[]
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


// 親プロップスから受け取る処理
type AddTaskProps = {
    openLabelPage:boolean;
    setOpenLabelPage:React.Dispatch<React.SetStateAction<boolean>>;

  };

export function AddTask({ openLabelPage,setOpenLabelPage}: AddTaskProps){

    const [task, setTask] = useState<string>(''); // col1のAddTaskの監視ステート
    const [taskData,setTaskData] = useState<string>(''); // col2の期限の監視ステート
    const [warningStatement,setWarningStatement] = useState<boolean>(true); // AddTaskがからだった時にNEWのボタンが押下できないように監視するステート
    const [selectLabelColor,setSelectLabelColor] = useState<string>("purple-200"); // 選択されているラベルカラーのステート
    const [selectLabelColorArray,setSelectLabelColorArray] = useState<string[]>([]); // 選択されたカラーを配列にして格納するステート

  // テキストをセットする関数
  const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
    console.log(event.target.value)
  }

  //日付のテキストをセットする関数
  const handleNewData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = event.target.value.replace(/-/g, ''); // '-' を削除
    setTaskData(sanitizedValue);
  }

  const [labelType,setLabelType] = useState<string>('');
  const [labelTypeArray,setLabelTypeArray] = useState<string[]>([]);

  // ラベルのテキストをセットする関数（チェックボックスのvalueの値を取得)
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

    console.log('selectLabelColorArray : ' + selectLabelColorArray);

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

        let updatedData: {
          col1: string[],
          col2: string[],
          col3: number[],
          col4: string[][],
          col5: string[][],

            } = {
          col1: [],
          col2: [],
          col3: [],
          col4: [],
          col5: [],
        };


        // 既存のデータがあれば、それを取得し新しいデータを追加
        if (existingData) {
          updatedData = {
            ...existingData,
            col1: [...existingData.col1, task],
            col2: [...existingData.col2,taskData],
            col3: [...existingData.col3,formattedDate],
            col4: [...existingData.col4,labelTypeArray],
            col5: [...existingData.col5,selectLabelColorArray]
          };
        } else {
          // 既存のデータがない場合、新しいデータを作成
          updatedData = {
            col1: [task],
            col2: [taskData],
            col3: [formattedDate],
            col4: [[labelType]],
            col5: [[selectLabelColor]],
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

    const [showModal, setShowModal] = React.useState(false); // モーダルウインドウを監視するステート
    const [hiddenLabelArray,setHiddenLabelArray] = useState<string[]>([]); // 非表示にするラベルデータを格納するuseState
    const [openLabelColor,setOpenLabelColor] = useState<boolean>(false);

  // 追加されたラベルを削除するボタン
    const removeLabelArray = ((index:number) => {
      setLabelColorIndex(-1);
  // 要素を削除して新しい配列を作成（指定されたインデックス以外を新しい配列で作成）
    const newCheckedValues = labelTypeArray.filter((value, i) => i !== index);
    selectLabelColorArray.splice(index,1);
  // 新しい配列をステートに設定
    setLabelTypeArray(newCheckedValues);
    setSelectLabelColorArray(selectLabelColorArray);
    console.log('selectLabelColorArray : ' + selectLabelColorArray);

  });

  const [selectLabelColorIndex,setSelectLabelColorIndex] = useState<number>(-1); // ラベル横のカラーラベルのインデックスを監視するステート
  // ラベル横のカラーボタンを押下時のハンドラ
  const openLabelHandle = ((index:number) => {
    setSelectLabelColorIndex(index); // ラベル横のカラーラベルのインデックスをセットする関数
    setLabelColorIndex(-1); // 9色のカラーラベルのインデックスを−１にリセットする関数
    setSelectLabelColor(selectLabelColorArray[index]); // ラベル横のカラーラベルのカラーをセットする関数
  })

  // 9色のラベルカラーを押下した時のハンドラ
  const [labelColorIndex,setLabelColorIndex] = useState<number>(-1); // ９色のカラーラベルのインデックス番号を監視するステート

  const selectLabelColorHandle = ((color:string,colorIndex:number) => {
    setLabelColorIndex(colorIndex); // ９色のラベルカラーのインデックス
    setSelectLabelColor(color); // ラベル横のラベルカラーの文字列
  })

  // selectLabelColorArrayがすぐに描画されるようにuseEffectを使用する
  useEffect(() => {
    if (selectLabelColorIndex !== -1 && selectLabelColor !== '' && labelColorIndex !== -1) {
      selectLabelColorArray[selectLabelColorIndex] = selectLabelColor;
      setSelectLabelColorArray(selectLabelColorArray);
    }
  }, [selectLabelColor, selectLabelColorIndex, selectLabelColorArray,labelColorIndex]);

    return(
      <div className="flex justify-between my-10">

        <div className="w-full">

        {openLabelPage ?
          <LabelPage
            openLabelPage={openLabelPage}
            setOpenLabelPage={setOpenLabelPage} />:
          (
            <div className="animate__animated animate__fadeIn">
            <div className="my-5 text-2xl">
              ADD TASK :
              <input
              placeholder={ warningStatement ? 'Add New Task' : 'Please enter'}
              onChange={handleNewTask}
              value={task}
              className={`ml-2  w-2/3 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring ${warningStatement ? "" : "placeholder-red-500"}`}
              />
            </div>
            <div className="my-5 text-2xl">
              TIME LIMIT :
              <input
                onChange={handleNewData}
                placeholder='Time Limit'
                type="date"
                className="cursor-pointer opacity-60 hover:opacity-100"
                >
              </input>
            </div>

          <div className="flex justify-between" style={{ alignItems: "center" }}>
            <div className="flex">
              <div>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    onClick={() => {setShowModal(true)}}
                    >Label
                  </Button>

                </Stack>
                </div>

                {/* 追加されたラベルの表示 */}
                <div className="flex ml-2"style={{ alignItems: "center" }}>
                  {labelTypeArray.map((data,index) => (
                    <div key={index}>
                      <Stack direction="row" spacing={1} className="mx-1">
                        <Chip
                        label={data}
                        size="small"
                        onDelete={() => removeLabelArray(index)} />
                      </Stack>
                      {/* ラベル横のカラーチップ表示 */}
                      {/* モーダルが開いている時はチップを非表示にする */}
                      {!showModal ?
                      (<Button
                        variant="text"
                        onClick={() => openLabelHandle(index)}
                        size="small"
                        >
                          {index === selectLabelColorIndex ?
                            <LabelIcon className={`text-${selectLabelColor ? selectLabelColor : ''}`}/> :
                            <LabelIcon className={`text-${selectLabelColorArray[index]}`} />
                          }
                      </Button>) : null}

                    </div>
                  ))}
                </div>
              </div>

            </div>

          <div className="flex">

            <div className="my-3"
            >
              <Stack spacing={2} direction="row">
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => setOpenLabelColor(!openLabelColor)}
                >
                label color
                </Button>
              </Stack>
            </div>

            {/* ９色のラベルカラー表示 */}
            {labelColors.map((colors,colorIndex) => (
              openLabelColor ? (
                <button
                  key={`labelColors${colorIndex}`}
                  onClick={() => selectLabelColorHandle(colors,colorIndex)}
                  className="mx-3 hover:opacity-70"
                >
                  <LabelIcon className={`text-${colors}`} />
                </button>
              ) : null
            ))}

          </div>
          <ModalPortal>
              <LabelList
                handleSetLabel={handleSetLabel}
                labelType={labelType}
                showModal={showModal}
                setShowModal={setShowModal}
                hiddenLabelArray={hiddenLabelArray}
                labelTypeArray={labelTypeArray}
                selectLabelColor={selectLabelColor}
                setSelectLabelColor={setSelectLabelColor}
                selectLabelColorArray={selectLabelColorArray}
                setSelectLabelColorArray={setSelectLabelColorArray}
              />
          </ModalPortal>
              </div>
              )
            }
          <div className="flex justify-end">
              <Stack spacing={2} direction="row">
                <Button
                  onClick={handleClick}
                  variant="contained"
                  style={{ color: 'white', backgroundColor: '#C299FF' }}>
                  new
                  <PanToolAltIcon />
                </Button>
              </Stack>
            </div>
        </div>

      </div>

    )
  }
