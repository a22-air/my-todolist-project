import React from 'react';
import {useState,useEffect,useCallback,createContext} from 'react';
import ReactDOM from 'react-dom';
// ストレージのインポート
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
// リンク検出機能
import Linkify from 'linkify-react';
// ファイルのインポート
import { AddTask } from './AddTask';
import { CompletedList } from './CompletedList';
import { LabelList } from "./LabelList";
// material UI のインポート
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton'; //ボタンアイコン
import DeleteIcon from '@mui/icons-material/Delete'; // ゴミ箱アイコン
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // +アイコン
import Chip from '@mui/material/Chip'; // チップ
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // ハート
import CancelIcon from '@mui/icons-material/Cancel'; //←アイコン
import Button from '@mui/material/Button'; // ボタン
import Check from '@mui/icons-material/Check'; //チェック
// labelColorsをインポートする
import labelColors from './labelColors.json'; // JSONファイルのパスを指定
import LabelIcon from '@mui/icons-material/Label';
import { log } from 'console';
import ModalPortal from './MordalPortal';


// コンテキストで送るデータ
export const MyContext = createContext<{
  updatedData: {
    col1: string[];
    col2: number[];
    col3: number[];
    col4: string[][];
  };
  selectLabel: number;
  selectData: string;
}>({
  updatedData: {
    col1: [],
    col2: [],
    col3: [],
    col4: [],
  },
  selectLabel: -1,
  selectData:'',
});

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
  //   key: 'keyWord',
  //   data:{
  //     col1:[],
  //     col2:[],
  //     col3:[],
  //     col4:[],
  //     col5:[]
  //   },
  // }).then((data) => {
  //   console.log(' : ' + JSON.stringify(data));
  // }).catch((err) => {
  //   console.log(err);
  // });

  // keyの中身を調べる方法↓ -----------------------------------
  // const keyName = 'initialLabelColorArray'; // 取得したいキー名
  // const storedValue = localStorage.getItem(keyName);

  // if (storedValue !== null) {
  //   console.log(`キー ${keyName} の値は ${storedValue} です。`);
  // } else {
  //   console.log(`キー ${keyName} は存在しません。`);
  // }
// 　-----------------------------------------------------

//ストレージデータを削除する時 --------------------------------
  // storage.remove({
  //   key: 'initialLabelColorArray'
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

  // function Test(){

  //   return ReactDOM.createPortal(
  //     <h1>Hello Portals</h1>,
  //     document.getElementById('portal')
  //   );
  // }

// 親プロップスから受け取る処理
type AddTextProps = {
    openLabelPage:boolean;  // ラベルの表示と非表示の監視
    setOpenLabelPage:React.Dispatch<React.SetStateAction<boolean>>; // ラベルの表示と非表示を制御するための関数
    updatedData:{ col1: string[],col2:number[],col3: number[],col4: string[][], col5: string[][] };
    setUpdatedData:React.Dispatch<React.SetStateAction<{
      col1: string[];
      col2: number[];
      col3: number[];
      col4: string[][];
      col5: string[][];
  }>>
    selectLabel:number; // 選択したラベルの監視
    setSelectLabel:React.Dispatch<React.SetStateAction<number>>; // 選択したラベルを設定するための関数
    selectData:string; // 選択したラベルのデータ
    setSelectData:React.Dispatch<React.SetStateAction<string>>; // 選択したラベルのデータを設定するための関数
  };

// AddTextコンポーネント　=================================================================
// 追加されたデータを画面に表示するコンポーネント
function AddText({openLabelPage,setOpenLabelPage,updatedData,setUpdatedData,selectLabel,setSelectLabel,selectData,setSelectData}:AddTextProps){

  const [indexNumber, setIndexNumber] = useState<number>(-1); // 選択されたインデックスを表示するために使用する番号
  const [task, setTask] = useState<string>(''); // Add Taskで追加されたデータ
  const [taskDate,setTaskDate] = useState<string>(''); // 編集後の日付を操作するuseState
  const [selectLabelColor,setSelectLabelColor] = useState<string>(''); // 選択されているラベルカラーのステート
  const [selectLabelColorArray,setSelectLabelColorArray] = useState<string[]>([]); // 選択されたカラーを配列にして格納するステート


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
      data.col5.splice(indexToRemove,1);

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
    // initialCol5には最初のラベルカラーの配列を入れて戻す処理
    setInitialCol5(updatedData.col5);
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
  }

// テキストボックスにテキストをセットする関数
  const handleNewTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTask(event.target.value);
  }

