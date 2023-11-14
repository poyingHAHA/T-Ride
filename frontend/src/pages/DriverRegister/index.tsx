
const DriverRegister: React.FC = () => {
  return (
    <section className="bg-amber-200 flex flex-col items-center h-full overflow-hidden">
      <h1 className="text-black text-center text-4xl font-semibold leading-[52px] whitespace-nowrap mt-28 max-md:mt-10">
        司機註冊
      </h1>
      <div className="bg-white flex flex-col justify-around self-stretch w-full h-[70vh] items-stretch mt-16 pt-16 pb-72 px-16 rounded-[50px_50px_0px_0px] max-md:max-w-full max-md:mt-10 max-md:pb-24 max-md:px-5">
        <input className="text-black text-lg leading-6 whitespace-nowrap bg-gray-200 px-3 py-4 rounded-xl" placeholder="車型" />
        <input className="text-black text-lg leading-6 whitespace-nowrap bg-gray-200 px-3 py-4 rounded-xl" placeholder="車牌" />
        <input className="text-black text-lg leading-6 whitespace-nowrap bg-gray-200 px-3 py-4 rounded-xl" placeholder="可載人數" />
        
        <div className="flex-col text-black text-lg leading-6 relative whitespace-nowrap overflow-hidden">
          <label htmlFor="driverLicense">駕照: </label>
          <input
            type="file"
            id="driverLicense"
            className="w-full"
          />
        </div>

        <button
          className="text-white text-2xl leading-7 whitespace-nowrap bg-cyan-800 mb-0 items-center px-5 py-3.5 rounded-xl"
        >
          完成註冊
        </button>
      </div>
    </section>
  );
}

export default DriverRegister;