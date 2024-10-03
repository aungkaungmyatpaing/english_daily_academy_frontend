"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const Test = ({ mcq, true_false, BearerToken }) => {
  const [tab, setTab] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [trueFalseAnswers, setAnswers] = useState({});

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
        <div className="w-full flex flex-col gap-10">
          {tab === 1 && (
            <>
              {mcq && mcq.length > 0 ? (
                <>
                  {mcq
                    .filter((item) => item.mca.length > 0)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="w-full h-auto flex rounded-xl border border-base-content p-10 gap-5"
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
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleSelectAnswer(item.id, ans.id)
                                  }
                                  className={`btn rounded-lg ${
                                    selectedAnswers[item.id] === ans.id
                                      ? "btn-primary text-white" // Apply selected color
                                      : "btn-ghost btn-outline text-black" // Default color
                                  }`}
                                >
                                  {ans.text}
                                </button>
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
                  {isAllAnswered && (
                    <div className="w-full flex justify-center mt-5">
                      <button
                        onClick={handleMcqSubmit}
                        className="btn btn-success"
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
          {tab === 2 && (
            <>
              {true_false && true_false.length > 0 ? (
                <>
                  {true_false.map((item, index) => (
                    <div
                      key={index}
                      className="w-full h-auto flex rounded-xl border border-base-content p-10 gap-5"
                    >
                      <div className="w-[12%] flex justify-center">
                        <div className="btn btn-error text-white rounded-xl px-5">
                          {index + 1}
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-5">
                        <p className="w-full text-black">{item.text}</p>
                        <div className="w-full flex justify-start items-center gap-5 text-black">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`radio-${index}`}
                              onChange={() =>
                                handleTrueFalseSelect(item.id, true)
                              }
                              className="radio w-[1rem] h-[1rem]  radio-secondary"
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
                              className="radio w-[1rem] h-[1rem]  radio-secondary"
                            />
                            <span>False</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isAllTrueFlase && (
                    <div className="w-full flex justify-center mt-5">
                      <button
                        onClick={handleTFSubmit}
                        className="btn btn-success"
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
        </div>
      </div>
    </div>
  );
};

export default Test;
