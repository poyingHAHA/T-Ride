import {get, post, put, remove} from './APIHelper';

interface LoginRequest {
  username: string;
  password: string;
}

const userLogin = async (params: LoginRequest) => {
  try {
    const response = await post(
      `/user/login`, 
      JSON.stringify(params),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("login -> login response: ", response);
    return response;
  } catch (error) {
    console.log("login -> login error: ", error);
  }
}

export {
  userLogin
}