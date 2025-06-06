import React, { useEffect,useState } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// labelColorsをインポートする



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
  // const keyName = 'labelData'; // 取得したいキー名
  // const storedValue = localStorage.getItem(keyName);

  // if (storedValue !== null) {
  //   console.log(`キー ${keyName} の値は ${storedValue} です。`);
  // } else {
  //   console.log(`キー ${keyName} は存在しません。`);
  // }
//　---------------------------------------------------------

//  storage.save({
//     key: 'labelData',
//     data:{
//       category:[],
//     }
//   });

// 親プロップスから受け取る処理
type LabelListProps = {
    handleSetLabel: (event: React.ChangeEvent<HTMLInputElement>) => void;
    labelType: string;
    showModal:boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    hiddenLabelArray: string[];
    labelTypeArray:string[];
    selectLabelColor:string;
    setSelectLabelColor:React.Dispatch<React.SetStateAction<string>>;
    selectLabelColorArray:string[];
    setSelectLabelColorArray:React.Dispatch<React.SetStateAction<string[]>>;
  };

  export function LabelList({ handleSetLabel,labelType,showModal,setShowModal,hiddenLabelArray,labelTypeArray,selectLabelColor,setSelectLabelColor,selectLabelColorArray,setSelectLabelColorArray}: LabelListProps){

    const [labelData,setLabelData] = useState<{category:string[],labelColors:string[]}>({category: [], labelColors: []}); // ラベル種類のステート
    const [newLabel,setNewLabel] = useState<string>(''); // 追加ラベルのステート
    const [indexNumber,setIndexNumber] = useState<number>(-1);


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
      },[labelData]); // labelDataが変更されたタイミングで監視

    // ラベル追加テキストをセットする関数
    const handleNewLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewLabel(event.target.value);
    }

    // 新しいラベルをストレージデータに入れ込む関数(追加ボタン押下時の処理)
    const newLabelCategory = (() => {
        // 追加のラベルが無ければ処理はしない
        if(!newLabel)return;

        // 新しいラベルをラベルデータの配列に追加
        labelData.category.push(newLabel);

        // ここで追加されたデータを書き換えて保存
        storage.save({
            key: 'labelData',
            data : labelData
        }).then((data) => {
            setNewLabel(''); // newLabelをリセット
        }).catch((err) => {
            console.log(err);
        });
    });

    // ラベルを削除する関数
    const removeLabelCategory = ((index:number) => {
      // 選択されたインデックス番号のラベルデータを削除
      labelData.category.splice(index,1);
      // ラベルデータに削除後の配列をセット
      setLabelData(labelData);

      // 削除後の配列を保存して書き換える
      storage.save({
                key: 'labelData',
                data : labelData
            }).then((data) => {
                setLabelData({category: [], labelColors: []}); // ラベルデータの中身をリセット
            }).catch((err) => {
                console.log(err);
            });
      });

      // モーダルウインドウの編集ボタンのハンドラ
      const [modalEdit,setModalEdit] = useState<boolean>(false);
      const handleModalEdit = (() => {
        setModalEdit(!modalEdit);
      })

      // ラベルの数だけデフォルトのカラーを設定する関数
      const labelColorArrayCreate = (() => {
        const newColors = Array(labelTypeArray.length).fill('purple-200');
        setSelectLabelColorArray(newColors);
      })

    return(
        <>
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
                  <h3 className="text-gray-500 text-3xl font-semibold">
                    Label
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="max-width-full flex-col">
                    {labelData.category.map((data, index) => (
                      <div  className="items-center mr-4"
                        key={`labelData${index}`}
                      >
                        <input
                          type="checkbox"
                          id={`checkbox${index}`}
                          name={`checkbox${index}`}
                          onChange=
                            {(event: React.ChangeEvent<HTMLInputElement>) => {
                            handleSetLabel(event);
                            }}
                          value={data}
                          disabled={hiddenLabelArray.includes(data)}
                          checked={labelTypeArray.includes(data) || hiddenLabelArray.includes(data)}
                        />
                        <label
                          key={index}
                          htmlFor={`checkbox${index}`}
                          className={`bg-purple-200 text-xs font-semibold inline-block py-1 my-1 mx-1 px-2 uppercase rounded text-white ${index === indexNumber ? 'bg-'+selectLabelColor : 'bg-purple-200' } last:mr-0 mr-1`}
                        >
                          {data}
                        </label>

                        {/* 削除アイコンの表示設定 */}
                        {modalEdit ?
                        <button onClick={(labelIndex) => {removeLabelCategory(index);}}>
                          <RemoveCircleOutlineIcon
                          fontSize="small"
                          style={{ color: 'red' }}
                          />
                        </button>
                        : null}

                      </div>
                    ))}
                  </div>

                  {modalEdit ?
                  <div className="flex justify-between mt-10">
                    <div className="mb-3 pt-0 w-3/4">
                      <input type="text"
                            placeholder="Add Label"
                            className="w-full px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white  rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring "
                            onChange={handleNewLabel}
                            value={newLabel}
                      />
                    </div>
                    <div className="">
                      <button className="mx-1 text-gray-500" onClick={newLabelCategory}>ADD</button>
                    </div>
                  </div>
                : null }

                </div>
                {/*footer*/}
                <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">

                  <button
                    className="bg-red-400 text-white active:bg-red-600 font-bold uppercase text-sm px-4 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleModalEdit}
                  >
                    LABEL EDIT
                  </button>
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setIndexNumber(-1);
                      setModalEdit(false);
                      setSelectLabelColor('');
                      labelColorArrayCreate();
                    }}
                  >
                    Close
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

export default LabelList;