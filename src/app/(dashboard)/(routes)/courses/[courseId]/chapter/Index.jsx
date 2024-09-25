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
  const [lessonDetail, setLessonDetail] = useState(null);
  const [IslessonDetail, setIsLessonDetail] = useState(false);

  const [miniLoader, setMiniLoader] = useState(true);
  const mainLoading = useSelector((state) => state.mainLoading.mainLoading);
  const [ChapterTab, setChapterTab] = useState(0);
  const [chapterId, setChapterId] = useState(null);
  const [LessonIndex, setLessonIndex] = useState(0);
  const [sessionLenght, setSessionLenght] = useState(0);

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
        fetchLessonData(courseId, data.chapter[0].id);
        // Fetch lessons for the first chapter
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

  const handleLessonDetailClick = () => {
    setLessonIndex(LessonIndex + 1);
    const newLessonIndex = LessonIndex;
    setIsLessonDetail(true);
    fetchLessonDetail(lessons[newLessonIndex].id);
  };

  const fetchLessonDetail = async (id) => {
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
            id: id,
          },
        }
      );
      setLessonDetail(response.data.data);

      console.log("lesson", response.data.data);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setMainLoading(false));
    }
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
      setSessionLenght(response.data.data.length);

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
                          {IslessonDetail && lessonDetail.length == 1 ? (
                            <span className="">
                              {lessonDetail[0].chapter.name}
                            </span>
                          ) : (
                            <>
                              {data && chapters.length > 0 ? (
                                <>
                                  {chapters.map((chapter, index) => (
                                    <span
                                      key={index}
                                      onClick={() =>
                                        handleChapterClick(chapter, index)
                                      }
                                      className={`${
                                        ChapterTab == index + 1
                                          ? "border-error"
                                          : ""
                                      } border-l-2 pl-2 cursor-pointer`}
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
                            </>
                          )}
                        </div>
                        {lessons.length > 0 && !IslessonDetail && (
                          <button
                            onClick={() => handleLessonDetailClick()}
                            className="btn btn-error text-white rounded-lg"
                          >
                            Start
                          </button>
                        )}
                      </div>
                      {IslessonDetail && lessonDetail.length == 1 ? (
                        <div className="w-full h-full gap-10 flex flex-col justify-center items-center ">
                          <div className="w-full gap-10 h-auto py-10 bg-white flex">
                            <div className="w-[12%] flex justify-end">
                              <div className="btn btn-error text-white rounded-xl px-5">
                                {LessonIndex}
                              </div>
                            </div>
                            <div className="w-full flex gap-5 flex-col">
                              <span className="text-error text-lg">
                                {lessonDetail[0].name ?? "N/A"}
                              </span>
                              <span className="text-black font-bold">
                                {lessonDetail[0].chapter.name ?? "N/A"}
                              </span>
                              <span className="text-black">
                                {lessonDetail[0].is_quiz
                                  ? "This is a Quiz"
                                  : lessonDetail[0].content
                                  ? "This is artical"
                                  : "Video session"}
                              </span>
                              <div className="w-[40%] flex justify-between">
                                <span className="text-error">
                                  {lessonDetail[0].is_quiz ? (
                                    <>
                                      <i className="fa-regular fa-layer-group"></i>{" "}
                                      Quiz
                                    </>
                                  ) : lessonDetail[0].content ? (
                                    <>
                                      <i className="fa-regular fa-book"></i>{" "}
                                      Article
                                    </>
                                  ) : (
                                    <>
                                      <i className="fa-regular fa-clapperboard-play"></i>{" "}
                                      Video
                                    </>
                                  )}
                                </span>
                                <span className="text-black">
                                  Duration{"  "}
                                  <i className="fa-regular fa-clock text-error"></i>
                                  {"  "}
                                  {lessonDetail[0].duration} min
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-full flex flex-col gap-5 justify-center items-center px-20">
                            <span className="text-lg text-white">
                              Chapter Name
                            </span>
                            {lessonDetail[0].is_quiz ? (
                              "This is a Quiz"
                            ) : lessonDetail[0].content ? (
                              <p className="">{lessonDetail[0].content}</p>
                            ) : (
                              <div className="w-full flex flex-col justify-center items-center">
                                {lessonDetail.length > 0 &&
                                lessonDetail[0].video ? (
                                  <video width="600" controls playsInline>
                                    <source
                                      src={lessonDetail[0].video}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <p>Video is not available.</p>
                                )}
                                <span>Description</span>
                                <p>{lessonDetail[0].description}</p>
                              </div>
                            )}

                            <div className="w-full flex justify-end">
                              <button
                                onClick={() => handleLessonDetailClick()}
                                className="btn btn-error text-white rounded-lg"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-full flex justify-start">
                            <span>{sessionLenght} Sessions</span>
                          </div>
                          <div className="w-full h-full gap-10 flex flex-col justify-center items-center ">
                            {miniLoader ? (
                              <div className="w-full h-[20rem] flex justify-center items-center">
                                <span className="loading loading-ring loading-lg"></span>
                              </div>
                            ) : (
                              <>
                                {lessons.length > 0 ? (
                                  <>
                                    {lessons.map((lesson, index) => (
                                      <div
                                        key={index}
                                        className="w-full gap-10 h-auto py-10 bg-white flex"
                                      >
                                        <div className="w-[12%] flex justify-end">
                                          <div className="btn btn-error text-white rounded-xl px-5">
                                            {index + 1}
                                          </div>
                                        </div>
                                        <div className="w-full flex gap-5 flex-col">
                                          <span className="text-error text-lg">
                                            {lesson.name ?? "N/A"}
                                          </span>
                                          <span className="text-black font-bold">
                                            {lesson.chapter.name ?? "N/A"}
                                          </span>
                                          <span className="text-black">
                                            {lesson.is_quiz
                                              ? "This is a Quiz"
                                              : lesson.content
                                              ? "This is artical"
                                              : "Video session"}
                                          </span>
                                          <div className="w-[40%] flex justify-between">
                                            <span className="text-error">
                                              {lesson.is_quiz ? (
                                                <>
                                                  <i className="fa-regular fa-layer-group"></i>{" "}
                                                  Quiz
                                                </>
                                              ) : lesson.content ? (
                                                <>
                                                  <i className="fa-regular fa-book"></i>{" "}
                                                  Article
                                                </>
                                              ) : (
                                                <>
                                                  <i className="fa-regular fa-clapperboard-play"></i>{" "}
                                                  Video
                                                </>
                                              )}
                                            </span>
                                            <span className="text-black">
                                              Duration{"  "}
                                              <i className="fa-regular fa-clock text-error"></i>
                                              {"  "}
                                              {lesson.duration} min
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                ) : (
                                  <>No Data</>
                                )}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col gap-5">
                      <div className="w-full h-full flex justify-center items-center">
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
