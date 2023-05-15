import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getDishList } from "../../apis/api/dish";
import { useRecoilState } from "recoil";
import { selectedButtonState, selectedSerialNumberState } from "../../recoil/chart";

interface detailData {
  createdData: string;
  dishAddress: string;
  dishCatCount: number;
  dishId: number;
  dishLat: number;
  dishLong: number;
  dishName: string;
  dishProfileImagePath: string;
  dishSerialNum: string;
  dishTnrCount: number;
  dishWeight: number;
  isDeleted: boolean;
  locationCode: string;
  updatedDate: string;
}

export default function MyDishButtons() {
  const { data, isLoading } = useQuery({
    queryKey: "getDishList",
    queryFn: () => getDishList(),
  });

  const [button, setButton] = useState<detailData[]>([]);
  const [selectedButton, setSelectedButton] = useRecoilState(selectedButtonState);
  const [selectedSerialNumber, setSelectedSerialNumber] = useRecoilState(selectedSerialNumberState);

  useEffect(() => {
    if (data !== undefined) {
      const newButtons = data.data.map((item: { dishId: any, dishName: any, dishSerialNum: any }) => ({
        dishId: item.dishId,
        dishName: item.dishName,
        dishSerialNum: item.dishSerialNum,
      }));
      setButton(newButtons);
    }
  }, [data]);


  const handleClick = (el: any) => {
    setSelectedButton(el.dishId);
    setSelectedSerialNumber(el.dishSerialNum);
  };

  if (isLoading || data === undefined) return null;

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {button.map((item) => (
        <button
          key={item.dishId}
          className={`w-full h-[3rem] px-3 rounded-lg text-black font-bold hover:bg-LightMain dark:hover:bg-DarkMain border border-LightMain ${selectedButton === item.dishId
            ? "bg-LightMain text-white"
            : "bg-white"
            }`}
          onClick={() => handleClick(item)}
        >
          {item.dishName}
        </button>
      ))}
    </div>
  );
}
