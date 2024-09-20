"use client";

import { fetchUserData } from "@/app/api/user";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { setMainLoading } from "@/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CourseDetailPage = ({ courseId }) => {
  console.log("courseId", courseId);

  const session = useSession();
  const [miniLoader, setMiniLoader] = useState(true);
  const BearerToken = session?.data?.accessToken;
  const [data, setData] = useState([]);
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);
  const dispatch = useDispatch();
  const [enrollValue, setEnrollValue] = useState(null);

  useEffect(() => {
    fetchUserData(BearerToken)
      .then((response) => {
        console.log(response);

        setEnrollValue(response.data.enroll);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
    fetchData(courseId);
  }, [BearerToken]);

  const fetchData = async (courseId) => {
    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "course",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            // is_premium: 0,
            id: courseId,
          },
        }
      );
      setData(response.data.data.courses);
      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setMainLoading(false));
    }
  };

  useEffect(() => {
    console.log("data", data);
  }, [data]);

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
            <div className="w-full h-full p-20 mb-10 flex flex-col gap-10 justify-center items-center">
              <div className="w-full flex justify-start items-center">
                <Link
                  href={`/courses`}
                  className="btn btn-ghost border-error rounded-lg text-error"
                >
                  <i className="fa-regular fa-angle-left"></i> Back
                </Link>
              </div>
              {miniLoader ? (
                <>
                  <div className="w-full h-[20rem] text-error flex justify-center items-center">
                    <span className="loading loading-ring loading-lg"></span>
                  </div>
                </>
              ) : (
                <>
                  {data.length > 0 ? (
                    <div className="w-full grid grid-cols-3">
                      <div className="w-full flex flex-col gap-5 col-span-2">
                        <div className="w-full flex justify-start">
                          <span className="text-2xl text-white font-bold">
                            Free Course
                          </span>
                        </div>
                        <div className="w-full flex justify-start items-center gap-10 text-center">
                          <span className="text-xl font-bold text-white">
                            Description
                          </span>
                          <span className="bg-error px-8 rounded-full text-xl font-bold text-white">
                            Instructor
                          </span>
                          <span className="text-xl text-white">
                            {data[0].instructor_name ?? "N/A"}
                          </span>
                        </div>
                        <div className="w-full h-auto">
                          <p>{data[0].description ?? "N/A"}</p>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-5 px-10 col-span-1">
                        <div className="w-full bg-base-content h-[16rem] border-[3px] overflow-hidden hover:border-error duration-700">
                          <div className="w-full h-full">
                            <img
                              src={data[0].image}
                              alt={data[0].name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        {data[0].is_premium == true ? (
                          <>
                            {enrollValue && enrollValue == true ? (
                              <button className="w-full btn btn-error rounded-lg text-white">
                                View Course Outline
                              </button>
                            ) : (
                              <button className="w-full btn btn-error rounded-lg text-white">
                                Upgrade Premium
                              </button>
                            )}
                          </>
                        ) : (
                          <button className="w-full btn btn-error rounded-lg text-white">
                            View Course Outline
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>No Data</>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default CourseDetailPage;
