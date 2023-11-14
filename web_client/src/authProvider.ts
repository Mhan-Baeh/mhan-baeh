import { AuthProvider } from "@pankod/refine-core";
import { axiosInstance } from "@pankod/refine-simple-rest";
import { REST_PUBLIC_URI } from "environment";

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const response = await axiosInstance.post(
      `${REST_PUBLIC_URI}/customer-api/api/login`,
      {
        email,
        password,
      }
    );
    if (response.status >= 200 && response.status < 300) {
      localStorage.setItem("auth_customer", response.data.access_token);
      return Promise.resolve("/");
    }

    return Promise.reject("/");
  },
  register: async ({ email, name, phone, password, confirmPassword }) => {
    const response = await axiosInstance.post(
      `${REST_PUBLIC_URI}/customer-api/api/register`,
      {
        email,
        name,
        phone,
        password,
        confirmPassword,
      }
    );
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve("/");
    }
    return Promise.reject("/");
  },
  checkAuth: () => {
    const user = localStorage.getItem("auth_customer");

    if (user) {
      return Promise.resolve("/");
    }

    return Promise.reject("/");
  },
  logout: async () => {
    localStorage.removeItem("auth_customer");
  },
  getPermissions: function (params?: any): Promise<any> {
    throw new Error("Function not implemented.");
  },
  checkError: function (error: any): Promise<void> {
    if (error.statusCode === 401) {
      localStorage.removeItem("auth_customer");
      return Promise.reject("/");
    }
    return Promise.resolve();
  },
};

export default authProvider;
