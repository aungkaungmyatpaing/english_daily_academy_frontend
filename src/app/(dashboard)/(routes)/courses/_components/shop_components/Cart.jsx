import { formatPrice } from "@/helpers/formatPrice";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Checkout from "./Checkout";
import { useDispatch, useSelector } from "react-redux";
import { setCheckoutFormValidated } from "@/store";
import { useRouter } from "next/navigation";

const Cart = ({ BearerToken }) => {
  const router = useRouter();
  const [Data, setData] = useState(null);
  const [LocationData, setLocationData] = useState([]);

  const [miniLoader, setMiniLoader] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [regionId, setRegionId] = useState("");
  const [townshipId, setTownshipId] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const checkoutFormValidated = useSelector(
    (state) => state.mainLoading.checkoutFormValidated
  );

  const checkoutDone = useSelector((state) => state.mainLoading.checkoutDone);
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "checkout-preview",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      setData(response.data.data);
      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "locations",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      setLocationData(response.data.data);
      console.log(response);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handelCheckoutModal = () => {
    document.getElementById("checkout_modal").showModal();
    fetchLocation();
  };

  const handleRegionChange = (e) => {
    setRegionId(e.target.value);
    setTownshipId(""); // Reset township when region changes
  };

  const selectedRegion = LocationData.find(
    (region) => region.id === parseInt(regionId)
  );

  useEffect(() => {
    fetchData();
  }, []);

  const HandelIncreaseQuantity = async (id, quantity) => {
    const newQuantity = quantity + 1;

    console.log("id", id);
    console.log("new Quantity", newQuantity);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_HOST}` + `cart/${id}/update`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      console.log("update cart response", response);
      if (response.data.status == "success") {
        toast.success("Add to cart successfully!", {
          position: "top-right",
          theme: "dark",
        });
        fetchData();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 404) {
            toast.error(`Failed to update,Invalid selected product`, {
              position: "top-right",
              theme: "dark",
            });
          } else {
            toast.error(
              `${error.response.data.message || "Failed to add to cart"}`,
              {
                position: "top-right",
                theme: "dark",
              }
            );
          }
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

      console.error("Error updating to cart:", error);
    }
  };

  const HandelDecreaseQuantity = async (id, quantity) => {
    const newQuantity = quantity - 1;

    console.log("id", id);
    console.log("new Quantity", newQuantity);

    if (newQuantity <= 0) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_HOST}` + `cart/${id}/delete`,
          {
            headers: {
              Authorization: `Bearer ${BearerToken}`, // Include Bearer token
            },
          }
        );
        console.log("delete cart response", response);
        if (response.data.status == "success") {
          toast.success("Delete cart successfully!", {
            position: "top-right",
            theme: "dark",
          });
          fetchData();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 404) {
              toast.error(`Failed to delete,Invalid selected product`, {
                position: "top-right",
                theme: "dark",
              });
            } else {
              toast.error(
                `${error.response.data.message || "Failed to delete to cart"}`,
                {
                  position: "top-right",
                  theme: "dark",
                }
              );
            }
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

        console.error("Error deleting to cart:", error);
      }
    } else {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_HOST}` + `cart/${id}/update`,
          {
            quantity: newQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${BearerToken}`, // Include Bearer token
            },
          }
        );
        console.log("update cart response", response);
        if (response.data.status == "success") {
          toast.success("update cart successfully!", {
            position: "top-right",
            theme: "dark",
          });
          fetchData();
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 404) {
              toast.error(`Failed to update,Invalid selected product`, {
                position: "top-right",
                theme: "dark",
              });
            } else {
              toast.error(
                `${error.response.data.message || "Failed to add to cart"}`,
                {
                  position: "top-right",
                  theme: "dark",
                }
              );
            }
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

        console.error("Error updating to cart:", error);
      }
    }
  };

  const HandelRemoveItem = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_HOST}` + `cart/${id}/delete`,
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      console.log("delete cart response", response);
      if (response.data.status == "success") {
        toast.success("Remove item successfully!", {
          position: "top-right",
          theme: "dark",
        });
        fetchData();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 404) {
            toast.error(`Failed to delete,Invalid selected product`, {
              position: "top-right",
              theme: "dark",
            });
          } else {
            toast.error(
              `${error.response.data.message || "Failed to delete cart"}`,
              {
                position: "top-right",
                theme: "dark",
              }
            );
          }
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

      console.error("Error deleting to cart:", error);
    }
  };

  useEffect(() => {
    checkoutInputForTabJump();
  }, []);

  const checkoutInputForTabJump = () => {
    let tempErrors = {};

    // Name validation: must be a string and <= 255 characters
    if (!name.trim()) {
      tempErrors.name = "Name is required";
    } else if (name.length < 2) {
      tempErrors.name = "Name must be at least 2 characters long";
    } else if (name.length > 255) {
      tempErrors.name = "Name cannot exceed 255 characters";
    }

    // Phone validation
    if (!phone.trim()) {
      tempErrors.phone = "Phone is required";
    } else if (phone.startsWith("095")) {
      if (phone.length !== 9) {
        tempErrors.phone =
          "Phone must be exactly 9 digits long when starting with '095'";
      }
    } else if (phone.length !== 11) {
      tempErrors.phone = "Phone must be exactly 11 digits long";
    }

    // Region validation
    if (!regionId) {
      tempErrors.regionId = "Please select a region";
    }

    // Township validation
    if (!townshipId) {
      tempErrors.townshipId = "Please select a township";
    }

    // Address validation
    if (!address.trim()) {
      tempErrors.address = "Address is required";
    } else if (address.length < 10) {
      tempErrors.address = "Address must be at least 10 characters long";
    }

    if (Object.keys(tempErrors).length === 0) {
      // Proceed to the next step if there are no errors
      console.log("Validation passed, proceed to the next step");
      dispatch(setCheckoutFormValidated(true));
      document.getElementById("checkout_modal").close();
      // Add your logic here for the next step
    } else {
      dispatch(setCheckoutFormValidated(false));
    }
  };

  const checkoutInputValidation = () => {
    let tempErrors = {};

    // Name validation: must be a string and <= 255 characters
    if (!name.trim()) {
      tempErrors.name = "Name is required";
    } else if (name.length < 2) {
      tempErrors.name = "Name must be at least 2 characters long";
    } else if (name.length > 255) {
      tempErrors.name = "Name cannot exceed 255 characters";
    }

    // Phone validation
    if (!phone.trim()) {
      tempErrors.phone = "Phone is required";
    } else if (phone.startsWith("095")) {
      if (phone.length !== 9) {
        tempErrors.phone =
          "Phone must be exactly 9 digits long when starting with '095'";
      }
    } else if (phone.length !== 11) {
      tempErrors.phone = "Phone must be exactly 11 digits long";
    }

    // Region validation
    if (!regionId) {
      tempErrors.regionId = "Please select a region";
    }

    // Township validation
    if (!townshipId) {
      tempErrors.townshipId = "Please select a township";
    }

    // Address validation
    if (!address.trim()) {
      tempErrors.address = "Address is required";
    } else if (address.length < 10) {
      tempErrors.address = "Address must be at least 10 characters long";
    }

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      // Proceed to the next step if there are no errors
      console.log("Validation passed, proceed to the next step");
      dispatch(setCheckoutFormValidated(true));
      document.getElementById("checkout_modal").close();
      // Add your logic here for the next step
    } else {
      dispatch(setCheckoutFormValidated(false));
    }
  };

  useEffect(() => {
    console.log("cart data", Data);
  }, [Data]);

  return (
    <>
      <dialog id="checkout_modal" className="modal">
        <div className="modal-box bg-white !rounded-3xl !max-w-[50%] text-black">
          <div className="w-full flex flex-col gap-12 justify-center items-center">
            <h3 className="font-bold text-lg">Fill Delivery Information</h3>
            <div className="w-full flex flex-col px-20 gap-10 justify-center items-center">
              <form
                // onSubmit={handleSubmit}
                className="w-full flex flex-col items-center gap-8 "
              >
                <div className="w-full flex flex-col gap-4">
                  <h3 className="font-bold text-lg">Name</h3>
                  <label className="input input-bordered w-full shadow-lg text-base-100 rounded-lg flex items-center gap-4 bg-white">
                    <input
                      type="text"
                      className="grow"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
                <div className="w-full flex flex-col gap-4">
                  <h3 className="font-bold text-lg">Phone</h3>
                  <label className="input input-bordered text-base-100 w-full shadow-lg rounded-lg flex items-center gap-4 bg-white">
                    <input
                      type="text"
                      className="grow"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </label>
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone}</p>
                  )}
                </div>
                <div className="w-full flex flex-col gap-4">
                  <h3 className="font-bold text-lg">Location</h3>
                  <div className="w-full grid grid-cols-2 gap-10">
                    <div className="flex flex-col gap-4">
                      <select
                        className="select select-ghost w-full shadow-lg rounded-lg max-w-xs"
                        value={regionId}
                        onChange={handleRegionChange}
                      >
                        <option value="">Select Region</option>
                        {LocationData.map((region) => (
                          <option key={region.id} value={region.id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      {errors.regionId && (
                        <p className="text-red-500">{errors.regionId}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-4">
                      <select
                        className="select select-ghost w-full shadow-lg rounded-lg max-w-xs"
                        value={townshipId}
                        onChange={(e) => setTownshipId(e.target.value)}
                        disabled={!regionId} // Disable if no region is selected
                      >
                        <option value="">Select Township</option>
                        {selectedRegion?.township.map((township) => (
                          <option key={township.id} value={township.id}>
                            {township.name}
                          </option>
                        ))}
                      </select>
                      {errors.townshipId && (
                        <p className="text-red-500">{errors.townshipId}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                  <h3 className="font-bold text-lg">Address</h3>
                  <textarea
                    type="text"
                    className="textarea textarea-ghost !text-black  rounded-lg shadow-lg !bg-transparent"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
                {errors.address && (
                  <p className="text-red-500">{errors.address}</p>
                )}
              </form>
            </div>
          </div>

          <div className="modal-action">
            <button
              onClick={() => document.getElementById("checkout_modal").close()}
              className="btn btn-error rounded-xl w-[8rem] text-white font-light"
            >
              Close
            </button>
            <button
              onClick={() => checkoutInputValidation()}
              className="btn btn-error rounded-xl w-[8rem] text-white font-light"
            >
              Next
            </button>
          </div>
        </div>
      </dialog>

      {checkoutFormValidated ? (
        <Checkout
          Data={Data}
          BearerToken={BearerToken}
          name={name}
          phone={phone}
          regionId={regionId}
          townshipId={townshipId}
          address={address}
        />
      ) : (
        <>
          {miniLoader ? (
            <div className="w-full h-[40rem] bg-white rounded-3xl flex justify-center items-center">
              <span className="loading loading-ring loading-lg text-error"></span>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-5 h-[40rem] bg-white rounded-3xl p-8">
              <div className="w-full flex items-center justify-between">
                <span className="text-black font-bold text-xl">My cart</span>
                <button className="btn border-1 border-error bg-white hover:bg-white hover:border-error rounded-xl text-error ">
                  Add More <i className="fa-regular fa-plus"></i>
                </button>
              </div>
              {Data && Data.carts.length > 0 ? (
                <div className="w-full h-auto">
                  <div className="w-full h-[24rem] overflow-y-scroll">
                    {Data.carts.map((item, index) => (
                      <div
                        key={index}
                        className="w-full flex flex-col justify-between h-[12rem] p-10 border-b-[1px] border-base-300"
                      >
                        <div className="w-full text-lg flex gap-36">
                          <div className="flex gap-8">
                            <span className="text-black">Product</span>
                            <span className="border-l-[3px] border-error pl-2 text-error">
                              {item.product.name}
                            </span>
                          </div>
                          <div className="flex gap-8">
                            <span className="text-black">Price</span>
                            <span className="border-l-[3px] border-error pl-2 text-error">
                              {formatPrice(item.product.price)} Kyats
                            </span>
                          </div>
                          <div className="flex">
                            <div
                              onClick={() => HandelRemoveItem(item.id)}
                              className="px-8 bg-error rounded-full text-white hover:scale-110 duration-300 cursor-pointer"
                            >
                              <span>Remove</span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full flex">
                          <div className="flex gap-8">
                            <span className="text-error">Quantity</span>
                            <div className="w-[8rem] text-white rounded-xl bg-error flex justify-between p-1 items-center h-[2rem]">
                              <i
                                onClick={() =>
                                  HandelDecreaseQuantity(item.id, item.quantity)
                                }
                                className="fa-regular fa-circle-minus text-[1.6rem] hover:scale-110 duration-300 cursor-pointer"
                              ></i>
                              <span className=" cursor-not-allowed">
                                {item.quantity}
                              </span>
                              <i
                                onClick={() =>
                                  HandelIncreaseQuantity(item.id, item.quantity)
                                }
                                className="fa-regular fa-circle-plus text-[1.6rem] hover:scale-110 duration-300 cursor-pointer"
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full p-10 h-[10rem] flex justify-between items-center">
                    <div className="flex justify-center gap-5">
                      <div className="px-4 text-center flex justify-center items-center h-[1.8rem] bg-error text-white rounded-2xl">
                        <span>Total</span>
                      </div>
                      <span className="text-lg text-error">
                        {formatPrice(Data.total)} Kyats
                      </span>
                    </div>
                    <button
                      onClick={() => handelCheckoutModal()}
                      className="btn btn-error rounded-xl text-white"
                    >
                      Check out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <span className="text-xl text-error font-bold">No Item</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Cart;
