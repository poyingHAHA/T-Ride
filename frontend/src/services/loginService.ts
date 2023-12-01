import {get, post, put, remove} from './APIHelper';
import { setTokenInCookie } from '../utils/cookieUtil';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId: number;
}

const userLogin = async (params: LoginRequest) => {
  try {
    const response: any = await post(
      `/user/login`, 
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status === 200 && response.data.token) {
      setTokenInCookie(response.data.token, 1);
    }

    console.log("login -> login response: ", response);
    return response;
  } catch (error) {
    console.log("login -> login error: ", error);
  }
}

export {
  userLogin
}