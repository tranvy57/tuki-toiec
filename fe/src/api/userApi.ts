import api from "@/libs/axios-config";
import { ApiResponse } from "@/types";
import { IUser } from "@/types/implements";

export const getMyInfo = async () => {
  try {
    const response = await api.get<ApiResponse<IUser>>(`/users/my-info`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface UserUpdateRequest {
  displayName: string;
  zipcode: string;
  addressDetail: string;
  contact: string;
}

export const updateMe = async (body: UserUpdateRequest) => {
  try {
    const response = await api.put<ApiResponse<IUser>>(`/users/me`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface UserRegisterRequest {
  username: string;
  password: string;
  displayName: string;
  email: string;
}

export const register = async (body: UserRegisterRequest) => {
  try {
    const response = await api.post<ApiResponse<IUser>>(`/users`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
