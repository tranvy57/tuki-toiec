import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { api } from '~/libs/axios';
import { save } from '~/libs/secure-store';
import { LoginReqType } from '~/types/request/loginReq';
import { LoginResponse } from '~/types/response/LoginResponse';

const Login = async (LoginReq: LoginReqType) => {
  try {
    const res: AxiosResponse<LoginResponse> = await api.post('/auth/login', LoginReq);
    // console.log(res.data.data.token);
    await save('token', res.data.data.token);
    await save('user', JSON.stringify(res.data.data.user));
    return res.data.data;
  } catch (error) {
    return null;
  }
};

export const useAuth = () => {
  return useMutation({
    mutationFn: (LoginReq: LoginReqType) => Login(LoginReq),
  });
};
