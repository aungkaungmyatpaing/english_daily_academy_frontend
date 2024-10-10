"use client";

import Image from "next/image";

const Progress = () => {
  return (
    <div className="w-full h-auto px-16">
      <div className="w-full h-auto flex flex-col gap-10 ">
        <span className="text-2xl text-white font-bold">Your Progress</span>
        <div className="w-full flex flex-col gap-10">
          <div className="w-full h-auto border-2 border-base-content rounded-xl p-7 flex gap-5">
            <div className="w-[15%] flex justify-center items-start">
              <Image
                src="/assets/images/award-line.png"
                alt="Logo"
                width={60}
                height={60}
              />
            </div>
            <div className="w-full flex flex-col items-start gap-5">
              <span className="text-2xl">Free Course 1 completed</span>
              <span className="text-2xl text-gray-500">Grade: 100%</span>
            </div>
          </div>
          <div className="w-full h-auto border-2 border-base-content rounded-xl p-7 flex gap-5">
            <div className="w-[15%] flex justify-center items-start">
              <Image
                src="/assets/images/award-line.png"
                alt="Logo"
                width={60}
                height={60}
              />
            </div>
            <div className="w-full flex flex-col items-start gap-5">
              <span className="text-2xl">Free Course 1 completed</span>
              <div className="w-full flex items-center gap-10">
                <div className="w-[20%]">
                  <span className="text-xl">
                    <i className="fa-regular fa-clapperboard-play text-error mr-4"></i>
                    Videos
                  </span>
                </div>
                <div className="flex gap-5 justify-center items-center">
                  <progress
                    className="progress progress-error w-56 rounded-lg"
                    value="70"
                    max="100"
                  ></progress>
                  <span className="text-gray-500">70%</span>
                </div>
              </div>
              <div className="w-full flex items-center gap-10">
                <div className="w-[20%]">
                  <span className="text-xl">
                    <i class="fa-regular fa-circle-question text-error mr-4"></i>
                    Quiz
                  </span>
                </div>
                <div className="flex gap-5 justify-center items-center">
                  <progress
                    className="progress progress-error w-56 rounded-lg"
                    value="25"
                    max="100"
                  ></progress>
                  <span className="text-gray-500">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Progress;
