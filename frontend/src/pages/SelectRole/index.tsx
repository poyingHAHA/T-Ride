import { useNavigate } from "react-router-dom";

const SelectRole: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="justify-center items-center bg-white flex flex-col px-5 h-screen">
      <section className="flex w-[200px] max-w-full flex-col items-stretch max-md:my-10">
        <button
          className="text-white text-center text-2xl leading-7 whitespace-nowrap bg-black items-center px-5 py-3.5 rounded-xl"
          role="heading"
          onClick={() => {
            navigate("/driver")
          }}
        >
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3e298e40-b553-4f76-b8b1-a08db6706a8d?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&"
            className="aspect-square object-contain object-center w-full overflow-hidden mb-4 border-2 border-white"
            alt="Image description"
          />
          司機
        </button>

        <button
          className="text-white text-center text-2xl leading-7 whitespace-nowrap bg-black items-center mt-12 px-5 py-3.5 rounded-xl"
          role="heading"
          onClick={() => {
            navigate("/passenger")
          }}
        >
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/491036ed-98f8-4649-809b-ba37a1549ab2?apiKey=032020b8c72d4e8d99b0108e9d5ae3ba&"
            className="aspect-square object-contain object-center w-full overflow-hidden mb-4 border-2 border-white"
            alt="Image description"
          />
          乘客
        </button>
      </section>
    </div>
  );
}

export default SelectRole;