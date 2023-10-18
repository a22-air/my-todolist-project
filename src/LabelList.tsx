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

  export function LabelList(){

    const [labelData,setLabelData] = useState<{category:string[]}>({category: []});
    const [labelType,setLabelType] = useState<string>('');
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

    // ラベルのテキストをセットする関数
    const handleSetLabel = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedLabel = event.target.value;
      setLabelType(selectedLabel);
      console.log('labelType : ' + selectedLabel);
    };

    // ラベル追加テキストをセットする関数 TODO:
    const handleNewLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewLabel(event.target.value);
        console.log('newLabel :' + newLabel);
    }


    return(
        <>
            <div className="flex">
              <div>
                <select name="label-tag"value={labelType} onChange={handleSetLabel}>
                  <option value="ラベルを追加">ラベルを追加</option>
                  {labelData.category.map((data, index) => (
                    <option key={index}>{data}</option>
                  ))}
                </select>
              </div>
              <div>
                <input type="text" placeholder='ラベルを作成' onChange={handleNewLabel}></input>
                <button>ラベル追加ボタン</button>
              </div>
            </div>
        </>
    )
  }