"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { setMainLoading } from "@/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Subscription from "./_components/Subscription";

const Pricing = () => {
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);
  const dispatch = useDispatch();
  const session = useSession();
  const BearerToken = session?.data?.accessToken;
  const [data, setData] = useState([]);
  const [miniLoader, setMiniLoader] = useState(true);
  const [Tab, setTab] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "plan",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          // params: {
          //   is_premium: 0,
          //   limit: 6,
          //   page: page,
          // },
        }
      );
      setData(response.data.data);
      console.log(response);

      // setTotalPages(response.data.data.pagination.last_page);
      // setTotalItems(response.data.data.pagination.total);
      setMiniLoader(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (BearerToken) {
      fetchData();
    }
  }, [BearerToken]);

  useEffect(() => {
    dispatch(setMainLoading(false));
  }, []);
  return (
    <>
      {mainLoading ? (
        <LoadingIndicator />
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ delay: 0.23 }}
          >
            <div className="w-full h-full p-20 mb-10 flex justify-center items-center">
              {Tab === 1 && (
                <>
                  {miniLoader ? (
                    <div className="w-full h-screen flex justify-center items-center">
                      <span className="loading loading-ring loading-lg text-error"></span>
                    </div>
                  ) : (
                    <div className="w-full h-auto flex flex-col gap-10">
                      <div className="w-full flex flex-col justify-center items-center gap-10">
                        <span className=" uppercase border-l-4 text-xl border-error pl-2">
                          Premium Subscription
                        </span>
                        <div className="w-[100%] h-auto  flex overflow-x-scroll gap-12">
                          <div className="w-[30%] cursor-not-allowed h-[30rem] rounded3xl overflow-hidden bg-white rounded-3xl flex flex-col flex-shrink-0">
                            <div className="flex gap-5 h-full px-5 ">
                              <div className="h-full">
                                <i className="fa-solid fa-bookmark text-[3rem] leading-10 text-error"></i>
                              </div>
                              <div className="w-full flex flex-col justify-between py-8">
                                <span className="text-base-300">Free</span>
                                <span className="text-gray-500">
                                  Free for all
                                </span>
                                <span className="text-2xl font-bold text-base-300">
                                  0 MMK / Month
                                </span>
                                <div className="w-full flex flex-col text-gray-500 h-[6rem] overflow-y-scroll gap-3">
                                  {data.length > 0 && (
                                    <>
                                      {data.map((item, index) => (
                                        <span
                                          key={index}
                                          className="border-l-2 border-error pl-2"
                                        >
                                          {item.name} premium courses
                                        </span>
                                      ))}
                                    </>
                                  )}
                                </div>

                                <span className="text-gray-500 border-l-2 border-success pl-2">
                                  Free course
                                </span>
                                <span className="text-gray-500 border-l-2 border-success pl-2">
                                  Free test
                                </span>
                                <span className="text-gray-500 border-l-2 border-success pl-2">
                                  Free book
                                </span>
                                <span className="text-gray-500 border-l-2 border-error pl-2">
                                  Certificate
                                </span>
                              </div>
                            </div>
                            <div className="w-full flex justify-end">
                              <div className="w-[10rem] h-[2.5rem] bg-green-400 rounded-tl-3xl flex justify-center items-center">
                                <span className="text-white">Enroll</span>
                              </div>
                            </div>
                          </div>
                          {data.length > 0 && (
                            <>
                              {data.map((plan, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    setSelectedPlan(plan), setTab(2);
                                  }}
                                  className="w-[30%] cursor-pointer hover:scale-95 duration-300 h-[30rem] rounded3xl overflow-hidden bg-white rounded-3xl flex flex-col flex-shrink-0"
                                >
                                  <div className="flex gap-5 h-full px-5 ">
                                    <div className="h-full">
                                      <i className="fa-solid fa-bookmark text-[3rem] leading-10 text-error"></i>
                                    </div>
                                    <div className="w-full flex flex-col justify-between py-8">
                                      <span className="text-base-300">
                                        {plan.name}
                                      </span>
                                      <span className="text-gray-500">
                                        Good for testing out
                                      </span>
                                      <span className="text-2xl font-bold text-base-300">
                                        {plan.price} MMK / Month
                                      </span>
                                      <div className="w-full flex flex-col text-gray-500 h-[6rem] overflow-y-scroll gap-3">
                                        {data.map((item, index) => (
                                          <span
                                            key={item.id}
                                            className={` border-l-2 ${
                                              plan.id === item.id
                                                ? "border-green-400"
                                                : plan.duration >= item.duration
                                                ? "border-green-400"
                                                : "border-error"
                                            } pl-2`}
                                          >
                                            {item.name} premium courses
                                          </span>
                                        ))}
                                      </div>

                                      <span className="text-gray-500 border-l-2 border-success pl-2">
                                        Free course
                                      </span>
                                      <span className="text-gray-500 border-l-2 border-success pl-2">
                                        Free test
                                      </span>
                                      <span className="text-gray-500 border-l-2 border-success pl-2">
                                        Free book
                                      </span>
                                      <span className="text-gray-500 border-l-2 border-error pl-2">
                                        Certificate
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full flex justify-end">
                                    <div className="w-[10rem] h-[2.5rem] bg-green-400 rounded-tl-3xl flex justify-center items-center">
                                      <span className="text-white">Enroll</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="w-full flex flex-col justify-center items-center gap-10">
                        <span className=" uppercase border-l-4 text-xl border-error pl-2">
                          How To Pay?
                        </span>
                        <div className="w-full h-auto  grid grid-cols-4 gap-5">
                          <div className="w-full h-[6rem] border-l-4 border-error rounded3xl overflow-hidden bg-white flex flex-col justify-center items-center gap-3 flex-shrink-0">
                            <span className="text-xl text-black">Step 1</span>
                            <span className="text-gray-500">
                              Transfer money
                            </span>
                          </div>
                          <div className="w-full h-[6rem] border-l-4 border-error rounded3xl overflow-hidden bg-white flex flex-col justify-center items-center gap-3 flex-shrink-0">
                            <span className="text-xl text-black">Step 1</span>
                            <span className="text-gray-500">
                              Take screenshot of transition
                            </span>
                          </div>
                          <div className="w-full h-[6rem] border-l-4 border-error rounded3xl overflow-hidden bg-white flex flex-col justify-center items-center gap-3 flex-shrink-0">
                            <span className="text-xl text-black">Step 1</span>
                            <span className="text-gray-500">
                              Upload the screenshot{" "}
                            </span>
                          </div>
                          <div className="w-full h-[6rem] border-l-4 border-error rounded3xl overflow-hidden bg-white flex flex-col justify-center items-center gap-3 flex-shrink-0">
                            <span className="text-xl text-black">Step 1</span>
                            <span className="text-gray-500">
                              Waiting for approval
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              {Tab === 2 && (
                <Subscription
                  Data={selectedPlan}
                  Datas={data}
                  BearerToken={BearerToken}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default Pricing;
