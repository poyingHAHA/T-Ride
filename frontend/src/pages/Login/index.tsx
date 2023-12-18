import { Form, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../slices/login";
import { userLogin } from "../../services/loginService"
import { useEffect, useState } from "react";
import { getTokenFromCookie } from "../../utils/cookieUtil";
import ErrorLoading from "../../components/ErrorLoading";
import { IoCarSport } from "react-icons/io5";

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
    <main className="bg-white flex flex-col items-center h-screen">
      <div className="flex flex-col justify-center items-center w-[100%] h-[60%]">
        <IoCarSport className="w-[50%] h-[50%]" />
        <p className="text-xl font-bold">T-Ride</p>
      </div>
      <Form method="post" className="bg-white self-stretch flex w-full h-screen flex-col px-8 rounded-[50px_50px_0px_0px]">
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
          className="text-white text-2xl leading-7 whitespace-nowrap bg-black mb-0 items-center mt-6 px-5 py-3.5 rounded-xl max-md:mb-2.5"
          type="button"
          onClick={loginHandler}
        >
          登入
        </button>
      </Form>
      <ErrorLoading error={error} setError={setError} loading={loading} setLoading={setLoading} />
    </main>
  );
}

export default Login;