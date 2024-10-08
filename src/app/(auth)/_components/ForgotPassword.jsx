"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import OTPVerification from "../(routes)/forgot_password/_components/OTP";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openOTP, setOpenOTP] = useState(false);

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "forgot_password",
        { email: email }
      );
      console.log(response);
      if (response.data.status == "success") {
        toast.success("OTP Sent to your email", {
          position: "top-right",
          theme: "dark",
        });
        setOpenOTP(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`${error.response.data.message || "Submit failed"}`, {
            position: "top-right",
            theme: "dark",
          });
        } else if (error.request) {
          toast.error("No response from server. Please try again.", {
            position: "top-right",
            theme: "dark",
          });
        } else {
          toast.error(`Request error: ${error.message}`, {
            position: "top-right",
            theme: "dark",
          });
        }
      } else {
        toast.error("An unexpected error occurred.", {
          position: "top-right",
          theme: "dark",
        });
      }

      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[50%] flex flex-col px-20 gap-10 justify-center items-center">
        <div className="w-full flex justify-center items-center">
          <div className="border-l-[3px] border-error pl-2">
            <span className="text-2xl">JOIN ENGLISH DALIY ACADEMY</span>
          </div>
        </div>
        {/* <Image
          src="/assets/images/logo_1.png"
          alt="Logo"
          width={200}
          height={200}
        /> */}
        {openOTP ? (
          <OTPVerification />
        ) : (
          <div className="w-full py-10 px-14 flex flex-col justify-between items-start bg-white h-auto gap-10 rounded-xl">
            <span className="text-black text-xl">Forgot Password?</span>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col items-start gap-4 "
            >
              <label className="text-black">Email</label>
              <label className="input input-bordered text-gray-500 shadow-lg w-full rounded-lg flex items-center gap-4 bg-white">
                <input
                  type="email"
                  className="grow"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <span className="text-xs text-gray-500">
                Enter your email account and request OTP code to recover your
                password
              </span>
              <button className="w-full btn btn-error rounded-lg text-white">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
