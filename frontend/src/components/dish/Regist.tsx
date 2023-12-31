import React, { useRef, useState, useEffect } from "react";
import DefaultButton from "../common/DefaultButton";
import RegistKakaoMap from "./RegistKakaoMap";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { darkState } from "../../recoil/page";
import { dishInfo, dishRegist, dishCountState } from "../../recoil/dish";
import { useMutation } from "react-query";
import { registDish, modifyDish, deleteDish } from "../../apis/api/dish";

export default function Regist() {
  const isDark = useRecoilState(darkState)[0];
  // input 대체 태그 설정
  const file = useRef() as React.MutableRefObject<HTMLInputElement>;

  // 등록/수정 판단
  const [isRegist, setIsRegist] = useRecoilState(dishRegist);

  // 그릇 정보
  const [dish, setDish] = useRecoilState(dishInfo);

  // 등록 여부 판별
  const [dishCount, setDishCount] = useRecoilState(dishCountState);

  const [dishSerialNum, setDishSerialNum] = useState(dish.dishSerialNum);
  const [dishName, setDishName] = useState(dish.dishName);
  const [dishAddress, setDishAddress] = useState(dish.dishAddress);
  const [dishPosition, setDishPosition] = useState({
    lat: dish.dishLat,
    lng: dish.dishLong,
  });
  const [image, setImage] = useState(dish.file);
  const [imageUrl, setImageUrl] = useState("");

  // 등록 요청
  const regist = useMutation(["registDish"], () => registDish(formData), {
    onSuccess: () => {
      setDishCount((cur: number) => cur + 1);
    },
  });
  // 수정 요청
  const modify = useMutation(
    ["modifyDish"],
    (dishId: number) => modifyDish(dishId, formData),
    {
      onSuccess: () => {
        setDishCount((cur: number) => cur + 1);
      },
    }
  );
  // 삭제 요청
  const deleteRequest = useMutation(
    ["deleteDish"],
    (dishId: number) => deleteDish(dishId),
    {
      onSuccess: () => {
        setDishCount((cur: number) => cur - 1);
      },
    }
  );

  // 냥그릇 전송 데이터
  const formData = new FormData();
  formData.append("dishAddress", dishAddress);
  formData.append("dishLat", String(dishPosition.lat));
  formData.append("dishLong", String(dishPosition.lng));
  formData.append("dishName", dishName);
  formData.append("dishSerialNum", dishSerialNum);
  formData.append("file", image);

  // 입력값 처리
  // 시리얼 번호
  const handleSerialNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDishSerialNum(e.target.value);
  };
  // 이름
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDishName(e.target.value);
  };
  // 상세 주소
  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDishAddress(e.target.value);
  };
  // 사진
  const imagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 미리보기 이미지
    // @ts-ignore
    setImageUrl(URL.createObjectURL(e.target.files[0]));

    // 업로드 이미지
    // @ts-ignore
    setImage(e.target.files[0]);
  };

  // 이미지 삭제
  const deleteImage = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    Swal.fire({
      title: "등록된 사진을 삭제하시겠습니까?",
      icon: "info",
      background: isDark ? "#262D33" : "white",
      color: isDark ? "white" : "black",
      showCancelButton: true,
      confirmButtonColor: isDark ? "#29325B" : "#9FA9D8",
      cancelButtonColor: "#B0B0B0",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        URL.revokeObjectURL(image);
        setImage("");
        setImageUrl("");
      }
    });
  };

  // 초기화
  const handleInitInfo = () => {
    setIsRegist(true);
    setDishSerialNum("");
    setDishAddress("");
    setDishName("");
    setImage("");

    navigator.geolocation.getCurrentPosition((position) => {
      setDish({
        dishId: 0,
        dishAddress: "",
        dishLat: position.coords.latitude,
        dishLong: position.coords.longitude,
        dishName: "",
        dishSerialNum: "",
        file: "",
      });

      setDishPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  // 기기 등록
  const handleRegist = () => {
    const Toast = Swal.mixin({
      toast: true, // 토스트 형식
      position: "bottom-end", // 알림 위치
      showConfirmButton: false, // 확인버튼 생성 유무
      timer: 1500, // 지속 시간
      timerProgressBar: true, // 지속시간바 생성 여부
      background: isDark ? "#262D33" : "white",
      color: isDark ? "white" : "black",
    });

    Swal.fire({
      title: `${isRegist ? "등록" : "수정"} 하시겠습니까?`,
      icon: "info",
      background: isDark ? "#262D33" : "white",
      color: isDark ? "white" : "black",
      showCancelButton: true,
      confirmButtonColor: isDark ? "#29325B" : "#9FA9D8",
      cancelButtonColor: "#B0B0B0",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      reverseButtons: true,
    }).then((result) => {
      // 확인 버튼 클릭
      if (result.isConfirmed) {
        // 입력값이 빠진 경우
        if (dishName === "" || dishAddress === "" || image === "") {
          Toast.fire({
            icon: "warning",
            title:
              dishName === ""
                ? "냥그릇 이름을 입력해주세요."
                : dishAddress === ""
                ? "상세 주소를 입력해주세요."
                : "사진을 등록해주세요.",
          });
        } else {
          // 기기 등록/수정 API 요청 전송
          if (isRegist) {
            regist.mutate();
            // 초기화
            handleInitInfo();
            Toast.fire({
              icon: "success",
              title: "등록되었습니다.",
            });
          } else {
            modify.mutate(dish.dishId);
            // 초기화
            handleInitInfo();
            Toast.fire({
              icon: "success",
              title: "수정되었습니다.",
            });
            setIsRegist(true);
          }
        }
      }
    });
  };

  // 기기 삭제
  const handleDelete = () => {
    const Toast = Swal.mixin({
      toast: true, // 토스트 형식
      position: "bottom-end", // 알림 위치
      showConfirmButton: false, // 확인버튼 생성 유무
      timer: 1500, // 지속 시간
      timerProgressBar: true, // 지속시간바 생성 여부
      background: isDark ? "#262D33" : "white",
      color: isDark ? "white" : "black",
    });

    Swal.fire({
      title: "해당 기기를 삭제하시겠습니까?",
      icon: "warning",
      background: isDark ? "#262D33" : "white",
      color: isDark ? "white" : "black",
      showCancelButton: true,
      confirmButtonColor: isDark ? "#29325B" : "#9FA9D8",
      cancelButtonColor: "#B0B0B0",
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      reverseButtons: true,
    }).then((result) => {
      // 확인 버튼 클릭
      if (result.isConfirmed) {
        deleteRequest.mutate(dish.dishId);
        // 초기화
        handleInitInfo();
        Toast.fire({
          icon: "success",
          title: "삭제되었습니다.",
        });
      }
    });
  };
  const handleModifySerialNum = (e: React.MouseEvent<HTMLElement>) => {
    const Toast = Swal.mixin({
      toast: true, // 토스트 형식
      position: "bottom-end", // 알림 위치
      showConfirmButton: false, // 확인버튼 생성 유무
      timer: 1500, // 지속 시간
      timerProgressBar: true, // 지속시간바 생성 여부
      background: isDark ? "#262D33" : "white",
      color: isDark ? "white" : "black",
      width: "400px",
    });

    Toast.fire({
      icon: "warning",
      title: "시리얼 번호는 수정할 수 없습니다.",
    });
  };
  useEffect(() => {
    setIsRegist(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setDish({
        dishId: 0,
        dishAddress: "",
        dishLat: position.coords.latitude,
        dishLong: position.coords.longitude,
        dishName: "",
        dishSerialNum: "",
        file: "",
      });
      setDishSerialNum("");
      setDishAddress("");
      setDishName("");
      setImage("");
      setDishPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    setDishSerialNum(dish.dishSerialNum);
    setDishAddress(dish.dishAddress);
    setDishName(dish.dishName);
    setImage(dish.file);
    setImageUrl(dish.file);
    setDishPosition({
      lat: dish.dishLat,
      lng: dish.dishLong,
    });
  }, [dish]);

  return (
    <div className="flex flex-col w-full h-full relative">
      <h1 className="text-[1.3rem] font-bold">기기 등록</h1>
      {!isRegist ? (
        <>
          <div
            className="absolute right-[120px] top-3"
            onClick={handleInitInfo}
          >
            <DefaultButton content="초기화" />
          </div>
          <div className="absolute right-16 top-3" onClick={handleRegist}>
            <DefaultButton content={`${isRegist ? "등록" : "수정"}`} />
          </div>
          <div className="absolute right-2 top-3" onClick={handleDelete}>
            <button className="bg-ButtonDelete p-2 text-white rounded-xl opacity-70 hover:opacity-100">
              삭제
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className="absolute right-24 top-3"
            onClick={handleInitInfo}
          >
            <DefaultButton content="초기화" />
          </div>
          <div className="absolute right-6 top-3" onClick={handleRegist}>
            <DefaultButton content={`${isRegist ? "등록" : "수정"}`} />
          </div>
        </>
      )}
      <div className="relative flex flex-row w-full h-[100%] justify-center mt-4 mr-4 ml-4 gap-2">
        <div className="flex flex-col justify-around w-[95%]  h-[90%]  gap-3 text-[1rem] font-bold  mt-6 overflow-auto">
          <div className="h-12 mt-10 flex flex-row gap-4 ">
            <div className="w-[20%] h-12 border-b-LightMain border-b-[0.2rem] flex flex-wrap content-center dark:border-b-DarkMain">
              시리얼 번호
            </div>
            {isRegist ? (
              <input
                className="w-[70%] h-[100%] bg-LightInput rounded-lg pl-3 dark:bg-DarkInput"
                type="text"
                value={dishSerialNum}
                onChange={handleSerialNum}
              />
            ) : (
              <div
                className="w-[70%] h-[100%] bg-LightInput rounded-lg pl-3 dark:bg-DarkInput"
                onClick={handleModifySerialNum}
              >
                <input
                  className="h-full text-start"
                  type="text"
                  value={dishSerialNum}
                  onChange={handleSerialNum}
                  disabled={true}
                />
              </div>
            )}
          </div>
          <div className="h-12 flex flex-row gap-4">
            <div className="w-[20%] h-12 border-b-LightMain border-b-[0.2rem] flex flex-wrap content-center dark:border-b-DarkMain">
              냥그릇 이름
            </div>
            <input
              className="h-[100%] w-[70%] bg-LightInput rounded-lg pl-3 dark:bg-DarkInput"
              type="text"
              value={dishName}
              onChange={handleName}
            />
          </div>
          <div className="h-12 flex flex-row gap-4">
            <div className="w-[20%] h-12 border-b-LightMain border-b-[0.2rem] flex flex-wrap content-center dark:border-b-DarkMain">
              상세 주소
            </div>
            <input
              className="h-[100%] w-[70%]  bg-LightInput rounded-lg pl-3 dark:bg-DarkInput"
              type="text"
              value={dishAddress}
              onChange={handleAddress}
            />
          </div>
          <div className="flex flex-row gap-4 h-[15rem]">
            <div className="w-[20%] border-b-LightMain border-b-[0.2rem] flex flex-wrap content-center dark:border-b-DarkMain">
              사진 등록
            </div>
            <div
              className="w-[70%] h-[12rem] bg-LightInput relative rounded-lg dark:bg-DarkInput"
              onClick={() => file.current.click()}
            >
              {image ? (
                <div
                  className=" right-2 top-2 cursor-pointer absolute"
                  onClick={deleteImage}
                >
                  <CancelIcon sx={{ color: "white" }} />
                </div>
              ) : (
                <div
                  title="사진 선택"
                  className=" absolute inset-0 flex justify-center items-center cursor-pointer"
                >
                  <AddPhotoAlternateIcon sx={{ fontSize: "50px" }} />
                </div>
              )}
              {image && (
                <img
                  src={imageUrl}
                  alt="img1"
                  className="w-full h-full rounded-lg"
                />
              )}
              <input
                ref={file}
                className="hidden"
                type="file"
                accept="image/jpg,impge/png,image/jpeg,image/gif"
                onChange={imagePreview}
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className="w-[20%] border-b-LightMain border-b-[0.2rem] flex flex-wrap content-center dark:border-b-DarkMain">
              위치 설정
            </div>
            <div className="w-[70%] h-[12rem] bg-LightInput rounded-lg dark:bg-DarkInput">
              <RegistKakaoMap
                dishPosition={dishPosition}
                setDishPosition={setDishPosition}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
