"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { setMainLoading } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Account from "./_components/Account";
import Progress from "./_components/Progress";
import Achievement from "./_components/Achievement";
import PaymentHistory from "./_components/PaymentHistory";
import { useSession } from "next-auth/react";

const Profile = () => {
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);
  const dispatch = useDispatch();

  const session = useSession();
  const BearerToken = session?.data?.accessToken;

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
                <div className="w-full flex flex-col gap-1 col-span-1">
                  <div
                    onClick={() => setTab(1)}
                    className="w-full flex justify-start gap-5 pl-8 items-center h-[3rem] bg-white text-black cursor-pointer"
                  >
                    <div className="block">
                      {Tab === 1 && (
                        <Image
                          src="/assets/images/form-line.png"
                          alt="Logo"
                          width={3}
                          height={3}
                        />
                      )}
                    </div>

                    <span className=" text-lg ">Account</span>
                  </div>
                  <div
                    onClick={() => setTab(2)}
                    className="w-full flex justify-start pl-8 items-center bg-white text-black gap-5 h-[3rem] cursor-pointer"
                  >
                    <div className="block">
                      {Tab === 2 && (
                        <Image
                          src="/assets/images/form-line.png"
                          alt="Logo"
                          width={3}
                          height={3}
                        />
                      )}
                    </div>

                    <span className=" text-lg ">Progress</span>
                  </div>
                  <div
                    onClick={() => setTab(3)}
                    className="w-full flex justify-start pl-8 items-center h-[3rem] bg-white text-black gap-5 cursor-pointer"
                  >
                    <div className="block">
                      {Tab === 3 && (
                        <Image
                          src="/assets/images/form-line.png"
                          alt="Logo"
                          width={3}
                          height={3}
                        />
                      )}
                    </div>
                    <span className=" text-lg ">Achievement</span>
                  </div>
                  <div
                    onClick={() => setTab(4)}
                    className="w-full flex justify-start pl-8 items-center h-[3rem] bg-white text-black gap-5 cursor-pointer"
                  >
                    <div className="block">
                      {Tab === 4 && (
                        <Image
                          src="/assets/images/form-line.png"
                          alt="Logo"
                          width={3}
                          height={3}
                        />
                      )}
                    </div>
                    <span className=" text-lg ">Payment History</span>
                  </div>
                  <div className="w-full flex justify-center items-center h-[3rem] bg-error text-white gap-5  mt-3 cursor-pointer">
                    <span className=" text-lg ">
                      Sign Out{" "}
                      <i className="ml-2 fa-regular fa-right-from-bracket"></i>
                    </span>
                  </div>
                </div>
                <div className="w-full h-full col-span-3">
                  {Tab === 1 && <Account />}
                  {Tab === 2 && <Progress />}
                  {Tab === 3 && <Achievement />}
                  {Tab === 4 && <PaymentHistory />}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};
export default Profile;
