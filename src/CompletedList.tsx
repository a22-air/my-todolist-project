import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState,useEffect} from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Check from '@mui/icons-material/Check';
import ChecklistIcon from '@mui/icons-material/Checklist';

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
    checkedTaskArray:{col1:string, col2: number, col3:number, col4:string[], col5:string[]}; // チェックボックスで選択されたデータを受け取るプロップス
    checkedNum: number; // チェックボックス押下で1が返ってきて完了リストに追加処理が始まる
    completedIndex : number; // 完了リストのindex番号を操作するプロップス
    setCompletedIndex : React.Dispatch<React.SetStateAction<number>>; // 完了リストのindex番号を操作するプロップス
  };

export function CompletedList(props: CompletedListProps){
    const [completedDataArray,setCompletedDataArray] = useState<{col1:string[], col2:number[], col3: number[],col4:string[][],col5:string[][]}>({col1: [], col2: [], col3: [],col4:[],col5:[]});

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
    },[]);

    // チェックボックスが押下されたら発動する処理
    if (props.checkedNum === 1) {
      (async () => {
        // 既存のデータを読み込む
        try {
          const existingData = await storage.load({
            key: 'completed',
          });

          let updatedData: { col1: string[], col2: number[], col3: number[], col4:string[][],col5:string[][] } = {
            col1: [],
            col2: [],
            col3: [],
            col4: [],
            col5: []
          };

          // 既存のデータがあれば、それを取得し新しいデータを追加
          if (existingData) {
            updatedData = {
              col1: [...existingData.col1, props.checkedTaskArray.col1],
              col2: [...existingData.col2, props.checkedTaskArray.col2],
              col3: [...existingData.col3, props.checkedTaskArray.col3],
              col4: [...existingData.col4, props.checkedTaskArray.col4],
              col5: [...existingData.col5, props.checkedTaskArray.col5]

            };
          } else {
            updatedData = {
              col1: [props.checkedTaskArray.col1],
              col2: [props.checkedTaskArray.col2],
              col3: [props.checkedTaskArray.col3],
              col4: [props.checkedTaskArray.col4],
              col5: [props.checkedTaskArray.col5]
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
      data.col4.splice(indexToRemove,1)
      data.col5.splice(indexToRemove,1)

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

    // 戻すボタンを押下時に親プロップスにindex番号を渡す処理
    const returnData = ((indexToRemove:number) => {
      props.setCompletedIndex(indexToRemove);
    });

    return(
    <div >
        <div >
            <h1 className='text-3xl font-bold'>Completed List <ChecklistIcon /></h1>
            {completedDataArray.col1.map((data,index) => (
            <div key={index} className='flex container border-b border-black my-4 justify-between'>
                <div className='flex'>
                <Check />
                <div  className=''>{data}</div>
                </div>
                <div>
                <Stack direction="row" spacing={2}>
                  <Button style={{'backgroundColor':'#BBBBBB'}} onClick={() => returnData(index)} variant="contained">戻す</Button>
                  <Button style={{'backgroundColor':'#BBBBBB'}} onClick={() => removeText(index)} variant="contained">削除</Button>
                </Stack>
                </div>
            </div>
            ))}
        </div>
    </div>
    )
};