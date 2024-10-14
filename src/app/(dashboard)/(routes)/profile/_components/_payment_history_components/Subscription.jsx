"use client";
import { formatDate, shortFormatDate } from "@/helpers/formatPrice";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const SubscriptionHistory = () => {
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
        `${process.env.NEXT_PUBLIC_API_HOST}` + "enroll",
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
      setData(response.data.data.enrolls);
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
            <td>Date</td>
            <td>Subscription Plan</td>
            <td>Expire Date</td>
            <td>Price</td>
            <td>Wallet</td>
            <td>Transaction Number</td>
            <td>Slip</td>
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
                      <td>{shortFormatDate(item.updated_at)}</td>
                      <td>{item.plan.name}</td>
                      <td>{shortFormatDate(item.expire_date)}</td>
                      <td>{item.plan.price} MMK</td>
                      <td>{item.payment.wallet_name}</td>
                      <td>{item.payment.account_number}</td>
                      <td>
                        <span className="tooltip" data-tip="View Image">
                          {" "}
                          <i
                            onClick={() =>
                              document
                                .getElementById(`slip_modal${index}`)
                                .showModal()
                            }
                            className="fa-regular fa-image text-error "
                          ></i>
                        </span>
                        {/* You can open the modal using document.getElementById('ID').showModal() method */}
                        <dialog id={`slip_modal${index}`} className="modal">
                          <div className="modal-box">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                ✕
                              </button>
                            </form>
                            <div className="w-full h-auto p-4">
                              <img src={item.slip} alt="Shoes" />
                            </div>
                          </div>
                        </dialog>
                      </td>
                      <td>
                        {item.status == "approve" && (
                          <span className="text-green-500">approved</span>
                        )}
                        {item.status == "pending" && (
                          <span className="text-warning">pending</span>
                        )}
                        {item.status == "cancel" && (
                          <span className="text-error">canceled</span>
                        )}
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
export default SubscriptionHistory;
