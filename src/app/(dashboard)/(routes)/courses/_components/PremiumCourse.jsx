"use client";
import { fetchUserData } from "@/app/api/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
const PremiumCourse = () => {
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
        `${process.env.NEXT_PUBLIC_API_HOST}` + "course",
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
      setData(response.data.data.courses);
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
      {miniLoader ? (
        <div className="w-full h-[34rem] grid grid-cols-3 gap-6 justify-items-center items-center">
          <div className="skeleton h-[16rem] w-full"></div>
          <div className="skeleton h-[16rem] w-full"></div>
          <div className="skeleton h-[16rem] w-full"></div>
          <div className="skeleton h-[16rem] w-full"></div>
          <div className="skeleton h-[16rem] w-full"></div>
          <div className="skeleton h-[16rem] w-full"></div>
        </div>
      ) : (
        <>
          {data.length > 0 ? (
            <>
              <div className="w-full h-[34rem] grid grid-cols-3 gap-6 justify-items-center">
                {data.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="w-full bg-base-content h-[16rem] border-[3px] overflow-hidden hover:border-error duration-700"
                  >
                    <div className="w-full h-[11rem]">
                      <img
                        src={lesson.image}
                        alt={lesson.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full h-[5rem] flex justify-center items-center">
                      {enrollValue && enrollValue == true ? (
                        <div className="bg-error cursor-pointer w-[90%] h-[2.6rem] flex justify-center items-center text-sm font-bold rounded-lg text-white">
                          View Course
                        </div>
                      ) : (
                        <div className="bg-error cursor-pointer w-[90%] h-[2.6rem] flex justify-center items-center text-sm font-bold rounded-lg text-white">
                          Upgrade
                        </div>
                      )}
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

export default PremiumCourse;
