import { Form, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../slices/login";
import { userLogin } from "../../services/loginService"
import { useEffect, useState } from "react";
import { getTokenFromCookie } from "../../utils/cookieUtil";

const Login: React.FC = () => {
  const loginReducer = useAppSelector((state) => state.loginReducer);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      dispatch(login(true));
      navigate("/selectRole")
    }
  }, [])

  const loginHandler = async () => {
    setLoading(true);
    const loginResult = await userLogin({ username, password });
    // test
    // dispatch(login(true));
    // setLoading(false);
    // navigate("/selectRole")
    //======
    if (loginResult) {
      dispatch(login(true));
      setLoading(false);
      navigate("/selectRole")
    } else {
      setError("帳號或密碼錯誤");
      setLoading(false);
    }
  }

  return (
    <main className="bg-amber-200 flex flex-col items-center h-screen">
      <h1 className="text-black text-center text-4xl font-semibold leading-[52px] whitespace-nowrap mt-28 max-md:mt-10">
        登入
      </h1>
      <Form method="post" className="bg-white self-stretch flex w-full h-screen flex-col items-stretch mt-16 pt-40 pb-96 px-16 rounded-[50px_50px_0px_0px] max-md:max-w-full max-md:mt-10 max-md:px-5 max-md:py-24">
        <input
          type="account"
          placeholder="公司帳號"
          className="text-black text-lg leading-6 whitespace-nowrap bg-gray-200 px-3 py-4 rounded-xl"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="公司密碼"
          className="text-black text-lg leading-6 whitespace-nowrap bg-gray-200 px-3 py-4 rounded-xl mt-6"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="text-white text-2xl leading-7 whitespace-nowrap bg-cyan-800 mb-0 items-center mt-6 px-5 py-3.5 rounded-xl max-md:mb-2.5"
          type="button"
          onClick={loginHandler}
        >
          登入
        </button>
      </Form>
      {
        loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-xl flex flex-col justify-center items-center p-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
              <div className="mt-4 text-gray-900 text-xl">登入中</div>
            </div>
          </div>
        )
      }
      {
        error && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-xl flex flex-col justify-center items-center p-8">
              <div className="text-gray-900 text-xl">{error}</div>
              <button
                className="text-white text-2xl leading-7 whitespace-nowrap bg-cyan-800 mb-0 items-center mt-6 px-5 py-3.5 rounded-xl max-md:mb-2.5"
                type="button"
                onClick={() => setError("")}
              >
                確定
              </button>
            </div>
          </div>
        )
      }
    </main>
  );
}

export default Login;