// src/components/SomeComponent.js
"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { setMainLoading } from "@/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FreeLesson from "./_components/FreeLesson";
import PremiumCourse from "./_components/PremiumCourse";
import LevelTest from "./_components/LevelTest";
import Library from "./_components/Library";
import Shop from "./_components/Shop";
import FAQ from "./_components/FAQ";
import { motion, AnimatePresence } from "framer-motion";

const Course = () => {
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);
  const dispatch = useDispatch();

  const [Tab, setTab] = useState(1);

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
              <div className="w-full mt-[4rem] h-full gap-10 grid grid-cols-4 ">
                <div className="w-full flex flex-col gap-5 col-span-1">
                  <div
                    onClick={() => setTab(1)}
                    className={`w-full flex justify-start pl-8 items-center h-[3.5rem] ${
                      Tab === 1
                        ? "bg-white text-error"
                        : "bg-error text-white hover:bg-opacity-50"
                    }  duration-300`}
                  >
                    <span className=" text-xl font-bold">Free Lesson</span>
                  </div>
                  <div
                    onClick={() => setTab(2)}
                    className={`w-full flex justify-start pl-8 items-center h-[3.5rem] ${
                      Tab === 2
                        ? "bg-white text-error"
                        : "bg-error text-white hover:bg-opacity-50"
                    }  duration-300`}
                  >
                    <span className=" text-xl font-bold">Premium Courses</span>
                  </div>
                  <div
                    onClick={() => setTab(3)}
                    className={`w-full flex justify-start pl-8 items-center h-[3.5rem] ${
                      Tab === 3
                        ? "bg-white text-error"
                        : "bg-error text-white hover:bg-opacity-50"
                    }  duration-300`}
                  >
                    <span className=" text-xl font-bold">Level Test</span>
                  </div>
                  <div
                    onClick={() => setTab(4)}
                    className={`w-full flex justify-start pl-8 items-center h-[3.5rem] ${
                      Tab === 4
                        ? "bg-white text-error"
                        : "bg-error text-white hover:bg-opacity-50"
                    }  duration-300`}
                  >
                    <span className=" text-xl font-bold">Library</span>
                  </div>
                  <div
                    onClick={() => setTab(5)}
                    className={`w-full flex justify-start pl-8 items-center h-[3.5rem] ${
                      Tab === 5
                        ? "bg-white text-error"
                        : "bg-error text-white hover:bg-opacity-50"
                    }  duration-300`}
                  >
                    <span className=" text-xl font-bold">Shop</span>
                  </div>
                  <div
                    onClick={() => setTab(6)}
                    className={`w-full flex justify-start pl-8 items-center h-[3.5rem] ${
                      Tab === 6
                        ? "bg-white text-error"
                        : "bg-error text-white hover:bg-opacity-50"
                    }  duration-300`}
                  >
                    <span className=" text-xl font-bold">FAQ</span>
                  </div>
                </div>
                <div className="w-full h-full col-span-3">
                  {Tab === 1 && <FreeLesson />}
                  {Tab === 2 && <PremiumCourse />}
                  {Tab === 3 && <LevelTest />}
                  {Tab === 4 && <Library />}
                  {Tab === 5 && <Shop />}
                  {Tab === 6 && <FAQ />}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default Course;
