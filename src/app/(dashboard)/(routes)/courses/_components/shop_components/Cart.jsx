import { formatPrice } from "@/helpers/formatPrice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Cart = ({ BearerToken }) => {
  const [Data, setData] = useState(null);
  const [miniLoader, setMiniLoader] = useState(true);

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
    console.log("cart data", Data);
  }, [Data]);

  return (
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
                <button className="btn btn-error rounded-xl text-white">
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
  );
};

export default Cart;
