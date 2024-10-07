"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { setMainLoading } from "@/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AboutUs = () => {
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMainLoading(false));
  }, []);

  const [miniLoader, setMiniLoader] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "about"
      );
      setData(response.data.data);
      setMiniLoader(false);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
              <div className="w-full h-auto flex flex-col gap-20 bg-white rounded-xl p-24">
                <div className="w-full flex flex-col gap-5">
                  <span className=" text-xl text-error font-bold">
                    ABOUT US
                  </span>
                  <p className="text-black text-lg">
                    {data.length > 0 ? (
                      <>{data[0].content}</>
                    ) : (
                      <>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Laudantium cumque asperiores nihil quos maxime illo,
                        molestiae nesciunt placeat deserunt impedit, nulla
                        consequuntur suscipit ratione obcaecati! Accusantium hic
                        totam minima quos.
                      </>
                    )}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-5">
                  <span className=" text-xl text-error font-bold">
                    THANK YOU
                  </span>
                  <p className="text-black text-lg">
                    {data.length > 0 && data[0].optional_content ? (
                      <>{data[0].optional_content}</>
                    ) : (
                      <>
                        Invest in yourself. The best investment is the
                        investment for yourself
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default AboutUs;
