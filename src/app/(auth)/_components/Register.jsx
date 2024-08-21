"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setMainLoading } from "@/store";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loginForm = false;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setMainLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const result = await signIn("credentials", {
      name,
      email,
      password,
      password_confirmation,
      loginForm,
      redirect: false,
    });
    if (result.ok === false) {
      setIsSubmitting(false);
      if (result.error) {
        try {
          const parsedError = JSON.parse(result.error.slice(6));
          parsedError.forEach((error) => {
            toast.error(`${error.label}: ${error.detail}`, {
              position: "top-right",
              theme: "dark",
            });
          });
        } catch (e) {
          // Handle unexpected error format
          toast.error("An unexpected error occurred. Please try again.", {
            position: "top-right",
            theme: "dark",
          });
        }
      }
    } else {
      // Handle success
      setIsSubmitting(false);
      toast.success("Registered successfully!", {
        position: "top-right",
        theme: "dark",
      });
      router.push("/");
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
        <Image
          src="/assets/images/logo_1.png"
          alt="Logo"
          width={200}
          height={200}
        />
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center gap-4 "
        >
          <label className="input input-bordered w-full text-base-100 rounded-lg flex items-center gap-4 bg-white">
            <Image
              src="/assets/images/form-user.png"
              alt="Logo"
              width={30}
              height={30}
            />
            <Image
              src="/assets/images/form-line.png"
              alt="Logo"
              width={3}
              height={3}
            />
            <input
              type="text"
              className="grow"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="input input-bordered text-base-100 w-full rounded-lg flex items-center gap-4 bg-white">
            <Image
              src="/assets/images/form-email.png"
              alt="Logo"
              width={30}
              height={30}
            />
            <Image
              src="/assets/images/form-line.png"
              alt="Logo"
              width={3}
              height={3}
            />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered text-base-100 w-full rounded-lg flex items-center gap-4 bg-white">
            <Image
              src="/assets/images/form-password.png"
              alt="Logo"
              width={30}
              height={30}
            />
            <Image
              src="/assets/images/form-line.png"
              alt="Logo"
              width={3}
              height={3}
            />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label className="input input-bordered text-base-100 w-full rounded-lg flex items-center gap-4 bg-white">
            <Image
              src="/assets/images/form-password.png"
              alt="Logo"
              width={30}
              height={30}
            />
            <Image
              src="/assets/images/form-line.png"
              alt="Logo"
              width={3}
              height={3}
            />
            <input
              type="password"
              className="grow"
              placeholder="Confirm Password"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </label>
          <div className="w-full flex justify-center items-center gap-4">
            <span className="font-light">
              Already register?{" "}
              <Link href="/login" className="font-bold">
                Login
              </Link>
            </span>
            <button
              type="submit"
              className="btn btn-error rounded-xl w-[8rem] text-white font-light"
              disabled={isSubmitting}
            >
              Sign Up{" "}
              {isSubmitting && (
                <span className="loading loading-spinner loading-md"></span>
              )}
            </button>
          </div>
        </form>
        <div className="w-full flex justify-center items-center">
          <div className="w-[50%] h-[1px] bg-base-content"></div>
          <span className=" text-error font-light mx-2">OR</span>
          <div className="w-[50%] h-[1px] bg-base-content"></div>
        </div>
        <button
          onClick={() => signIn("google")}
          className="w-full btn rounded-xl duration-300 bg-white hover:bg-error text-primary hover:text-white"
        >
          <Image
            src="/assets/images/google.png"
            alt="Logo"
            width={30}
            height={30}
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
