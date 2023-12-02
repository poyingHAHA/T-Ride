
type ErrorLoadingProps = {
  error: string;
  setError: (error: string) => any;
  loading: boolean;
  setLoading: (loading: boolean) => any;
};

const ErrorLoading = ({ error, setError, loading, setLoading }: ErrorLoadingProps) => {
  return <>
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
  </>
}

export default ErrorLoading;
