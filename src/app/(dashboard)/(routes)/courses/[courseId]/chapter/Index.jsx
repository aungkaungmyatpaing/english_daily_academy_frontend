"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { setMainLoading } from "@/store";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChapterPage = ({ courseId }) => {
  const session = useSession();
  const BearerToken = session?.data?.accessToken;
  console.log("BearerToken", BearerToken);

  const [data, setData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [miniLoader, setMiniLoader] = useState(true);
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);
  const [ChapterTab, setChapterTab] = useState(0);
  const [chapterId, setChapterId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (BearerToken) {
      fetchData(courseId);
    }
  }, [BearerToken]);

  const fetchData = async (courseId) => {
    console.log("Bear", session);

    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "chapter/course",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            // is_premium: 0,
            course_id: courseId,
          },
        }
      );

      const data = response.data.data;
      setData(data);
      setChapters(data.chapter);

      if (data.chapter.length > 0) {
        setChapterTab(1);
        setChapterId(data.chapter[0].id); // Set the first chapter's id
        fetchLessonData(courseId, data.chapter[0].id); // Fetch lessons for the first chapter
      }
      console.log("capter", response.data.data);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setMainLoading(false));
    }
  };

  const handleChapterClick = (chapter, index) => {
    setChapterTab(index + 1); // Update the active tab
    setChapterId(chapter.id); // Update the chapter ID
    fetchLessonData(courseId, chapter.id); // Fetch lessons for the clicked chapter
  };

  const fetchLessonData = async (courseId, chapter_id) => {
    console.log("Bear", session);

    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "lesson",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            // is_premium: 0,
            course_id: courseId,
            chapter_id: chapter_id,
          },
        }
      );
      setLessons(response.data.data);

      console.log("lesson", response.data.data);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setMainLoading(false));
    }
  };

  return (
    <>
      {mainLoading ? (
        <LoadingIndicator />
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ delay: 0.23 }}
          >
            <div className="w-full h-full p-20 mb-10 flex flex-col gap-10 justify-center items-center">
              <div className="w-full flex justify-start items-center">
                <Link
                  href={`/courses/${courseId}`}
                  className="btn btn-error text-error btn-outline rounded-lg"
                >
                  <i className="fa-solid fa-angle-left"></i>
                  Back
                </Link>
              </div>
              {miniLoader ? (
                <div className="w-full h-[20rem] flex justify-center items-center">
                  <span className="loading loading-ring loading-lg"></span>
                </div>
              ) : (
                <>
                  {data ? (
                    <div className="w-full flex flex-col gap-5">
                      <div className="w-full flex justify-start">
                        <span>{data.name ?? "N/A"}</span>
                      </div>
                      <div className="w-full flex justify-between">
                        <div className=" flex justify-start items-center gap-5">
                          {data && chapters.length > 0 ? (
                            <>
                              {chapters.map((chapter, index) => (
                                <span
                                  key={index}
                                  onClick={() =>
                                    handleChapterClick(chapter, index)
                                  }
                                  className="border-l-2 border-error pl-2"
                                >
                                  {chapter.name}
                                </span>
                              ))}
                            </>
                          ) : (
                            <span className="border-l-2 border-error pl-2">
                              No Chapter
                            </span>
                          )}
                        </div>
                        <button className="btn btn-error text-white rounded-lg">
                          Start
                        </button>
                      </div>
                      <div className="w-full flex justify-start">
                        <span>{chapters.length} Sessions</span>
                      </div>
                      <div className="w-full h-[20rem] bg-green-500"></div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-5">
                      <div className="w-full h-[20rem] flex justify-center items-center">
                        <span className="text-error">There is no data</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

export default ChapterPage;
