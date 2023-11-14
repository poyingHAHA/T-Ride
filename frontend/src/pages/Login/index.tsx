import { Form, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../slices/login";
import { useEffect } from "react";

const Login: React.FC = () => {
  const loginReducer = useAppSelector((state) => state.loginReducer);
  const loginStatus = loginReducer.loginStatus;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus) {
      window.location.href = "/selectRole";
    }
  }, [])

  return (
    <main className="bg-amber-200 flex flex-col items-center h-screen">
      <h1 className="text-black text-center text-4xl font-semibold leading-[52px] whitespace-nowrap mt-28 max-md:mt-10">
        登入
      </h1>
      <Form method="post" className="bg-white self-stretch flex w-full h-screen flex-col items-stretch mt-16 pt-40 pb-96 px-16 rounded-[50px_50px_0px_0px] max-md:max-w-full max-md:mt-10 max-md:px-5 max-md:py-24">
        <input type="account" placeholder="公司帳號" className="text-black text-lg leading-6 whitespace-nowrap bg-gray-200 px-3 py-4 rounded-xl" />
        <input type="password" placeholder="公司密碼" className="text-black text-lg leading-6 whitespace-nowrap bg-gray-200 px-3 py-4 rounded-xl mt-6" />
        <button
          className="text-white text-2xl leading-7 whitespace-nowrap bg-cyan-800 mb-0 items-center mt-6 px-5 py-3.5 rounded-xl max-md:mb-2.5"
          type="button"
          onClick={() => {
              dispatch(login(true))
              navigate("/selectRole")
          }}
        >
          登入
        </button>
      </Form>
    </main>
  );
}

export default Login;