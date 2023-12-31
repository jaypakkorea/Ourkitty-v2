import React, { useState } from "react";
import { useQuery } from "react-query";
import { getDishList } from "../../apis/api/dish";
import UserCard from "../common/UserCard";
import DeletedUserItem from "./DeletedUserItem";

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

export default function UserHistory() {
  const [dishId, setDishId] = useState(0);
  const [searchKey, setSearchKey] = useState("0090001");
  const [searchWord, setSearchWord] = useState("");

  const handleSelectDish = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDishId(Number(e.target.value));
  };

  const handleSelectSearchKey = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchKey(e.target.value);
  };

  const handleSearchWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const { data, isLoading } = useQuery({
    queryKey: "getDishList",
    queryFn: () => getDishList(),
  });

  if (isLoading || data === undefined) return null;
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex flex-row gap-5 pt-1 pl-3">
        <h1 className="text-[1rem] mt-2 font-bold">탈퇴 회원</h1>
        <select
          name="selectDish"
          id="selectDish"
          className="w-[5rem] outline-none dark:bg-DarkBackground2"
          onChange={handleSelectDish}
        >
          <option value="0">전체</option>
          {data.data.map((item: detailData) => (
            <option key={item.dishId} value={item.dishId}>
              {item.dishName}
            </option>
          ))}
        </select>
        <div className="flex flex-row border-[2px] rounded-lg p-1 dark:border-DarkBackground">
          <select
            name="selectSearchKey"
            id="selectSearchKey"
            className="outline-none dark:bg-DarkBackground2"
            onChange={handleSelectSearchKey}
          >
            <option value="0090001">이름</option>
            <option value="0090002">닉네임</option>
            <option value="0090003">이메일</option>
            <option value="0090004">연락처</option>
            <option value="0090005">주소</option>
          </select>
          <input
            type="text"
            className="w-[10rem] outline-none pl-2 dark:bg-DarkBackground2"
            onChange={handleSearchWord}
          />
        </div>
      </div>

      <DeletedUserItem
        dishId={dishId}
        searchKey={searchKey}
        searchWord={searchWord}
      />
    </div>
  );
}
