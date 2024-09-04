"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { setMainLoading } from "@/store";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = ({ cms }) => {
  const dispatch = useDispatch();
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);

  const banner = cms.cms.banner;
  const testimonail = cms.cms.testimonail;
  const faqs = cms.cms.faq;
  const [currentSlide, setCurrentSlide] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  console.log("FAQs", faqs);

  useEffect(() => {
    dispatch(setMainLoading(false));
  }, [cms]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === banner.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [banner.length]);

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const result = await signIn("credentials", {
      name,
      email,
      password,
      password_confirmation,
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
            <div className="w-full flex flex-col justify-center items-center">
              {session.status == "authenticated" ? (
                <div className="w-full h-screen grid grid-cols-5">
                  <div className="w-full flex flex-col items-center justify-center p-10 h-auto col-span-5">
                    <div className="carousel w-full h-[32rem] rounded-xl overflow-hidden relative">
                      {banner.map((item, index) => (
                        <div
                          key={index}
                          className={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            currentSlide === index ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <img
                            src={item.banner}
                            alt={item.altText || `Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full justify-center gap-2 py-2">
                      {banner.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          style={{ width: `${10 / banner.length}%` }} // Dynamic width
                          className={`h-1 ${
                            currentSlide === index
                              ? "bg-red-500"
                              : "bg-gray-400"
                          } rounded-md`}
                        ></button>
                      ))}
                    </div>
                    <button className="btn btn-error rounded-xl mt-5 text-white w-[30%]">
                      Start With Free Lesson
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-screen grid grid-cols-5">
                  <div className="w-full flex flex-col items-center justify-center p-16 h-auto col-span-3">
                    <div className="carousel w-full h-[30rem] rounded-xl overflow-hidden relative">
                      {banner.map((item, index) => (
                        <div
                          key={index}
                          className={`carousel-item absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            currentSlide === index ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <img
                            src={item.banner}
                            alt={item.altText || `Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full justify-center gap-2 py-2">
                      {banner.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`h-3 w-3 rounded-full ${
                            currentSlide === index
                              ? "bg-red-500"
                              : "bg-gray-400"
                          }`}
                        ></button>
                      ))}
                    </div>
                    <button className="btn btn-error rounded-xl mt-5 text-white w-[50%]">
                      Start With Free Lesson
                    </button>
                  </div>
                  <div className="w-full flex justify-center items-center col-span-2">
                    <div className="w-full flex flex-col px-20 gap-10 justify-center items-center">
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
                            onChange={(e) =>
                              setPasswordConfirmation(e.target.value)
                            }
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
                </div>
              )}
              <div className="w-full border-t-4 border-base-300 h-screen grid grid-cols-2 justify-center items-center">
                <div className=" h-auto col-span-1 flex justify-center items-center">
                  <Image
                    src="/assets/images/laptop_home_page.png"
                    alt="Logo"
                    width={600}
                    height={600}
                  />
                </div>
                <div className=" col-span-1 h-auto flex flex-col gap-5 justify-center items-center">
                  <div className="flex gap-5 font-bold text-4xl">
                    <span className="text-error">FREE</span>
                    <span>LESSONS</span>
                  </div>
                  <button className="btn btn-error rounded-xl  w-[50%] text-white">
                    Start With Free Lesson
                  </button>
                </div>
              </div>
              <div className="w-full border-t-4 border-base-300 h-screen grid grid-cols-5 justify-center items-center">
                <div className="col-span-2 h-auto flex flex-col gap-5 justify-center items-center pl-20">
                  <div className="flex gap-5 font-bold text-4xl">
                    <span>LEARN</span>
                    <span>anywhere</span>
                  </div>
                  <div className="flex gap-5 font-bold text-4xl">
                    <span className="text-error">MOBILE</span>
                    <span className="text-2xl mt-1">|</span>
                    <span className="text-error">TABLET</span>
                    <span className="text-2xl mt-1">|</span>
                    <span className="text-error">LAPTOP</span>
                  </div>
                  <button className="btn btn-error rounded-xl  w-[50%] text-white">
                    Start With Free Lesson
                  </button>
                </div>
                <div className="w-full flex justify-center items-center h-auto col-span-3">
                  <div className="mr-20">
                    <Image
                      src="/assets/images/laptop_group.png"
                      alt="Logo"
                      width={800}
                      height={800}
                    />
                  </div>
                </div>
              </div>
              {testimonail.length > 0 && (
                <div className="w-full px-20 h-screen">
                  <div className="w-full flex items-center text-center gap-5">
                    <div className="w-full h-[3px] bg-error"></div>
                    <div className="w-full">
                      <span className="text-xl font-bold ">
                        STUDENT TESTIMONIALS
                      </span>
                    </div>
                    <div className="w-full h-[3px] bg-error"></div>
                  </div>
                  <div
                    className={`w-full mt-[6rem] flex ${
                      testimonail.length < 3
                        ? "justify-center"
                        : "overflow-x-scroll hide-scrollbar"
                    } mt-10`}
                  >
                    {testimonail.map((testi, index) => (
                      <div key={index} className="w-[33.33%]  min-w-[33.33%]">
                        <div className="w-[25rem] h-[14rem] relative z-[1] flex justify-center items-center">
                          <div className="w-[14rem] h-[14rem] rounded-full overflow-hidden ">
                            <Image
                              src={testi.avatar}
                              alt="Logo"
                              width={300}
                              height={300}
                            />
                          </div>
                        </div>
                        <div className="w-[25rem] h-[25rem] bg-white mt-[-7rem] rounded-3xl p-6 text-center">
                          <div className="w-full h-auto flex flex-col justify-center items-center mt-[7rem] gap-4">
                            <span className="text-xl text-base-100 font-bold">
                              {testi.name}
                            </span>
                            <p className="h-[12rem] text-base-100 overflow-y-auto">
                              {testi.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="w-full mb-[6rem] grid grid-cols-3 gap-4 px-10">
                <div className="w-full flex flex-col justify-center items-center text-center h-[10rem] bg-error rounded-2xl">
                  <span className="text-2xl font-bold">200 +</span>
                  <span className="text-xl">Students</span>
                </div>
                <div className="w-full flex flex-col justify-center items-center text-center h-[10rem] bg-error rounded-2xl">
                  <span className="text-2xl font-bold">30 +</span>
                  <span className="text-xl">Courses</span>
                </div>
                <div className="w-full flex flex-col justify-center items-center text-center h-[10rem] bg-error rounded-2xl">
                  <span className="text-2xl font-bold">35 +</span>
                  <span className="text-xl">Certificated</span>
                </div>
              </div>
              <div className="w-full px-20 h-screen">
                <div className="w-full flex items-center text-center gap-5">
                  <div className="w-full h-[3px] bg-error"></div>
                  <div className="w-full">
                    <span className="text-xl font-bold ">FAQs</span>
                  </div>
                  <div className="w-full h-[3px] bg-error"></div>
                </div>
                <div className="w-full flex flex-col justify-center items-center h-[70%] overflow-y-scroll hide-scrollbar gap-16 mt-[5rem]">
                  {faqs.length > 0 ? (
                    <>
                      {faqs.map((faq, index) => (
                        <div
                          key={index}
                          className="w-[50%] border-l-[3px] flex flex-col gap-3 border-error px-5"
                        >
                          <span className="text-xl">{faq.quest}</span>
                          <p className="text-md text-base-300">{faq.answer}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="w-[50%] border-l-[3px] flex flex-col gap-3 border-error px-5">
                      <span className="text-xl">How are you?</span>
                      <p className="text-md text-base-300">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias blanditiis iste consectetur consequatur
                        ratione illo accusamus suscipit soluta ab nam, natus
                        dicta nobis cupiditate nostrum voluptatum repellat?
                        Consectetur, illum dolorum?
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default HomePage;
