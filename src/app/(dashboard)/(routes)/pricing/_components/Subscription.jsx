"use client";

import { formatPrice } from "@/helpers/formatPrice";
import { setCheckoutDone, setCheckoutFormValidated } from "@/store";
import axios from "axios";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Subscription = ({ Data, Datas, BearerToken }) => {
  console.log("dadada", Data);

  const LottieDone = require("../../../../../../public/assets/images/checkoutdone.json");
  const [PaymentData, setPaymentData] = useState([]);
  const [miniLoader, setMiniLoader] = useState(true);
  const [miniTab, setMiniTab] = useState(1);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();

  const handleBack = () => {
    console.log("HEHEEHE");

    dispatch(setCheckoutFormValidated(false));
  };

  const handleMiniTabNext = () => {
    setMiniTab((prevTab) => Math.min(prevTab + 1, 4)); // Increase miniTab but max 4
  };

  const handleMiniTabBack = () => {
    setMiniTab((prevTab) => Math.max(prevTab - 1, 1)); // Decrease miniTab but min 1
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "payment",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      setPaymentData(response.data.data);
      console.log(response);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkoutApi = async () => {
    const formData = new FormData();
    formData.append("plan_id", Data.id ?? null);
    formData.append("payment_id", PaymentData[0].id ?? null);

    formData.append("slip", selectedFile);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "enroll",
        formData,
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      console.log(response);
      if (response.data.status == "success") {
        toast.success("Enroll successfully!", {
          position: "top-right",
          theme: "dark",
        });
        setMiniTab(4);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`${error.response.data.message || "Enroll failed"}`, {
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

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the original file object
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
  };

  const handleProceed = () => {
    if (!selectedImage && !selectedFile) {
      setError("Please upload an image before proceeding.");
      return;
    }

    handleMiniTabNext();
  };

  return (
    <>
      {miniLoader ? (
        <div className="w-full h-[40rem] rounded-3xl flex justify-center items-center">
          <span className="loading loading-ring loading-lg text-error"></span>
        </div>
      ) : (
        <div className="w-full h-screen mt-10 grid grid-cols-2">
          <div className="col-span-1 flex justify-end items-start pt-10">
            <div className="w-[80%] cursor-not-allowed h-[30rem] rounded3xl overflow-hidden bg-white rounded-3xl flex flex-col flex-shrink-0">
              <div className="flex  gap-5 h-full p-20">
                <div className="w-full flex flex-col justify-between ">
                  <span className="text-base-300">{Data?.name ?? "N/A"}</span>
                  <span className="text-gray-500">Good for testing out</span>
                  <span className="text-2xl font-bold text-base-300">
                    {Data?.price} MMK / Month
                  </span>
                  <div className="w-full flex flex-col text-gray-500 h-[6rem] overflow-y-scroll gap-3">
                    {Datas.map((item, index) => (
                      <span
                        key={item.id}
                        className={` border-l-2 ${
                          Data.id === item.id
                            ? "border-green-400"
                            : Data.duration >= item.duration
                            ? "border-green-400"
                            : "border-error"
                        } pl-2`}
                      >
                        {item.name} premium courses
                      </span>
                    ))}
                  </div>

                  <span className="text-gray-500 border-l-2 border-success pl-2">
                    Free course
                  </span>
                  <span className="text-gray-500 border-l-2 border-success pl-2">
                    Free test
                  </span>
                  <span className="text-gray-500 border-l-2 border-success pl-2">
                    Free book
                  </span>
                  <span className="text-gray-500 border-l-2 border-success pl-2">
                    Certificate
                  </span>
                </div>
              </div>
            </div>
          </div>

          {miniTab === 1 && (
            <div className=" col-span-1 flex flex-col gap-5 px-10">
              <div className="w-full grid grid-cols-4 gap-10">
                <div
                  className={`w-full h-1 rounded-full bg-green-500 opacity-40`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full  ${
                    miniTab == 2 || miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-60"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-ful ${
                    miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-80"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full ${
                    miniTab == 4 ? "bg-green-500 opacity-100" : "bg-white"
                  }`}
                ></div>
              </div>
              <h3 className="font-bold text-white">
                Step 1: Transfer {formatPrice(Data?.total ?? 0)} MMK to
                following account
              </h3>
              <div className="w-full flex flex-col gap-5">
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Wallet Name: {PaymentData[0]?.wallet_name ?? "N/A"}
                  </span>
                </div>
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Phone Number: {PaymentData[0]?.account_number ?? "N/A"}
                  </span>
                </div>
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Account Name: {PaymentData[0]?.account_name ?? "N/A"}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-white">
                Step 2: Take a screenshot of transaction
              </h3>
              <h3 className="font-bold text-white">
                Step 3: Click next and Upload payment transaction
              </h3>
              <h3 className="font-bold text-white">
                Step 4: Wait for payment confirmation and start learning
              </h3>
              <div className="w-full flex justify-between">
                <div className="flex gap-4">
                  {/* <button
                    onClick={() => handleMiniTabBack()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    <i className="fa-solid fa-backward-step"></i>Back
                  </button> */}
                  <button
                    onClick={() => handleMiniTabNext()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    Next <i className="fa-solid fa-forward-step"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          {miniTab === 2 && (
            <div className=" col-span-1 flex flex-col gap-5 px-10">
              <div className="w-full grid grid-cols-4 gap-10">
                <div
                  className={`w-full h-1 rounded-full bg-green-500 opacity-40`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full  ${
                    miniTab == 2 || miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-60"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-ful ${
                    miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-80"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full ${
                    miniTab == 4 ? "bg-green-500 opacity-100" : "bg-white"
                  }`}
                ></div>
              </div>
              <h3 className="font-bold text-white">
                Step 1: Transfer {formatPrice(Data?.total ?? 0)} MMK to
                following account
              </h3>
              <h3 className="font-bold text-white">
                Step 2: Take a screenshot of transaction
              </h3>
              <div className="w-full flex flex-col gap-5">
                <div className="image-upload">
                  <label htmlFor="file-input" className="cursor-pointer">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt="Uploaded Preview"
                        className="w-48 h-48 object-cover"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-gray-400">
                        Click to upload image
                      </div>
                    )}
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {selectedImage && (
                    <div className="mt-2">
                      <button
                        onClick={removeImage}
                        className="px-4 py-2 bg-error text-white rounded"
                      >
                        Remove Image{" "}
                        <i className="fa-solid fa-circle-xmark"></i>
                      </button>
                    </div>
                  )}
                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </div>
              <h3 className="font-bold text-white">
                Step 3: Click next and Upload payment transaction
              </h3>
              <h3 className="font-bold text-white">
                Step 4: Wait for payment confirmation and start learning
              </h3>
              <div className="w-full flex justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleMiniTabBack()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    <i className="fa-solid fa-backward-step"></i>Back
                  </button>
                  <button
                    onClick={() => handleProceed()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    Next <i className="fa-solid fa-forward-step"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          {miniTab === 3 && (
            <div className=" col-span-1 flex flex-col gap-5 px-10">
              <div className="w-full grid grid-cols-4 gap-10">
                <div
                  className={`w-full h-1 rounded-full bg-green-500 opacity-40`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full  ${
                    miniTab == 2 || miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-60"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-ful ${
                    miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-80"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full ${
                    miniTab == 4 ? "bg-green-500 opacity-100" : "bg-white"
                  }`}
                ></div>
              </div>
              <h3 className="font-bold text-white">
                Step 1: Transfer {formatPrice(Data?.total ?? 0)} MMK to
                following account
              </h3>
              <h3 className="font-bold text-white">
                Step 2: Take a screenshot of transaction
              </h3>
              <h3 className="font-bold text-white">
                Step 3: Click next and Upload payment transaction
              </h3>
              <h3 className="font-bold text-white">
                Step 4: Wait for payment confirmation and start learning
              </h3>
              <div className="w-full flex justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleMiniTabBack()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    <i className="fa-solid fa-backward-step"></i>Back
                  </button>
                  <button
                    onClick={() => checkoutApi()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    Upload <i className="fa-solid fa-arrow-up-from-bracket"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          {miniTab === 4 && (
            <div className=" col-span-1 flex flex-col gap-5 px-10">
              <div className="w-full grid grid-cols-4 gap-10">
                <div
                  className={`w-full h-1 rounded-full bg-green-500 opacity-40`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full  ${
                    miniTab == 2 || miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-60"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-ful ${
                    miniTab == 3 || miniTab == 4
                      ? "bg-green-500 opacity-80"
                      : "bg-white"
                  }`}
                ></div>
                <div
                  className={`w-full h-1 rounded-full ${
                    miniTab == 4 ? "bg-green-500 opacity-100" : "bg-white"
                  }`}
                ></div>
              </div>
              <h3 className="font-bold text-white">
                Step 1: Transfer 20000 MMK to following account
              </h3>
              <h3 className="font-bold text-white">
                Step 2: Take a screenshot of transaction
              </h3>
              <h3 className="font-bold text-white">
                Step 3: Click next and Upload payment transaction
              </h3>
              <h3 className="font-bold text-white">
                Step 4: Wait for payment confirmation and start learning
              </h3>
              <div className="w-full h-auto p-5 bg-white rounded-xl flex flex-col justify-center items-center">
                <Lottie
                  style={{ width: "150px", height: "150px" }}
                  animationData={LottieDone}
                />
                <span className="text-black font-[500]">
                  You Purchased Successfully!
                </span>
                <span className="text-black font-[500]">
                  We will confirm your payment in a while
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Subscription;
