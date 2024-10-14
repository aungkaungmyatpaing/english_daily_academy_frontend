"use client";
import { formatDate, formatPrice } from "@/helpers/formatPrice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const Order = ({ BearerToken }) => {
  const emptylist = require("../../../../../../../public/assets/images/emptylist.json");
  const [miniLoader, setMiniLoader] = useState(true);
  const [Data, setData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const toggleDetails = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const fetchData = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "order",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            limit: 6,
            page: page,
          },
        }
      );
      setData(response.data.data.order_histories);
      setTotalPages(response.data.data.pagination.last_page);
      setTotalItems(response.data.data.pagination.total);
      setMiniLoader(false);
      console.log("order history", response.data.data);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [BearerToken, currentPage]);
  return (
    <>
      {miniLoader ? (
        <div className="w-full h-[40rem] bg-white rounded-3xl flex justify-center items-center">
          <span className="loading loading-ring loading-lg text-error"></span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5 h-auto bg-white rounded-3xl p-8">
          <div className="w-full flex items-center justify-between">
            <span className="text-black font-bold text-xl"> Order History</span>
          </div>
          {Data.length > 0 ? (
            <div className="w-full h-auto">
              <div className="w-full h-auto flex flex-col gap-10">
                {Data.map((item, index) => (
                  <div
                    key={index}
                    className="w-full h-auto flex flex-col gap-3"
                  >
                    <div className="w-full grid grid-cols-3 p-10 rounded-2xl border-[1px] border-base-content">
                      <div className="w-full col-span-2 grid grid-cols-2 gap-10">
                        <div className="w-full flex flex-col gap-5">
                          <div className="w-full flex justify-between">
                            <span className="text-error">Order ID: </span>
                            <span className="text-black">{item.id}</span>
                          </div>
                          <div className="w-full flex justify-between">
                            <span className="text-error">Status: </span>
                            <span className="text-black">{item.status}</span>
                          </div>
                          <div className="w-full flex justify-between">
                            <span className="text-error">Total Price: </span>
                            <span className="text-black">
                              {formatPrice(item.grand_total ?? 0)} Kyats
                            </span>
                          </div>
                        </div>
                        <div className="w-full flex flex-col">
                          <div className="w-full flex justify-between">
                            <span className="text-error">Date: </span>
                            <span className="text-black">
                              {formatDate(item.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full col-span-1 flex justify-end">
                        <button
                          className="btn btn-error text-white rounded-lg"
                          onClick={() => toggleDetails(index)}
                        >
                          {expandedIndex === index
                            ? "Hide Detail"
                            : "Show Detail"}
                        </button>
                      </div>
                    </div>

                    {/* AnimatePresence and motion.div for animation */}
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {item.order_item.length > 0 ? (
                            <>
                              {item.order_item.map((item_data, idx) => (
                                <div
                                  key={idx}
                                  className="w-full flex gap-10 px-10 py-5 rounded-2xl border-[1px] border-base-content"
                                >
                                  <div className="avatar">
                                    <div className="w-36 rounded">
                                      <img
                                        src={item_data.product.image}
                                        alt="Product"
                                      />
                                    </div>
                                  </div>
                                  <div className="w-full flex justify-start">
                                    <div className="flex flex-col justify-center gap-5">
                                      <div className="flex gap-5">
                                        <span className="px-5 h-[1.8rem] flex justify-center items-center bg-error rounded-full">
                                          Product
                                        </span>
                                        <span className="text-black">
                                          {item_data.product.name}
                                        </span>
                                      </div>
                                      <div className="flex gap-5">
                                        <span className="px-5 h-[1.8rem] flex justify-center items-center bg-error rounded-full">
                                          Price
                                        </span>
                                        <span className="text-black">
                                          {formatPrice(item_data.price ?? 0)}{" "}
                                          Kyats
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <div className="w-full flex justify-center items-center gap-10 px-10 py-5 rounded-2xl border-[1px] border-base-content">
                              <span className="text-error">
                                There is no order item
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="w-full flex justify-center items-center mt-8">
                <span className="w-[8rem] text-error text-xs font-bold">
                  current page - {currentPage}
                </span>
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
            </div>
          ) : (
            <div className="w-full h-[20rem] bg-white flex flex-col gap-5 justify-center items-center">
              <Lottie
                style={{ width: "300px", height: "300px" }}
                animationData={emptylist}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Order;
