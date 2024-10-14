"use client";
import { formatPrice, shortFormatDate } from "@/helpers/formatPrice";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const OrderHistory = () => {
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
        `${process.env.NEXT_PUBLIC_API_HOST}` + "order",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            limit: 10,
            page: page,
          },
        }
      );
      setData(response.data.data.order_histories);
      setTotalPages(response.data.data.pagination.last_page);
      setTotalItems(response.data.data.pagination.total);
      setMiniLoader(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (BearerToken) {
      fetchData(currentPage);
    }
  }, [BearerToken, currentPage]);

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };
  return (
    <div>
      <table className="table table-xs table-pin-rows table-pin-cols">
        <thead>
          <tr>
            <th></th>

            <td>Order ID</td>
            <td>Date</td>
            <td>Name</td>
            <td>phone</td>
            <td>Order Item</td>
            <td>Total Price</td>
            <td>Grand Total</td>
            <td>Detail</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {miniLoader ? (
            <tr className="w-full h-full">
              <td colSpan="100%" className="text-center">
                <div className="w-full h-full flex justify-center items-center">
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              </td>
            </tr>
          ) : (
            <>
              {data.length > 0 ? (
                <>
                  {data.map((item, index) => (
                    <tr>
                      <th>{index + 1}</th>
                      <th>#{item.id}</th>

                      <td>{shortFormatDate(item.created_at)}</td>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>

                      <td>{item.order_item.length}</td>
                      <td>{item.total} MMK</td>
                      <td>{item.grand_total} MMK</td>
                      <td>
                        <span className="tooltip" data-tip="View Image">
                          {" "}
                          <i
                            onClick={() =>
                              document
                                .getElementById(`slip_modal${index}`)
                                .showModal()
                            }
                            class="fa-regular fa-eye text-error"
                          ></i>
                        </span>
                        {/* You can open the modal using document.getElementById('ID').showModal() method */}
                        <dialog id={`slip_modal${index}`} className="modal">
                          <div className="modal-box w-11/12 max-w-5xl">
                            {item.order_item.length > 0 ? (
                              <>
                                {item.order_item.map((item_data, idx) => (
                                  <div
                                    key={idx}
                                    className="w-full flex gap-10 px-10 py-5 rounded-2xl border-[1px] border-base-content text-white"
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
                                          <span className="text-white">
                                            {item_data.product.name}
                                          </span>
                                        </div>
                                        <div className="flex gap-5">
                                          <span className="px-5 h-[1.8rem] flex justify-center items-center bg-error rounded-full">
                                            Price
                                          </span>
                                          <span className="text-white">
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
                            <div className="modal-action">
                              <form method="dialog">
                                {/* if there is a button, it will close the modal */}
                                <button className="btn btn-error rounded-lg text-white">
                                  Close
                                </button>
                              </form>
                            </div>
                          </div>
                        </dialog>
                      </td>
                      <td>
                        <span className="text-white">{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr className="w-full h-full">
                  <td colSpan="100%" className="text-center">
                    <div className="w-full h-full flex justify-center items-center">
                      <span className="text-error font-bold">No Data</span>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
        <tfoot>
          <tr className="w-full h-full">
            <td colSpan="100%" className="text-center">
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
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
export default OrderHistory;
