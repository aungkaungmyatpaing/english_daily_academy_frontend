"use client";

import { formatPrice } from "@/helpers/formatPrice";
import { setCheckoutFormValidated } from "@/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Checkout = ({
  Data,
  BearerToken,
  name,
  phone,
  regionId,
  townshipId,
  address,
}) => {
  const [PaymentData, setPaymentData] = useState([]);
  const [miniLoader, setMiniLoader] = useState(true);
  const [miniTab, setMiniTab] = useState(1);
  const [error, setError] = useState("");

  const checkoutFormValidated = useSelector(
    (state) => state.mainLoading.checkoutFormValidated
  );
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
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "checkout",
        {
          region_id: regionId ?? null,
          township_id: townshipId ?? null,
          cod: 0,
          payment_id: PaymentData[0].id ?? null,
          name: name ?? null,
          phone: phone ?? null,
          address: address ?? null,
          slip: selectedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
  };

  const handleProceed = () => {
    if (!selectedImage) {
      setError("Please upload an image before proceeding.");
      return;
    }

    handleMiniTabNext();
  };

  return (
    <>
      {miniLoader ? (
        <div className="w-full h-[40rem] bg-white rounded-3xl flex justify-center items-center">
          <span className="loading loading-ring loading-lg text-error"></span>
        </div>
      ) : (
        <div className="w-full h-screen grid grid-cols-2">
          <div className="col-span-1 pt-10">
            {Data && (
              <div className="w-full h-auto col-span-1 bg-white">
                <div className="w-full h-[24rem] overflow-y-scroll">
                  {Data.carts.map((item, index) => (
                    <div
                      key={index}
                      className="w-full grid grid-cols-2 h-[12rem] p-2 border-b-[1px] border-gray-300"
                    >
                      <div className=" flex justify-center items-center">
                        <div className="avatar">
                          <div className="w-36 rounded">
                            <img src={item.product.image} />
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-5 justify-center items-center text-sm">
                        <div className="w-full flex gap-2">
                          <div className="px-2 w-[5rem] h-[1.5rem] flex justify-center items-center rounded-full bg-error text-white">
                            Item
                          </div>
                          <span className="text-black">
                            {item.product.name}
                          </span>
                        </div>
                        <div className="w-full flex gap-2">
                          <div className="px-2 w-[5rem] h-[1.5rem] flex justify-center items-center rounded-full bg-error text-white">
                            Price
                          </div>
                          {item.product.is_discount &&
                          item.product.discount_price > 0 ? (
                            <div className="flex justify-center items-center gap-1">
                              <span className="text-black line-through">
                                {formatPrice(item.product.price ?? 0)} Ks
                              </span>
                              <span className="text-black">
                                {formatPrice(item.product.discount_price ?? 0)}{" "}
                                Ks
                              </span>
                            </div>
                          ) : (
                            <span className="text-base-100">
                              {formatPrice(item.product.price ?? 0)} Ks
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full p-10 flex justify-between items-center">
                  <div className="flex justify-center gap-5">
                    <div className="px-4 text-center flex justify-center items-center h-[1.8rem] bg-error text-white rounded-2xl">
                      <span>Total</span>
                    </div>
                    <span className="text-lg text-error">
                      {formatPrice(Data.total)} Kyats
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                    Wallet Name: {PaymentData[0].wallet_name ?? "N/A"}
                  </span>
                </div>
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Phone Number: {PaymentData[0].account_number ?? "N/A"}
                  </span>
                </div>
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Account Name: {PaymentData[0].account_name ?? "N/A"}
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
                <button
                  onClick={() => handleBack()}
                  className="btn btn-error rounded-xl text-white"
                >
                  Cancel Checkout <i className="fa-solid fa-circle-xmark"></i>
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleMiniTabBack()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    <i className="fa-solid fa-backward-step"></i>Back
                  </button>
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
                <button
                  onClick={() => handleBack()}
                  className="btn btn-error rounded-xl text-white"
                >
                  Cancel Checkout <i className="fa-solid fa-circle-xmark"></i>
                </button>
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
                <button
                  onClick={() => handleBack()}
                  className="btn btn-error rounded-xl text-white"
                >
                  Cancel Checkout <i className="fa-solid fa-circle-xmark"></i>
                </button>
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
              <div className="w-full flex flex-col gap-5">
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Wallet Name: {PaymentData[0].wallet_name ?? "N/A"}
                  </span>
                </div>
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Phone Number: {PaymentData[0].account_number ?? "N/A"}
                  </span>
                </div>
                <div className="w-full flex gap-5 items-center">
                  <i className="fa-solid fa-circle-check text-error"></i>
                  <span className="text-white">
                    Account Name: {PaymentData[0].account_name ?? "N/A"}
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
                <button
                  onClick={() => handleBack()}
                  className="btn btn-error rounded-xl text-white"
                >
                  Cancel Checkout <i className="fa-solid fa-circle-xmark"></i>
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleMiniTabBack()}
                    className="btn btn-error rounded-xl text-white"
                  >
                    <i className="fa-solid fa-backward-step"></i>Back
                  </button>
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
        </div>
      )}
    </>
  );
};

export default Checkout;
