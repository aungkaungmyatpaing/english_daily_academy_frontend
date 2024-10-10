"use client";

const Achievement = () => {
  return (
    <div className="w-full h-auto px-16">
      <div className="w-full h-auto flex flex-col gap-5 ">
        <span className="text-2xl text-white font-bold">Your Achievement</span>
        <div className="w-full flex flex-col gap-5">
          <div className="w-full h-auto bg-white p-7 flex justify-between gap-5">
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center gap-5">
                <span className="text-xl text-black font-bold">
                  Special Course
                </span>{" "}
                <span className="text-gray-500">Level 1</span>
              </div>
              <div className="flex items-center ">
                <span className="text-xl text-black ">
                  Date of Completion : 17 Jan, 2024
                </span>{" "}
              </div>
            </div>
            <div className=" flex flex-col justify-end items-end">
              <button className="w-[10rem] btn btn-error text-white rounded-xl">
                View Detail
              </button>
            </div>
          </div>
          <div className="w-full h-auto bg-white p-7 flex justify-between gap-5">
            <div className="w-full flex flex-col gap-3">
              <div className="flex items-center gap-5">
                <span className="text-xl text-black font-bold">
                  Special Course
                </span>{" "}
                <span className="text-gray-500">Level 1</span>
              </div>
              <div className="flex items-center ">
                <span className="text-xl text-black ">
                  Date of Completion : 17 Jan, 2024
                </span>{" "}
              </div>
            </div>
            <div className=" flex flex-col justify-end items-end">
              <button className="w-[10rem] btn btn-error text-white rounded-xl">
                View Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Achievement;
