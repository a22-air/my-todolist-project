import React, { useContext } from "react";
import { MyContext } from "./App";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import 'animate.css/animate.min.css';

// 親プロップスから受け取る処理
type LabelPageProps = {
    openLabelPage:boolean;
    setOpenLabelPage:React.Dispatch<React.SetStateAction<boolean>>;
  };

// コンテキストを使用するための関数
export const useMyContext = () => {
    return useContext(MyContext);
  };
//　LabelPageのコンポーネント ============================================================================
export function LabelPage({openLabelPage,setOpenLabelPage}:LabelPageProps){
    const { updatedData, selectLabel,selectData } = useMyContext(); // コンテキストでデータの受け取り

    // 選択されたラベルが含まれている配列のインデックス番号を返す
    const indices = updatedData.col4
        .map((subArray, index) => subArray.includes(selectData) ? index : -1) // 選択されたラベルがあればインデックス番号で返し、なければ−1を返す
        .filter((index) => index !== -1); // -1以外の数字を配列に格納
        // indicesに格納されているインデックス番号のデータを取得
        const selectedData = indices.map(index => ({
            col1: updatedData.col1[index],
            col2: updatedData.col2[index],
            col3: updatedData.col3[index],
            col4: updatedData.col4[index],
          }));

//  =====================================================================================================
    return (
        <>
        {openLabelPage &&
        <div className="animate__animated animate__fadeIn">
        <span className="m-2 text-large font-semibold inline-block py-1 px-2 rounded text-purple-600 bg-purple-200 uppercase last:mr-0 mr-1">
            {selectData}
        </span>
        <div className="m-2">
         {selectedData.map((data, index) => (
            <div key={`selectData_${index}`} className="my-5 flex justify-between border-b border-black">
                <div className="flex justify-center items-center">
                    <FavoriteBorderIcon className="mr-2"/>
                    <p>{data.col1}</p>
                </div>

            <div className="flex w-1/3 text-center">
                <div className="w-1/2">
                    <p className="text-xs">追加日</p>
                    <p>{data.col2}</p>
                </div>
                <div>
                    <p className="text-xs">期限</p>
                    <p>{data.col3}</p>
                </div>
            </div>

            </div>
        ))}
        </div>
        </div>
}
        </>

    )
};
