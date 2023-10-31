import React, { useContext } from "react";
import { MyContext } from "./App";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// 親プロップスから受け取る処理
type LavelPageProps = {
    openLabelPage:boolean;
    setOpenLabelPage:React.Dispatch<React.SetStateAction<boolean>>;
  };
export const useMyContext = () => {
    return useContext(MyContext);
  };
export function LabelPage({openLabelPage,setOpenLabelPage}:LavelPageProps){
    const { updatedData, selectLabel,selectData } = useMyContext();

    const indices = updatedData.col4
        .map((subArray, index) => subArray.includes(selectData) ? index : -1)
        .filter((index) => index !== -1);
        console.log(indices);

        const selectedData = indices.map(index => ({
            col1: updatedData.col1[index],
            col2: updatedData.col2[index],
            col3: updatedData.col3[index],
            col4: updatedData.col4[index],
          }));

          console.log('selectedData'+JSON.stringify(selectedData));

    return (
        <>
        <span className="m-2 text-large font-semibold inline-block py-1 px-2 uppercase rounded text-purple-600 bg-purple-200 uppercase last:mr-0 mr-1">
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
        <Stack direction="row" spacing={2}>
            <Button
                onClick={() => setOpenLabelPage(!openLabelPage)}
                variant="contained"
                size="small"
                style={{ backgroundColor: '#FF82B2'}}
                >
                <ArrowBackIcon></ArrowBackIcon>
            </Button>
        </Stack>
        </div>
        </>

    )
};
