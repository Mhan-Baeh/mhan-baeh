import { AuthProvider } from "@pankod/refine-core";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URL } from "environment";

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const response = await axiosInstance.post(
      `${REST_PUBLIC_URL}/api/login`,
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
  register: async ({ email, name, phone, password, confirmPassword }) => {
    const response = await axiosInstance.post(
      `${REST_PUBLIC_URL}/api/register`,
      {
        email,
        name,
        phone,
        password,
        confirmPassword
      }
    );
    if (response.status === 200) {
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
    const response = await axiosInstance.post(
      `${REST_PUBLIC_URL}/api/logout`
    );
    if (response.status === 200) {
      localStorage.removeItem("auth");
      return Promise.resolve("/");
    }

    return Promise.reject("/");
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
