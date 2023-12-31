import React, { useState } from "react";
import Modal from "../common/Modal";
import { Pagination } from "@mui/material";
import { useQuery } from "react-query";
import { getManagementList } from "../../apis/api/manage";
import { useRecoilState } from "recoil";
import { dishInfo } from "../../recoil/dish";
import { selectManageId } from "../../recoil/manage";
import LogDetail from "./LogDetail";

interface logItem {
  client: {
    clientAddress: string;
    clientEmail: string;
    clientId: number;
    clientName: string;
    clientNickname: string;
    clientPhone: string;
    clientProfileImagePath: string;
    createdDate: string;
    isDeleted: true;
    lastPostingDate: string;
    locationCode: string;
    updatedDate: string;
    userCode: string;
  };
  createdDate: string;
  dish: {
    createdDate: string;
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
    isDeleted: true;
    locationCode: string;
    updatedDate: string;
  };
  dishState: string;
  isDeleted: true;
  managementCommentList: [
    {
      client: {
        clientAddress: string;
        clientEmail: string;
        clientId: number;
        clientName: string;
        clientNickname: string;
        clientPhone: string;
        clientProfileImagePath: string;
        createdDate: string;
        isDeleted: true;
        lastPostingDate: string;
        locationCode: string;
        updatedDate: string;
        userCode: string;
      };
      createdDate: string;
      isDeleted: true;
      managementCommentContent: string;
      managementCommentId: number;
      updatedDate: string;
    }
  ];
  managementContent: string;
  managementId: number;
  managementImageList: [
    {
      createdDate: string;
      imageId: number;
      imagePath: string;
      isDeleted: true;
      updatedDate: string;
    }
  ];
  updatedDate: string;
}
export default function LogTable() {
  const dish = useRecoilState(dishInfo)[0];
  const [managementId, setManagementId] = useRecoilState(selectManageId);
  const LIMIT = 8;
  const [offset, setOffset] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRegist, setIsRegist] = useState(false);

  const handlePage = (e: React.ChangeEvent<unknown>, value: number) => {
    setOffset(value);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalOpen(false);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["getManagementList", dish.dishId, offset, isRegist],
    queryFn: () => getManagementList(dish.dishId, LIMIT, LIMIT * (offset - 1)),
  });

  if (isLoading || data === undefined) return null;

  // 전체 페이지 개수
  const totalPage = Math.ceil(data.data.totalCount / LIMIT);

  return (
    <div className="w-full h-full flex flex-col gap-2 m-auto relative dark:bg-DarkBackground2">
      {data.data.totalCount === 0 ? (
        <div>등록된 관리 일지가 없습니다.</div>
      ) : (
        <>
          <table className="w-[100%] max-w-full"  style={{ tableLayout: 'fixed' }}>
            <thead className="w-full">
              <tr className="w-full h-[2rem] flex flex-row justify-between bg-LightMain text-white dark:bg-DarkMain">
                <th className="text-sm py-1 px-2 text-left">그릇명</th>
                {/* <th className="w-[10%] text-sm py-1 px-2 text-left">작성자</th> */}
                <th className="mr-[9rem] text-sm py-1 px-2">상태</th>
                <th className="mr-[2rem] text-sm text-left py-1 px-2">상세 내용</th>
                <th className="mr-[1rem] text-sm py-1 px-2">작성일자</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {data.data.data.map((item: logItem, index: number) => (
                <tr
                  key={item.managementId}
                  className={`w-full flex flex-row justify-center hover:bg-LightMainHover dark:hover:bg-DarkMainHover cursor-pointer ${
                    index % 2 === 1 ? "bg-gray-100 dark:bg-zinc-500" : null
                  }`}
                  onClick={() => {
                    openModal();
                    setManagementId(item.managementId);
                  }}
                >
                  <td className="w-[20%] text-sm text-left py-1 px-2 truncate">
                    {item.dish.dishName}
                  </td>
                  {/* <td className="w-[10%] text-sm text-left ml-4 py-1 px-2 truncate">
                    {item.client.clientNickname}
                  </td> */}
                  <td className="w-[10%] text-sm text-center ml-2 py-1.5 px-2 flex justify-center">
                    {item.dishState === "0030001" ? (
                      <div className="w-2 h-2 text-sm mt-1 bg-State1 rounded-[50%]"></div>
                    ) : item.dishState === "0030002" ? (
                      <div className="w-2 h-2 text-sm mt-1 bg-State2 rounded-[50%]"></div>
                    ) : item.dishState === "0030003" ? (
                      <div className="w-2 h-2 text-sm mt-1 bg-State3 rounded-[50%]"></div>
                    ) : (
                      <div className="w-2 h-2 text-sm mt-1 bg-State4 rounded-[50%]"></div>
                    )}
                  </td>
                  <td className="w-[400px] text-sm py-1 px-2 truncate">
                    {item.managementContent}
                  </td>
                  <td className="w-[20%] text-sm text-center py-1 px-2">
                    {item.updatedDate.split("T")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-row mt-auto justify-center ">
            <Pagination
              count={totalPage}
              sx={{ color: "#9FA9D8" }}
              page={offset}
              onChange={handlePage}
            />
          </div>
          <Modal open={modalOpen} close={closeModal} header="관리 일지 상세">
            <LogDetail
              setModalOpen={setModalOpen}
              isRegist={isRegist}
              setIsRegist={setIsRegist}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
