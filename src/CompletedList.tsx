import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState,useEffect} from 'react';
import { log } from 'console';

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

type CompletedListProps = {
    //TODO:削除
    updatedData: { col1: string[],col2:number[],col3:number[] } // updatedData を受け取るプロップス
    //TODO:削除
    checkedTask : string; // checkedTaskを受け取るプロップス

    checkedTaskArray:{col1:string, col2: number, col3:number}; // チェックボックスで選択されたデータを受け取るプロップス
    checkedNum: number; // チェックボックス押下で1が返ってきて完了リストに追加処理が始まる
  };

export function CompletedList(props: CompletedListProps){
    const [completedDataArray,setCompletedDataArray] = useState<{col1:string[], col2:number[], col3: number[]}>({col1: [], col2: [], col3: []});

    // 既存のデータをロード
    useEffect(() => {
      storage.load({
        key: 'completed'
      }).then((data) => {
        setCompletedDataArray(data);
        console.log('現在のcompletedData:'+JSON.stringify(completedDataArray,null,2));
      }).catch((err) => {
        console.log(err);
      });
    },[completedDataArray]);

    // チェックボックスが押下されたら発動する処理
    if (props.checkedNum === 1) {
      (async () => {
        try {
          const existingData = await storage.load({
            key: 'completed',
          });

          let updatedData: { col1: string[], col2: number[], col3: number[] } = {
            col1: [],
            col2: [],
            col3: []
          };

          // 既存のデータがあれば、それを取得し新しいデータを追加
          if (existingData) {
            updatedData = {
              col1: [...existingData.col1, props.checkedTaskArray.col1],
              col2: [...existingData.col2, props.checkedTaskArray.col2],
              col3: [...existingData.col3, props.checkedTaskArray.col3]
            };
          } else {
            updatedData = {
              col1: [props.checkedTaskArray.col1],
              col2: [props.checkedTaskArray.col2],
              col3: [props.checkedTaskArray.col3]
            };
          }

          // 新しいデータを保存
        await storage.save({
          key: 'completed',
          data: updatedData,
        });

        window.location.reload(); // ページをリロードする

        } catch (err) {
          console.log('Error:', err);
        }
      })();
    }

  // 削除する関数
  const removeText = (indexToRemove: number) => {
    // ストレージデータをロードする
    storage.load({
      key:'completed'
    }).then((data) => {
      // 配列のindex番目を削除
      data.col1.splice(indexToRemove,1)
      data.col2.splice(indexToRemove,1)
      data.col3.splice(indexToRemove,1)
        console.log('データの中身は : ' + JSON.stringify(data));
      // 変更後のストレージデータの配列を保存する処理
        storage.save({
          key:'completed',
          // ここで削除後のデータを入れ込む
          data:data
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

    const returnData = (() => {
      storage.load({
        key: 'completed'
      }).then((data) => {
        console.log(' : ' + JSON.stringify(data));
      }).catch((err) => {
        console.log(err);
      });
    })

    return(
    <div >
        <div >
            <h1>Completed List</h1>
            {/* <h1>{props.checkedTask}</h1> */}
            {completedDataArray.col1.map((data,index) => (
            <div key={index} className='flex container border-b border-black my-4 justify-between'>
                <div className='flex'>
                <img className='w-8 h-8 mx-3' src='/check02.png' alt='' />
                <div  className=''>{data}</div>
                </div>
                <div>
                  <button onClick={returnData}>戻す</button>
                  <button onClick={() => removeText(index)}>削除</button>
                </div>
            </div>
            ))}
        </div>
    </div>
    )
};