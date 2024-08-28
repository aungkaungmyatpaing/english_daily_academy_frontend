"use client";
import { fetchUserData } from "@/app/api/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
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

  const handlePageClick = (event) => {
    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);
  };
  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex justify-start gap-10">
        <div className="rounded-sm border-b-[4px] border-error">
          <span className="text-xl font-bold">Shop</span>
        </div>
        <div className="rounded-sm border-b-[4px] border-error">
          <span className="text-xl font-bold">Cart</span>
        </div>
        <div className="rounded-sm border-b-[4px] border-error">
          <span className="text-xl font-bold">Order</span>
        </div>
      </div>
      {miniLoader ? (
        <div className="w-full h-[48rem] grid grid-cols-3 gap-6 justify-items-center items-center">
          <div className="skeleton h-[24rem] w-full"></div>
          <div className="skeleton h-[24rem] w-full"></div>
          <div className="skeleton h-[24rem] w-full"></div>
          <div className="skeleton h-[24rem] w-full"></div>
          <div className="skeleton h-[24rem] w-full"></div>
          <div className="skeleton h-[24rem] w-full"></div>
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
                        <span className="text-base-100">{product.name}</span>
                      </div>
                      <div className="w-full flex justify-start items-center gap-5">
                        <div className="w-[4rem] text-center rounded-full bg-error ">
                          Price
                        </div>
                        {product.is_discount && product.discount_price > 0 ? (
                          <div className="flex gap-3">
                            <span className="text-base-100 line-through">
                              {product.price} Ks
                            </span>
                            <span className="text-base-100">
                              {product.discount_price} Ks
                            </span>
                          </div>
                        ) : (
                          <span className="text-base-100">
                            {product.price} Ks
                          </span>
                        )}
                      </div>
                      <div className="w-full flex justify-center items-center">
                        <button className="btn btn-error text-white rounded-xl">
                          <i className="fa-regular fa-cart-shopping"></i>
                          Add to Cart
                        </button>
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
                No Premium Course
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;
