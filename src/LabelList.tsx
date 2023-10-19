import React, { useEffect,useState } from "react";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

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
    // handleSetLabel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSetLabel: (event: React.ChangeEvent<HTMLInputElement>) => void;
    // setLabelType: React.Dispatch<React.SetStateAction<string>>;
    labelType: string;
  };

  export function LabelList({ handleSetLabel,labelType }: LabelListProps){

    const [labelData,setLabelData] = useState<{category:string[]}>({category: []});
    // const [labelType,setLabelType] = useState<string>('');
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


    //ラベルを削除する関数
    const removeLabelCategory = (() => {
        if(!labelType) return;

        let index = labelData.category.indexOf(labelType);
        labelData.category.splice(index,1);

        // ここで削除されたデータを書き換えて保存
        storage.save({
            key: 'labelData',
            data : labelData
        }).then((data) => {
            console.log(' : ' + data);
        }).catch((err) => {
            console.log(err);
        });
    })

// ラベルの表示と非表示の切り替えの関数
const [showLabelList, setShowLabelList] = useState(false);
const handleLabelClick = () => {
  setShowLabelList(!showLabelList); // クリック時に表示状態を切り替え
};

    return(
        <>
        <button onClick={handleLabelClick}>ラベル</button>

        {showLabelList && (
            <div className="flex">

                <div>
                  {labelData.category.map((data, index) => (
                    <label key={index} htmlFor={`checkbox${index}`}>
                      <input type="checkbox" id={`checkbox${index}`} name={`checkbox${index}`} onChange={handleSetLabel} value={data}/>
                      {data}
                    </label>
                  ))}
                </div>

              <div>
                <input type="text" placeholder='ラベルを作成' onChange={handleNewLabel}></input>
                <button onClick={newLabelCategory}>ラベル追加</button>
                <button onClick={removeLabelCategory}>ラベル削除</button>
              </div>
            </div>
          )}

        </>
    )
  }