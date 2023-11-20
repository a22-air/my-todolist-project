import React, { useContext } from "react";
import { MyContext } from "./App";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
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
    const { updatedData,selectData } = useMyContext(); // コンテキストでデータの受け取り

    // 選択されたラベルが含まれている配列のインデックス番号を返す
const indices = updatedData.col4
.map((subArray, index) => subArray.includes(selectData) ? index : -1)
.filter((index) => index !== -1);

// indicesに格納されているインデックス番号のデータを取得
const selectedData = indices.map(index => {
const col2 = formatDate(updatedData.col2[index]); // col2をフォーマット
const col3 = formatDate(updatedData.col3[index]); // col3をフォーマット

return {
  col1: updatedData.col1[index],
  col2: col2,
  col3: col3,
  col4: updatedData.col4[index],
};
});

// col2とcol3をフォーマットするための関数
function formatDate(timestamp: number): string {
const numberString = timestamp.toString();
const formattedDate = `${numberString.substring(0, 4)}/${numberString.substring(6,4)}/${numberString.substring(8,6)}`; // フォーマット
return formattedDate;
}

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
                        <p>{data.col3}</p>
                    </div>
                    <div>
                        <p className="text-xs">期限</p>
                        {/* 値がないところは「//」で表示されてしまうので、非表示にする設定 */}
                        {data.col2 === '//' ? <p></p> : <p>{data.col2}</p>}
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
