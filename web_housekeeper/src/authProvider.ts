import { AuthProvider } from "@pankod/refine-core";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URI } from "environment";

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const response = await axiosInstance.post(
      `${REST_PUBLIC_URI}/api/housekeeper/login`,
      {
        email,
        password,
      }
    );

    if (response.status === 200) {
      localStorage.setItem("auth", JSON.stringify(response.data));
      return Promise.resolve("/");
    }

    return Promise.reject("/");
  },
  checkAuth: () => {
    const user = localStorage.getItem("auth");

    if (user) {
      return Promise.resolve("/");
    }

    return Promise.reject("/");
  },
  logout: async () => {
    localStorage.removeItem("auth");
  },
  getPermissions: function (params?: any): Promise<any> {
    throw new Error("Function not implemented.");
  },
  checkError: function (error: any): Promise<void> {
    if (error.statusCode === 401) {
      localStorage.removeItem("auth");
      return Promise.reject("/");
    }
    return Promise.resolve();
  },
};

export default authProvider;
