import React, { useEffect,useState } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

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
  const keyName = 'labelData'; // 取得したいキー名
  const storedValue = localStorage.getItem(keyName);

  if (storedValue !== null) {
    console.log(`キー ${keyName} の値は ${storedValue} です。`);
  } else {
    console.log(`キー ${keyName} は存在しません。`);
  }
//　---------------------------------------------------------

type LabelListProps = {
    handleSetLabel: (event: React.ChangeEvent<HTMLInputElement>) => void;
    labelType: string;
    showModal:boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    hiddenLabelArray: string[];
  };

  export function LabelList({ handleSetLabel,labelType,showModal,setShowModal,hiddenLabelArray }: LabelListProps){

    const [labelData,setLabelData] = useState<{category:string[]}>({category: []});
    const [newLabel,setNewLabel] = useState<string>('');

    // ラベルのデータをロード
    useEffect(() => {
        storage.load({
          key: 'labelData'
        }).then((data) => {
          setLabelData(data);
          console.log('labelData : ' + JSON.stringify(labelData));
        }).catch((err) => {
          console.log(err);
        });
      },[labelData]);

    // ラベル追加テキストをセットする関数
    const handleNewLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewLabel(event.target.value);
    }

    // 新しいラベルをストレージデータに入れ込む関数(追加ボタン押下時の処理)
    const newLabelCategory = (() => {
        // 追加のラベルが無ければ処理はしない
        if(!newLabel)return;

        labelData.category.push(newLabel);

        // ここで追加されたデータを書き換えて保存
        storage.save({
            key: 'labelData',
            data : labelData
        }).then((data) => {
            console.log(' : ' + data);
        }).catch((err) => {
            console.log(err);
        });
    });


    //ラベルを削除する関数(原本)
    // const removeLabelCategory = (() => {
    //     if(!labelType) return;

    //     let index = labelData.category.indexOf(labelType);
    //     labelData.category.splice(index,1);

    //     // ここで削除されたデータを書き換えて保存
    //     storage.save({
    //         key: 'labelData',
    //         data : labelData
    //     }).then((data) => {
    //         console.log(' : ' + data);
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    // })

    // ラベルを削除する関数（修正）TODO:
    const [removeNum,setRemoveNum] = useState<number>(-1);
    const removeLabelCategory = ((index:number) => {

      // labelData.category.splice(index,1);
      // setLabelData(labelData);
      setRemoveNum(index);

      });

    // 選択されているラベルを表示させない処理
    const hiddenLabel = (() => {
      console.log('labelData : ' + JSON.stringify(labelData)); // 全てのラベルデータ
      console.log('hiddenLabelArray : ' + JSON.stringify(hiddenLabelArray)); // 各インデックスのラベルデータ
      console.log('今日やることはインデックス番号 : ' + labelData.category.indexOf('ddd')); // インデックス番号を取得できるか確認ログ

      const filteredLabelData = labelData.category.filter(item => hiddenLabelArray.includes(item));
      console.log('filteredLabelData:' +filteredLabelData);

    })

    const [disabledItems, setDisabledItems] = useState<string[]>([]);
  const [crossedOutItems, setCrossedOutItems] = useState<number[]>([]);

  const handleSetLabelTest = (data: string) => {
    if (disabledItems.includes(data)) {
      // アイテムが既に無効になっている場合、無効リストから削除
      setDisabledItems(disabledItems.filter((item) => item !== data));
      // アイテムの打ち消し線を削除
      setCrossedOutItems(crossedOutItems.filter((itemIndex) => itemIndex !== labelData.category.indexOf(data)));
    } else {
      // アイテムが無効になっていない場合、無効リストに追加
      setDisabledItems([...disabledItems, data]);
      // アイテムに打ち消し線を追加
      setCrossedOutItems([...crossedOutItems, labelData.category.indexOf(data)]);
    }
  }


    return(
        <>
        <button onClick={hiddenLabel}>ボタン</button>
        {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    ラベル
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <div className="flex-col">

                  <div className="max-width-full">
                    {labelData.category.map((data, index) => (
                      <div  className="flex items-center mr-4"
                            key={`labelData${index}`}
                            >
                        <input
                        type="checkbox"
                        id={`checkbox${index}`}
                        name={`checkbox${index}`}
                        onChange={handleSetLabel}
                        value={data}
                        className=""
                        disabled={hiddenLabelArray.includes(data)}
                        />
                      <label key={index}
                      htmlFor={`checkbox${index}`}
                      className={`text-xs font-semibold inline-block py-1 my-1 mx-1 px-2 uppercase rounded text-pink-600 bg-pink-200 uppercase last:mr-0 mr-1 ${crossedOutItems.includes(index) ? 'line-through' : ''}`}
                      >
                        {data}
                      </label>
                      <button
                        onClick={() => {removeLabelCategory(index);handleSetLabelTest(data)}}>
                          <RemoveCircleOutlineIcon
                          fontSize="small"
                          className="text-red-600"
                        />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col justify-end w-1/2">
                  <div className="mb-3 pt-0">
                    <input type="text"
                          placeholder="ラベル"
                          className="w-full px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring "
                          onChange={handleNewLabel}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="mx-1" onClick={newLabelCategory}>追加</button>
                    {/* <button className="mx-1"onClick={removeLabelCategory}>削除</button> */}
                  </div>
                  </div>
                </div>

                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

        </>
    )
  }