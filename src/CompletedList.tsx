import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {useState,useEffect} from 'react';

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
    updatedData: { col1: string[] } // updatedData を受け取るプロップス
    checkedTask : string; // checkedTaskを受け取るプロップス
  };

export function CompletedList(props: CompletedListProps){
    const [completedData, setCompletedData] = useState<{ col1: string[] }>({ col1: [] });

  useEffect(() => {
    // ページがロードされたときにデータを読み込む
    const loadCompletedData = async () => {
      try {
        const data = await storage.load({ key: 'completed' }); //completedDataをロード
        setCompletedData(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadCompletedData();
  }, []); // 初回レンダリング時のみ副作用関数を実行

    //   データの更新
  useEffect(() => {
    if (props.checkedTask) {
      // 新しいデータを作成
      const updatedData = {
        col1: [...completedData.col1, props.checkedTask], //completedDataの配列にcheckedTaskの値を追加
      };

      // データの保存
      storage.save({
        key: 'completed',
        data: updatedData,
      }).then((data) => {
        // setCompletedData(updatedData); // 状態を更新
        // window.location.reload(); // ページをリロードする

      }).catch((err) => {
        console.log(err);
      });
    }
  }, [props.checkedTask,completedData]);//props.checkedTaskとcompletedDataの更新時に実行

  // 削除する関数
  const removeText = (indexToRemove: number) => {
    // ストレージデータをロードする
    storage.load({
      key:'completed'
    }).then((data) => {
      // 配列のindex番目を削除
      data.col1.splice(indexToRemove,1)
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

    return(
    <div >
        <div >
            <h1>Completed List</h1>
            {/* <h1>{props.checkedTask}</h1> */}
            {completedData.col1.map((data,index) => (
            <div key={index} className='flex container border-b border-black my-4 justify-between'>
                <div className='flex'>
                <img className='w-8 h-8 mx-3' src='/check02.png' alt='' />
                <div  className=''>{data}</div>
                </div>
                <button onClick={() => removeText(index)}>削除</button>
            </div>
            ))}
        </div>
    </div>
    )
};