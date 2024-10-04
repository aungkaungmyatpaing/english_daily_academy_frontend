"use client";

import axios from "axios";
import { space } from "postcss/lib/list";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Test = ({ mcq, true_false, BearerToken, lessonId }) => {
  const [tab, setTab] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedTFAnswers, setSelectedTFAnswers] = useState({});

  const [trueFalseAnswers, setAnswers] = useState({});
  const [miniLoader, setMiniLoader] = useState(true);
  const [checkMcqData, setCheckMcqData] = useState(null);
  const [checkTrueFalseData, setCheckTrueFalseData] = useState(null);

  const [isSubmitedMcq, setIsSubmitedMcq] = useState(false);
  const [isSubmitedTrueFlase, setIsSubmitedTrueFalse] = useState(false);

  console.log(mcq);
  console.log("MCQ Lenght", mcq.length);

  const handleTabChange = () => {
    setTab((prevTab) => (prevTab < 2 ? prevTab + 1 : 1)); // Increment tab, reset to 1 if it exceeds 2
  };

  // Handle selecting an answer
  const handleSelectAnswer = (mcqId, mcaId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [mcqId]: mcaId,
    }));
  };

  const handleTrueFalseSelect = (id, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: value, // Store the true/false value with question id as key
    }));
  };

  // Check if all mcqs have an answer selected
  const isAllAnswered =
    mcq.length > 0 && Object.keys(selectedAnswers).length === mcq.length;

  const isAllTrueFlase =
    true_false.length > 0 &&
    Object.keys(trueFalseAnswers).length === true_false.length;

  // Handle submit
  const handleMcqSubmit = async () => {
    const payload = Object.entries(selectedAnswers).map(([mcqId, mcaId]) => ({
      mcq_id: mcqId,
      mca_id: mcaId,
    }));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "student/choice/create",
        {
          answers: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`,
          },
        }
      );
      if (response.data.status == "success") {
        toast.success("Submited!", {
          position: "top-right",
          theme: "dark",
        });
        setIsSubmitedMcq(true);
        fetchCheckMcqData(lessonId);
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

  useEffect(() => {
    fetchCheckMcqData(lessonId);
    fetchCheckTrueFalseData(lessonId);
  }, [lessonId]);

  const fetchCheckMcqData = async (lessonId) => {
    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "student/mca/check",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            // is_premium: 0,
            lesson_id: lessonId,
          },
        }
      );

      setCheckMcqData(response.data.data);
      const preselectedAnswers = {};
      if (response.data.data.user_mca) {
        response.data.data.user_mca.forEach((answer) => {
          preselectedAnswers[answer.mcq_id] = answer.mca_id;
        });
        setSelectedAnswers(preselectedAnswers);
      }

      setIsSubmitedMcq(response.data.data.user_mca_count > 0);

      console.log("check mcq", response.data.data);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setMiniLoader(false);
    }
  };

  const fetchCheckTrueFalseData = async (lessonId) => {
    setMiniLoader(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "student/truefalse/check",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
          params: {
            // is_premium: 0,
            lesson_id: lessonId,
          },
        }
      );

      setCheckTrueFalseData(response.data.data);

      setIsSubmitedTrueFalse(response.data.data.user_true_false_count > 0);

      console.log("check true false", response.data.data);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setMiniLoader(false);
    }
  };

  const handleTFSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "student/truefalse/create",
        {
          trueFalseAnswers,
        },
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`,
          },
        }
      );
      if (response.data.status == "success") {
        toast.success("Submited!", {
          position: "top-right",
          theme: "dark",
        });
        setIsSubmitedTrueFalse(true);
        fetchCheckTrueFalseData(lessonId);
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

  console.log(true_false);

  return (
    <div className="w-full flex justify-center px-20">
      <div className="w-full h-auto bg-white rounded-3xl flex flex-col items-center p-10 gap-5">
        <div className="w-full grid grid-cols-3 justify-items-center">
          <div className="block">
            {tab === 1 && isSubmitedMcq && checkMcqData.passed && (
              <span className="text-success">
                Congratution you pass this test
              </span>
            )}

            {tab === 2 && isSubmitedTrueFlase && checkTrueFalseData.passed && (
              <span className="text-success">
                Congratution you pass this test
              </span>
            )}
          </div>

          <span className="text-xl text-error">
            {tab === 2 && (
              <i
                onClick={() => handleTabChange()}
                className="fa-regular fa-chevron-left mr-5 text-base text-black"
              ></i>
            )}
            {tab === 1 && "Multiple Choice"}
            {tab === 2 && "True/False"}{" "}
            {tab === 1 && (
              <i
                onClick={() => handleTabChange()}
                className="ml-5 fa-regular fa-chevron-right text-base text-black"
              ></i>
            )}
          </span>
          <div className="block">
            {tab === 1 && isSubmitedMcq && checkMcqData && (
              <span className="text-black">
                Score: {checkMcqData.correct_answer_count}/
                {checkMcqData.user_mca_count}{" "}
                {checkMcqData.passed ? (
                  <span className="text-success">Passed</span>
                ) : (
                  <span className="text-error">Failed</span>
                )}
              </span>
            )}

            {tab === 2 && isSubmitedTrueFlase && checkTrueFalseData && (
              <span className="text-black">
                Score: {checkTrueFalseData.correct_answer_count}/
                {checkTrueFalseData.user_true_false_count}{" "}
                {checkTrueFalseData.passed ? (
                  <span className="text-success">Passed</span>
                ) : (
                  <span className="text-error">Failed</span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-10">
          {tab === 1 && (
            <>
              {miniLoader ? (
                <div className="w-full h-[10rem] bg-white flex justify-center items-center">
                  <span className="loading loading-ring loading-lg text-error"></span>
                </div>
              ) : (
                <>
                  {mcq && mcq.length > 0 ? (
                    <>
                      {mcq
                        .filter((item) => item.mca.length > 0)
                        .map((item, index) => (
                          <div
                            key={index}
                            className={`w-full h-auto flex rounded-xl border  p-10 gap-5 ${
                              isSubmitedMcq
                                ? "border-green-400"
                                : "border-base-content"
                            }`}
                          >
                            <div className="w-[12%] flex justify-center">
                              <div className="btn btn-error text-white rounded-xl px-5">
                                {index + 1}
                              </div>
                            </div>
                            <div className="w-full flex flex-col gap-5">
                              <p className="w-full text-black">{item.text}</p>
                              {item.mca.length > 0 ? (
                                <div className="w-full grid grid-cols-2 gap-5">
                                  {item.mca.map((ans, index) => (
                                    <>
                                      {isSubmitedMcq ? (
                                        <button
                                          key={index}
                                          className={`btn rounded-lg ${
                                            isSubmitedMcq &&
                                            selectedAnswers[item.id] === ans.id
                                              ? item.correct_mca_id === ans.id
                                                ? "btn-success btn-outline text-white " // Correct selected answer
                                                : "btn-error btn-outline text-error " // Incorrect selected answer
                                              : selectedAnswers[item.id] ===
                                                ans.id
                                              ? "btn-primary text-white" // Selected answer before submission
                                              : "btn-ghost btn-outline text-black cursor-not-allowed" // Default unselected state
                                          }`}
                                        >
                                          {ans.text}
                                        </button>
                                      ) : (
                                        <button
                                          key={index}
                                          onClick={() =>
                                            handleSelectAnswer(item.id, ans.id)
                                          }
                                          className={`btn rounded-lg ${
                                            isSubmitedMcq &&
                                            selectedAnswers[item.id] === ans.id
                                              ? item.correct_mca_id === ans.id
                                                ? "btn-success btn-outline text-white " // Correct selected answer
                                                : "btn-error btn-outline text-error " // Incorrect selected answer
                                              : selectedAnswers[item.id] ===
                                                ans.id
                                              ? "btn-primary text-white" // Selected answer before submission
                                              : "btn-ghost btn-outline text-black " // Default unselected state
                                          }`}
                                        >
                                          {ans.text}
                                        </button>
                                      )}
                                    </>
                                  ))}
                                </div>
                              ) : (
                                <div className="w-full grid grid-cols-2 gap-5">
                                  <button className="btn btn-error btn-outline rounded-lg text-error cursor-not-allowed">
                                    There is no answer
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      {!isSubmitedMcq && isAllAnswered && (
                        <div className="w-full flex justify-end mt-5">
                          <button
                            onClick={handleMcqSubmit}
                            className="btn btn-error text-white rounded-xl"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>No Data</>
                  )}
                </>
              )}
            </>
          )}
          {tab === 2 && (
            <>
              {miniLoader ? (
                <div className="w-full h-[10rem] bg-white flex justify-center items-center">
                  <span className="loading loading-ring loading-lg text-error"></span>
                </div>
              ) : (
                <>
                  {true_false && true_false.length > 0 ? (
                    <>
                      {true_false.map((item, index) => {
                        const userAnswer =
                          checkTrueFalseData.user_true_flase.find(
                            (answer) => answer.true_false_id === item.id
                          );

                        const isCorrect =
                          userAnswer &&
                          userAnswer.true_false === item.correct_true_false;

                        console.log("Item:", item);
                        console.log("User Answer:", userAnswer);
                        console.log("Is Correct:", isCorrect);

                        return (
                          <div
                            key={index}
                            className={`w-full h-auto flex rounded-xl border  p-10 gap-5 ${
                              isSubmitedTrueFlase
                                ? "border-green-400"
                                : "border-base-content"
                            }`}
                          >
                            <div className="w-[12%] flex justify-center">
                              <div className="btn btn-error text-white rounded-xl px-5">
                                {index + 1}
                              </div>
                            </div>
                            <div className="w-full flex flex-col gap-5">
                              <p className="w-full text-black">{item.text}</p>
                              <div className="w-full flex justify-start items-center gap-5 text-black">
                                {isSubmitedTrueFlase ? (
                                  <>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`radio-${index}`}
                                        className={`radio w-[1rem] h-[1rem] ${
                                          userAnswer?.true_false === true
                                            ? isCorrect
                                              ? "radio-success"
                                              : "radio-error"
                                            : ""
                                        }`}
                                        checked={
                                          userAnswer?.true_false === true
                                        }
                                        // disabled
                                      />
                                      <span
                                        className={`text-black ${
                                          userAnswer?.true_false === true
                                            ? isCorrect
                                              ? "text-success"
                                              : "text-error"
                                            : ""
                                        }`}
                                      >
                                        True
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`radio-${index}`}
                                        className={`radio w-[1rem] h-[1rem] ${
                                          userAnswer?.true_false === false
                                            ? isCorrect
                                              ? "radio-success"
                                              : "radio-error"
                                            : ""
                                        }`}
                                        checked={
                                          userAnswer?.true_false === false
                                        }
                                        // disabled
                                      />
                                      <span
                                        className={`text-black ${
                                          userAnswer?.true_false === false
                                            ? isCorrect
                                              ? "text-success"
                                              : "text-error"
                                            : ""
                                        }`}
                                      >
                                        False
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`radio-${index}`}
                                        onChange={() =>
                                          handleTrueFalseSelect(item.id, true)
                                        }
                                        className="radio w-[1rem] h-[1rem] radio-secondary"
                                      />
                                      <span>True</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`radio-${index}`}
                                        onChange={() =>
                                          handleTrueFalseSelect(item.id, false)
                                        }
                                        className="radio w-[1rem] h-[1rem] radio-secondary"
                                      />
                                      <span>False</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {!isSubmitedTrueFlase && isAllTrueFlase && (
                        <div className="w-full flex justify-end mt-5">
                          <button
                            onClick={handleTFSubmit}
                            className="btn btn-error text-white rounded-xl"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>No Data</>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;
