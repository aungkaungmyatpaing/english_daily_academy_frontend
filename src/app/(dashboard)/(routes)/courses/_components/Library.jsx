"use client";
import { fetchUserData } from "@/app/api/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
const Library = () => {
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

  const userInfo = session.data.user;
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
        `${process.env.NEXT_PUBLIC_API_HOST}` + "library",
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
      setData(response.data.data.library);
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
      <div className="w-full flex justify-end">
        <div className="pl-2 border-l-[3px] border-error">
          <span className="text-xl font-bold">UPGRADE TO PREMIUM</span>
        </div>
      </div>
      {miniLoader ? (
        <div className="w-full h-[44rem] grid grid-cols-4 gap-6 justify-items-center items-center">
          <div className="skeleton h-[20rem] w-full"></div>
          <div className="skeleton h-[20rem] w-full"></div>
          <div className="skeleton h-[20rem] w-full"></div>
          <div className="skeleton h-[20rem] w-full"></div>
          <div className="skeleton h-[20rem] w-full"></div>
          <div className="skeleton h-[20rem] w-full"></div>
          <div className="skeleton h-[20rem] w-full"></div>
          <div className="skeleton h-[20rem] w-full"></div>
        </div>
      ) : (
        <>
          {data.length > 0 ? (
            <>
              <div className="w-full h-[44rem] justify-items-center grid grid-cols-4 gap-16">
                {data.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="w-full bg-base-content h-[20rem] overflow-hidden "
                  >
                    <div className="w-full h-[16rem] overflow-hidden">
                      <img
                        src={lesson.image}
                        alt={lesson.name}
                        className="w-full h-full object-cover duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="w-full h-[4rem] flex justify-center items-center">
                      <div className="w-full h-[3rem] flex flex-col  items-start justify-center px-2">
                        <span className="text-sm text-base-300 line-clamp-1">
                          {lesson?.name}
                        </span>
                        <span className="text-xs text-base-300 font-[200] line-clamp-1">
                          {lesson?.author_name}
                        </span>
                      </div>
                      {!enrollValue && enrollValue == false && (
                        <div className="w-[30%] flex justify-center items-center">
                          <Image
                            src="/assets/images/lock.png"
                            alt="Logo"
                            width={20}
                            height={20}
                          />
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
              <span className="text-xl text-error font-bold">No Library</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Library;
