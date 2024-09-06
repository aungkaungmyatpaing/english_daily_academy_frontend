"use client";
import { fetchUserData } from "@/app/api/user";
import { formatPrice } from "@/helpers/formatPrice";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import Cart from "./shop_components/Cart";
const Shop = () => {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.replace("/login");
      toast.error("Unauthenticated. Please login.", {
        position: "top-right",
        theme: "dark",
      });
    }
  }, [session.status, router]);

  const [enrollValue, setEnrollValue] = useState(null);
  const [Tab, setTab] = useState(1);

  const BearerToken = session?.data?.accessToken;
  const [miniLoader, setMiniLoader] = useState(false);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchData = async (page) => {
    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "product",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            is_premium: 1,
            limit: 6,
            page: page,
          },
        }
      );
      setData(response.data.data.products);
      setTotalPages(response.data.data.pagination.last_page);
      setTotalItems(response.data.data.pagination.total);
      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (BearerToken) {
      fetchUserData(BearerToken)
        .then((response) => {
          console.log(response);

          setEnrollValue(response.data.enroll);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
      fetchData(currentPage);
    }
  }, [BearerToken, currentPage]);
  useEffect(() => {
    console.log(data);
  }, [data]);
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };

  const addToCart = async (product_id, quantity) => {
    console.log(product_id, quantity);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "cart/add-to-cart",
        {
          product_id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`,
          },
        }
      );
      if (response.data.status == "success") {
        toast.success("Add to cart successfully!", {
          position: "top-right",
          theme: "dark",
        });
      }
      console.log("Add to cart", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `${error.response.data.message || "Failed to add to cart"}`,
            {
              position: "top-right",
              theme: "dark",
            }
          );
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
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex justify-start gap-10">
        <div
          onClick={() => setTab(1)}
          className={`cursor-pointer rounded-sm ${
            Tab === 1 && "border-b-[4px] border-error"
          }`}
        >
          <span className="text-xl font-bold">Shop</span>
        </div>
        <div
          onClick={() => setTab(2)}
          className={`cursor-pointer rounded-sm  ${
            Tab === 2 && "border-b-[4px] border-error"
          }`}
        >
          <span className="text-xl font-bold">Cart</span>
        </div>
        <div
          onClick={() => setTab(3)}
          className={`cursor-pointer rounded-sm  ${
            Tab === 3 && "border-b-[4px] border-error"
          }`}
        >
          <span className="text-xl font-bold">Order</span>
        </div>
      </div>
      {Tab === 1 && (
        <>
          {miniLoader ? (
            <div className="w-full h-[48rem] grid grid-cols-3 gap-6 justify-items-center items-center">
              <div className="skeleton h-[24rem] rounded-xl w-full"></div>
              <div className="skeleton h-[24rem] rounded-xl w-full"></div>
              <div className="skeleton h-[24rem] rounded-xl w-full"></div>
              <div className="skeleton h-[24rem] rounded-xl w-full"></div>
              <div className="skeleton h-[24rem] rounded-xl w-full"></div>
              <div className="skeleton h-[24rem] rounded-xl w-full"></div>
            </div>
          ) : (
            <>
              {data.length > 0 ? (
                <>
                  <div className="w-full h-[48rem] justify-items-center grid grid-cols-3 gap-6">
                    {data.map((product) => (
                      <div
                        key={product.id}
                        className="w-full h-[24rem] overflow-hidden rounded-xl bg-base-content"
                      >
                        <div className="w-full rounded-xl h-[50%] overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover duration-300 hover:scale-110"
                          />
                        </div>
                        <div className="w-full h-[50%] px-5 flex flex-col justify-center items-center gap-5 ">
                          <div className="w-full flex justify-start items-center gap-5">
                            <div className="w-[4rem] text-center rounded-full bg-error ">
                              Item
                            </div>
                            <span className="text-base-100">
                              {product.name}
                            </span>
                            <span className="text-error text-xs font-mono">
                              <i className="fa-solid fa-xmark text-xs"></i>
                              {product.quantity}
                            </span>
                          </div>
                          <div className="w-full flex justify-start items-center gap-5">
                            <div className="w-[4rem] text-center rounded-full bg-error ">
                              Price
                            </div>
                            {product.is_discount &&
                            product.discount_price > 0 ? (
                              <div className="flex gap-3">
                                <span className="text-base-100 line-through">
                                  {formatPrice(product.price ?? 0)} Ks
                                </span>
                                <span className="text-base-100">
                                  {formatPrice(product.discount_price ?? 0)} Ks
                                </span>
                              </div>
                            ) : (
                              <span className="text-base-100">
                                {formatPrice(product.price ?? 0)} Ks
                              </span>
                            )}
                          </div>
                          <div className="w-full flex justify-center items-center">
                            {product.instock == true && product.quantity > 0 ? (
                              <button
                                onClick={() => addToCart(product.id, 1)}
                                className="btn btn-error text-white rounded-xl"
                              >
                                <i className="fa-regular fa-cart-shopping"></i>
                                Add to Cart
                              </button>
                            ) : (
                              <button className="btn btn-error text-white rounded-xl">
                                <i className="fa-regular fa-ban"></i>
                                Out of Stock
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full flex justify-center items-center mt-4">
                    <ReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={totalPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination"}
                      activeClassName={"active"}
                      pageClassName={"page-item"}
                      previousClassName={"prev-item"}
                      nextClassName={"next-item"}
                      disabledClassName={"disabled-item"}
                      activeLinkClassName={"active-link"}
                      className="w-full flex justify-center gap-6 text-xs text-error font-bold"
                    />
                  </div>
                </>
              ) : (
                <div className="w-full h-[24rem]  flex justify-center items-center">
                  <span className="text-xl text-error font-bold">
                    No Product
                  </span>
                </div>
              )}
            </>
          )}
        </>
      )}
      {Tab === 2 && (
        <>
          <Cart BearerToken={BearerToken} />
        </>
      )}
      {Tab === 3 && <>Order</>}
    </div>
  );
};

export default Shop;
