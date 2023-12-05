import axios from "axios";

const APIHelper = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  // withCredentials: true, // send to server all HttpOnly cookies
});

// // Add a request interceptor to handle request Error
// const requestErrorHandler = (error: any) => {
//   console.log("requestErrorHandler: ", error);
//   if (axios.isCancel(error)) {
//     console.log('Request canceled:', error.message);
//   }
//   return Promise.reject(error);
// }

// const responseHandler = (response: any) => {
//   return response.data;
// }

// // Add a response interceptor to handle response Error
// const responseErrorHandler = (error: any) => {
//   console.log("responseErrorHandler: ", error);
//   return Promise.reject(error);
// }

// 檢測有無 token，沒有的話就取消 request
// const requestInterceptor = (config: any) => {
//   const controller = new AbortController();
//   config.signal = controller.signal;
//   controller.signal.addEventListener("abort", () => {}, { once: true });
//   if(!config.headers["Authorization"]) {
//     controller.abort();
//   }
//   return config;
// }

// APIHelper.interceptors.request.use(requestInterceptor, requestErrorHandler);
// APIHelper.interceptors.request.use(requestErrorHandler);
// APIHelper.interceptors.response.use(responseHandler, responseErrorHandler);

const get = (url: string, config?: any) => {
  return new Promise((resolve, reject) => {
    APIHelper.get(url, config)
      .then((response) => { resolve(response); })
      .catch((error) => { reject(error); })
  })
}

const post = (url: string, data?: any, config?: any) => {
  return new Promise((resolve, reject) => {
    APIHelper.post(url, data, config)
      .then((response) => { resolve(response); })
      .catch((error) => { reject(error); })
  })
}

const put = (url: string, data?: any, config?: any) => {
  return new Promise((resolve, reject) => {
    APIHelper.put(url, data, config)
      .then((response) => { resolve(response); })
      .catch((error) => { reject(error); })
  })
}

const remove = (url: string, config?: any) => {
  return new Promise((resolve, reject) => {
    APIHelper.delete(url, config)
      .then((response) => { resolve(response); })
      .catch((error) => { reject(error); })
  })
}

export {
  get,
  post,
  put,
  remove
};