// 更新ボタン押下でデータの更新を行う関数 TODO:
  const upDateData = ((index : number) => {

// col4の配列の中身と選択されたラベルを同じ配列に追加する
  const editLabelData = updatedData.col4[index].concat(labelTypeArray);
// initialCol5に追加されたラベルを入れ込んで新しい配列を作成
  const newLabelColorArray = initialCol5[index].concat(selectLabelColorArray);

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
    data.col5[index] = newLabelColorArray;

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
  const [checkedNum,setCheckedNum] = useState<number>(0); // 選択されたインデックスを管理するステート
  // チェックされたTaskを配列にするステート
  const [checkedTaskArray, setCheckedTaskArray] = useState<{ col1: string, col2: number, col3: number,col4:string[],col5:string[] }>({
    col1: '',
    col2: 0,
    col3: 0,
    col4:[],
    col5:[],
  });

  const checkTask = ((index : number) => {
    setCheckedTaskArray({col1:updatedData.col1[index],col2:updatedData.col2[index],col3:updatedData.col3[index],col4:updatedData.col4[index],col5:updatedData.col5[index]});
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
      data.col5.splice(index,1)

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
      updatedData.col5 = sortedIndexes.map((index)=> updatedData.col5[index]);

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
  const col2Num = updatedData.col2.map((data) => data ? Number(data) : 0); // 空の場合は 0 に変換

  const updatedArray = [];

  for (let i = 0; i < col2Num.length; i++) {
    if (col2Num[i] === 0) {
      // col2Num が 0 なら、期限が設定されていない場合として 0 として処理
      updatedArray.push(0);
    } else if (judgmentDate > col2Num[i]) {
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
      col5: string[][];
    };

    // 戻ってきた値を格納する変数
    let returnUpDatedData: { col1: string[], col2: number[], col3: number[],col4: string[][], col5: string[][] } = {
      col1: [],
      col2: [],
      col3: [],
      col4: [],
      col5: []
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
          col4: [...updatedData.col4, data.col4[completedIndex]],
          col5: [...updatedData.col5, data.col5[completedIndex]]
        };

      // 無ければ戻ってきたデータをAddTaskに入れる
      }else{
        returnUpDatedData = {
          col1: [data.col1[completedIndex]],
          col2: [data.col2[completedIndex]],
          col3: [data.col3[completedIndex]],
          col4: [data.col4[completedIndex]],
          col5: [data.col5[completedIndex]]
        };
      }

      // 戻すボタンを押下した際のindex番目のデータを削除する
        data.col1.splice(completedIndex,1);
        data.col2.splice(completedIndex,1);
        data.col3.splice(completedIndex,1);
        data.col4.splice(completedIndex,1);
        data.col5.splice(completedIndex,1);

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
  const [labelType,setLabelType] = useState<string>(''); // ラベルを管理するステート
  const [labelTypeArray,setLabelTypeArray] = useState<string[]>([]); // ラベルを配列にするステート

  // ラベルのテキストをセットする関数（チェックボックスのvalueの値を取得)
  const handleSetLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedLabel = event.target.value;

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
    updatedData.col4[index].splice(number,1); // 選択されたインデックス番号を削除
    updatedData.col5[index].splice(number,1); // 選択されたインデックス番号を削除

    storage.save({
      key: 'keyWord',
      data:updatedData
    }).then((data) => {
      setUpdatedData({ col1: [],col2: [], col3: [], col4:[], col5:[] });
      console.log(' : ' + data);
    }).catch((err) => {
      console.log(err);
    });
  })

  const [showModal, setShowModal] = React.useState(false); // モーダルウインドウを監視するステート
  const [hiddenLabelArray,setHiddenLabelArray] = useState<string[]>([]); // 非表示にするラベルデータを格納するステート

  // ラベルのデータの確認
  const hiddenLabelData = ((index:number) => {
    setHiddenLabelArray(updatedData.col4[index]);
  });

   // 追加されたラベルを削除するボタン
   const removeLabelArray = ((index:number) => {
    // 要素を削除して新しい配列を作成（指定されたインデックス以外を新しい配列で作成）
      const newCheckedValues = labelTypeArray.filter((value, i) => i !== index);
    // 新しい配列をステートに設定
      setLabelTypeArray(newCheckedValues);
    });

  // ラベルのカラーの設定
    const chipStylePassed = {
      backgroundColor: '#FFB6C1', // カラーを指定
    };
    const chipStyleToday = {
      backgroundColor: '#FFFF99', // カラーを指定
    };
    const chipStyleNormal = {
      backgroundColor: '#FFF', // カラーを指定
    };

    // ラベルのページを表示する関数
    const handleOpenLabelPage = ((data:string,index:number) => {
      if(!openLabelPage)
      setOpenLabelPage(true);
      setSelectLabel(index);
      setSelectData(data);
    })

    // ラベルの色を編集する関数
    const [editLabelColorNumber,setEditLabelColorNumber] = useState<number>(-1); // 編集モードでラベルのカラーを変更する時に使用するステート
    // ラベルのボタンを押下した時に発火する関数
      const changeLabelColorHandle = ((data:string,index:number,number:number) => {
    // data = ラベルの名前 index = col5.[index] number = ラベルの中のindex
      setEditLabelColorNumber(number); // 選択されているラベルのインデックス
    })

    const [initialCol5, setInitialCol5] = useState<string[][]>([]); // initialLabelColorArrayをセット

    // 9色のラベル
    const changeLabelColor = ((color:string,index:number,number:number) => {
    // 新しい配列を作成して、指定された要素を変更
      const newInitialCol5 = initialCol5.map((row, i) => // row = initialLabelData[][] i = index
        i === index // 選択されたインデックスのinitialLabelData
          ? row.map((item, j) => (j === editLabelColorNumber ? color : item)) // さらにmapで配列の中をitemに入れる　jとeditLabelNumberが等しい時はcolorに変更する
          : row // 選択されていないinitialLabelDataはそのままの配列で返す
      );
    // 新しい配列を設定
      setInitialCol5(newInitialCol5);
    })

  return(
    <div className=''>
      <div className='my-10'>
      {updatedData.col1.map((data,index) => (

        <div key={`col1${index}`}>

            <div key={`col2${index}`} className="border-b border-black my-4 flex justify-between">

              {/* inputエリア */}
              <div className={`flex justify-center items-center w-3/5 ${index === indexNumber && 'animate__animated animate__fadeIn'}`}>

                <button
                  onClick= {() => checkTask(index) }
                  className=" p-3 relative group hover:bg-slate-200 rounded-full ">
                  <FavoriteBorderIcon />
                <span
                  className="opacity-0 w-[74px] invisible rounded text-[12px] font-bold  py-1  bottom-3 -left-3 group-hover:visible opacity-100 absolute text-red-600">
                <Check />
                </span>
              </button>

                <Linkify>
                <input
                  className='w-full'
                  id={`input_${index}`}
                  type='text'
                  value={indexNumber !== index ? data : task }
                  onChange={handleNewTask}
                />
                </Linkify>
              </div>

              <div className='text-center my-auto flex'>

                <div className='mx-2'>
                  <p className='text-xs'>追加日</p>
                  <p>{middleDateArray[index]}</p>
                </div>
                <div className={`mx-2 ${index === indexNumber && 'animate__animated animate__fadeIn'}`}>
                  <p className='text-xs'>期限</p>
                  {indexNumber === index ?
                    <input type='date'
                      onChange={editDate}
                      defaultValue={calendarInitialValue(index)}
                      className='px-2 py-2 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm border-2 shadow outline-none focus:outline-none focus:ring'
                    >

                    </input> :

                    <Stack
                      direction="row"
                      spacing={1}
                      className='mb-1'
                    >
                      <Chip
                        label={timeLimitArray[index]}
                        style={{
                          fontSize: '16px', // ラベルの文字の大きさを設定
                          ...(
                            colorNumArray[index] === 1 ? chipStylePassed : // 期限が過ぎている色の変更
                            colorNumArray[index] === 2 ? chipStyleToday : // 期限が当日の色の変更
                            chipStyleNormal
                          )
                        }}
                      />
                    </Stack>}

                </div>

                {/* 更新と編集ボタン */}
                <Stack spacing={2} direction="row">
                  <Button
                    variant="contained"
                    style={{'backgroundColor':'#BBBBBB'}}
                    size='small'
                    onClick={() => {
                      setIndexNumber(index);
                      indexNumber === index ? upDateData(index) : handleEditClick(data, index);
                    }}
                    >{indexNumber === index ? '更新' : '編集'}
                  </Button>
                </Stack>

                  <button
                    onClick={() => removeText(index)}
                    className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 mx-1 animate__animated animate__fadeIn '
                    hidden={indexNumber === index}>
                    <DeleteIcon
                      color='error'
                      />
                  </button>
                  {/* x ボタン */}
                  <button
                    className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 mx-1 animate__animated animate__fadeIn'
                    hidden={indexNumber !== index}
                    onClick={() => {setIndexNumber(-1);
                                    setEditLabelColorNumber(-1);
                                    setSelectLabelColor('');
                                    setInitialCol5(updatedData.col5); // initialCol5には最初のラベルカラーの配列を入れて戻す処理
                                    }}>
                    <CancelIcon />
                  </button>

              </div>

            </div>

          <div className={`flex ${index === indexNumber && 'animate__animated animate__fadeIn'}`} key={`category${index}`}>
          {/* ラベル表示 */}
            {updatedData.col4[index].map((data,number) => (
              <div key={`labelEdit${number}`}>

                {index !== indexNumber ?

                (<button
                key={`label${number}`}
                className={`text-xs font-semibold inline-block py-1 px-2 mx-2 uppercase rounded text-white bg-${updatedData.col5[index][number]} uppercase last:mr-0 mr-1 hover:bg-opacity-50`}
                onClick={() => handleOpenLabelPage(data,index)}
                >
                  {data}
                </button>) :

                (<button
                key={`editLabel${number}`}
                className={`text-xs font-semibold inline-block py-1 px-2 mx-2 uppercase rounded text-white bg-${initialCol5[index][number]} uppercase last:mr-0 mr-1 hover:bg-opacity-50`}
                onClick={() => changeLabelColorHandle(data,index,number)}
                >
                  {data}aa
                </button>)}
                {indexNumber === index ? (
                  <IconButton
                  aria-label="delete" size="small" onClick={() => deleteLabel(number,index)}
                  className='transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'
                  >
                  <DeleteIcon
                    fontSize="small" />
                  </IconButton>
                ) : null}
              </div>
            ))}
            {indexNumber === index ? (
              <div>

                <button className="mx-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:duration-300" onClick={() => setShowModal(true)}>
                  <AddCircleOutlineIcon
                    className='text-pink-600'
                    onClick={() => hiddenLabelData(index)}
                  />
                </button>

              </div>
            ) : null}
          </div>

          {indexNumber === index ? (
            <div className="flex my-3">
            {labelTypeArray.map((data,index) => (
              <div
                key={index}
                className='mx-3'
              >
              <Stack direction="row" spacing={1}
              >
                <Chip
                // color="secondary"
                // className='text-purple-500'
                style={{backgroundColor:'#E9D8FD'}}
                label={data}
                // variant="outlined"
                size="small"
                onDelete={() => removeLabelArray(index)} />
              </Stack>
              </div>
            ))}
            </div>
          ) : null}

           {/* ９色のラベルカラーの表示 */}
           <div className={`${index === indexNumber && 'animate__animated animate__fadeIn'}`}>
           {index === indexNumber ? (labelColors.map((colors,colorIndex) => (
                <button
                  key={`labelColors${colorIndex}`}
                  className="mx-3 hover:opacity-70"
                >
                  <LabelIcon
                    className={`text-${colors}`}
                    onClick={() => changeLabelColor(colors,index,colorIndex)}
                    />
                </button>
           ))) : null}
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

    ))}

</div>
{/* 並び替え機能の表示部分 */}
<div className='flex pb-5'>
    <Stack spacing={2} direction="row">
      <Button
        variant="text"
        style={{ color: 'black' }}
        onClick={()=>clickSort(0)}
        >期限が早い順</Button>
    </Stack>

      <div style={{ display: 'flex',  alignItems: 'center' }}>
        <p>/</p>
      </div>

    <Stack spacing={2} direction="row">
      <Button
        variant="text"
        style={{ color: 'black' }}
        onClick={()=>clickSort(1)}
        >期限が遅い順</Button>
    </Stack>
    </div>

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
  const [openLabelPage, setOpenLabelPage] = useState<boolean>(false); // 選択されたラベルページを表示、非表示にするステート
  // const [updatedData, setUpdatedData] = useState<{ col1: string[],col2:number[],col3: number[],col4: string[][] }>({ col1: [],col2: [], col3: [], col4:[] });
  const [updatedData, setUpdatedData] = useState<{ col1: string[],col2:number[],col3: number[],col4: string[][],col5: string[][] }>({ col1: [],col2: [], col3: [], col4:[], col5:[] });

  const [selectLabel,setSelectLabel] = useState<number>(-1); // 選択されたラベルデータのインデックス
  const [selectData,setSelectData] = useState<string>(''); // 選択されたラベルデータ

  return (

    <div className='bg-red-100 p-8'>
    <div className='flex justify-center bg-white'>
      <div className='font-mono w-4/5'>
        <header className="">
        <Todo />
        </header>
        <main>

        <MyContext.Provider value={{updatedData,selectLabel,selectData}}>
          <AddTask
            openLabelPage={openLabelPage}
            setOpenLabelPage={setOpenLabelPage}
          />
        </MyContext.Provider>

          <AddText
            openLabelPage={openLabelPage}
            setOpenLabelPage={setOpenLabelPage}
            updatedData={updatedData}
            setUpdatedData={setUpdatedData}
            selectLabel={selectLabel}
            setSelectLabel={setSelectLabel}
            selectData={selectData}
            setSelectData={setSelectData}
          />

        </main>
        <footer>
        </footer>



      </div>
    </div>
    </div>
  );
}


export default App;
