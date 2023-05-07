import { defaultInstance, authInstance } from "../utils";

/**
 * 로그인
 * @param {FormData}
 */
export const login = async (formData: FormData) => {
  try {
    const res = await defaultInstance.post(`auth/login`, formData, {
      headers: { "Content-type": "multipart/form-data" },
    });

    const accessToken = res.data.data.accessToken;
    const refreshToken = res.data.data.refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } catch (e) {}
};

/**
 * 로그아웃
 */
export const logout = async () => {
  const refresh = localStorage.getItem("refreshToken");
  const access = localStorage.getItem("accessToken");
  const res = await authInstance.get(`auth/logout`);

  if (res.data.message === "SUCCESS") {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
  }
};
