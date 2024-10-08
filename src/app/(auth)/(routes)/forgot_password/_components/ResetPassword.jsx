"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = (email) => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "reset_password",
        { password: password, email: email.email }
      );
      console.log(response);
      if (response.data.status == "success") {
        toast.success("Password reset successfully", {
          position: "top-right",
          theme: "dark",
        });
        router.push("/login");
      }
    } catch (error) {
      setIsSubmitting(false);
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

      //   console.error("Error adding to cart:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full py-10 px-14 flex flex-col justify-between items-start bg-white h-auto gap-10 rounded-xl">
      <span className="text-black text-xl">Set New Password?</span>
      <span className="text-xs text-gray-500">
        Please Enter your new password
      </span>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-start gap-4 "
      >
        <label className="text-black">Password</label>
        <label className="input input-bordered text-gray-500 shadow-lg w-full rounded-lg flex items-center gap-4 bg-white">
          <input
            type="password"
            className="grow"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="w-full btn btn-error rounded-lg text-white">
          Send
        </button>
      </form>
    </div>
  );
};
export default ResetPassword;
