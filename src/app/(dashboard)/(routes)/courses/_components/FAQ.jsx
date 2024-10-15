"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const FAQ = () => {
  const session = useSession();
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState(null);
  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/login");
      toast.error("Unauthenticated. Please login.", {
        position: "top-right",
        theme: "dark",
      });
    }
  }, [session.status, router]);
  const BearerToken = session?.data?.accessToken;
  const [miniLoader, setMiniLoader] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (BearerToken) {
      fetchData();
    }
  }, [BearerToken]);

  const fetchData = async () => {
    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "faq",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      setData(response.data.data);
      setMiniLoader(false);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="w-full flex flex-col gap-5 px-20 ">
      <div className="w-full flex justify-start pl-10">
        <span className="text-xl font-bold text-white">
          Frequently Asked Question
        </span>
      </div>
      <div className="w-full flex flex-col gap-3">
        {miniLoader ? (
          <div className="w-full h-[20rem] rounded-3xl flex justify-center items-center">
            <span className="loading loading-ring loading-lg text-error"></span>
          </div>
        ) : (
          <>
            {data.length > 0 ? (
              <>
                {data.map((item, index) => (
                  <div key={index} className="w-full flex flex-col gap-2">
                    <div
                      onClick={() => toggleAnswer(index)}
                      className="w-full rounded-lg bg-white text-black py-2 px-10 cursor-pointer"
                    >
                      <i
                        className={`mr-5 text-error fa-regular fa-chevron-${
                          openIndex === index ? "up" : "down"
                        }`}
                      ></i>{" "}
                      {item.quest}
                    </div>
                    <div
                      className={`w-full rounded-lg bg-white text-black py-4 px-10 transition-all duration-500 ease-in-out overflow-hidden ${
                        openIndex === index
                          ? "block opacity-100"
                          : "hidden opacity-0"
                      }`}
                    >
                      {item.answer}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-[24rem]  flex justify-center items-center">
                <span className="text-xl text-error font-bold">No Data</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FAQ;
