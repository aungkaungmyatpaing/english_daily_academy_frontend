import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ResetPassword from "./ResetPassword";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [openPasswordReset, setOpenPasswordReset] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resUserData, setResUserData] = useState(null);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, ""); // Ensure only numbers
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input if filled
      if (element.nextSibling && value) {
        element.nextSibling.focus();
      }
    }
  };

  const handleKeyDown = (element, index) => {
    // Handle backspace to clear the input and move focus to the previous input
    if (element.key === "Backspace") {
      if (otp[index] === "") {
        if (element.target.previousSibling) {
          element.target.previousSibling.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = ""; // Clear the current value
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("Submitted OTP:", otpCode);
    // Handle OTP submission logic
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "otp",
        { otp: otpCode }
      );
      console.log(response);
      if (response.data.status == "success") {
        toast.success("OTP Sent to your email", {
          position: "top-right",
          theme: "dark",
        });
        console.log("setResUserData", response.data.data);

        setResUserData(response.data.data);
        setOpenPasswordReset(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {openPasswordReset && resUserData ? (
        <ResetPassword email={resUserData.email} />
      ) : (
        <div className="w-full bg-black flex flex-col items-center justify-center">
          <div className="bg-white py-8 px-10 rounded-lg shadow-lg w-full max-w-md text-center">
            <div className="w-full flex flex-col items-start">
              <h1 className="text-xl text-black font-bold mb-4">
                Verification
              </h1>
              <p className="mb-6 text-gray-500">
                Sent OTP code to your email. Please check.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex justify-between mb-6 text-black">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={value}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 bg-transparent text-center text-xl border-b-4 border-red-500 focus:outline-none focus:border-red-700"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="btn btn-error text-white w-full rounded-xl"
              >
                Next{" "}
                {isSubmitting && (
                  <span className="loading loading-spinner loading-md"></span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OTPVerification;
