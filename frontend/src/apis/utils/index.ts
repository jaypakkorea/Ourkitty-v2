import axios from "axios";
import { error } from "console";

const BASE_URL = process.env.REACT_APP_API_URL;
const AI_BASE_URL = process.env.REACT_APP_AI_API_URL;

const axiosApi = (baseURL: any) => {
  const instance = axios.create({
    baseURL,
    // withCredentials: true, // 유저 정보 확인(백엔드에서도 설정 필요)
  });
  return instance;
};

const axiosAuthApi = (baseURL: any) => {
  const instance = axios.create({
    baseURL,
    // withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      const access_token = localStorage.getItem("accessToken");
      if (access_token) {
        config.headers.Authorization = "Bearer " + access_token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      if (status === 403) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
  );

  return instance;
};

export const defaultInstance = axiosApi(BASE_URL);
export const authInstance = axiosAuthApi(BASE_URL);
export const aiInstance = axiosApi(AI_BASE_URL);
