"use client";

import PlanDuration, { formatDate } from "@/helpers/formatPrice";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Account = () => {
  const [data, setData] = useState(null);
  const [miniLoader, setMiniLoader] = useState(true);
  const session = useSession();
  console.log("account use session", session);

  const BearerToken = session?.data?.accessToken;

  const [name, setName] = useState(""); // Pre-fill with the fetched name
  const [password, setPassword] = useState(""); // Password is empty initially
  const [avatar, setAvatar] = useState(null); // To store the new avatar image
  const [previewAvatar, setPreviewAvatar] = useState(""); // Show existing avatar initially
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle file selection for avatar and create a preview
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file); // Set the selected file as avatar
      setPreviewAvatar(URL.createObjectURL(file)); // Generate a preview URL for the selected file
    } else {
      // If no file is selected, you can clear the preview or handle it as needed
      setPreviewAvatar(data.avatar); // Clear the preview if no file is selected
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create form data to send with the request
    const formData = new FormData();
    formData.append("name", name);
    if (password) formData.append("password", password); // Append only if the password is provided
    if (avatar) formData.append("avatar", avatar); // Append the avatar if a new one is selected

    try {
      setIsUploading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "user/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      console.log(response);
      if (response.data.status == "success") {
        toast.success("Profile update successfully", {
          position: "top-right",
          theme: "dark",
        });
        setIsUploading(false);
        fetchData();
      }
    } catch (error) {
      setIsUploading(false);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`${error.response.data.message || "Update failed"}`, {
            position: "top-right",
            theme: "dark",
          });
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
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (BearerToken) {
      fetchData();
    }
  }, [BearerToken]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}` + "user/profile",
        {
          headers: {
            Authorization: `Bearer ${BearerToken}`, // Include Bearer token
          },
        }
      );
      const userData = response.data.data;
      setData(userData); // Store user data
      setName(userData.name); // Pre-fill name
      setPreviewAvatar(userData.avatar);
      console.log("Account", response.data.data);

      setMiniLoader(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setMiniLoader(false);
    }
  };
  return (
    <div className="w-full h-auto px-16">
      {miniLoader ? (
        <div className="w-full h-[20rem] flex flex-col justify-center items-center gap-10 bg-white rounded-2xl p-10">
          <span className="loading loading-spinner loading-lg text-error"></span>
        </div>
      ) : (
        <>
          {data ? (
            <div className="w-full h-auto flex flex-col gap-10 bg-white rounded-2xl p-10">
              <div className="w-full flex flex-col gap-5">
                <span className="text-2xl text-black font-bold">
                  Your Account
                </span>
                <div className="w-full border flex flex-col gap-3 p-5">
                  <span className="text-xl font-bold text-black">
                    Your Subscription
                  </span>
                  <span className="text-gray-500">
                    Plan Name:{" "}
                    {data.enroll &&
                    data.expire_date &&
                    data.enroll_data.length > 0 ? (
                      <span className="text-error">
                        {data.enroll_data[0].plan.name}
                      </span>
                    ) : (
                      <span className="text-error">Free</span>
                    )}
                  </span>
                  <span className="text-gray-500">
                    Valid Date:{" "}
                    {data.enroll &&
                    data.expire_date &&
                    data.enroll_data.length > 0 ? (
                      <span className="text-error">
                        {formatDate(data.expire_date)}
                        {"  "} {"("}
                        <PlanDuration
                          duration={data.enroll_data[0].plan.duration ?? 0}
                        />
                        {")"}
                      </span>
                    ) : (
                      <span className="text-error">Lifetime</span>
                    )}
                  </span>
                  <span className="text-xl font-bold text-black">
                    You have access to
                  </span>
                  {data.enroll &&
                  data.expire_date &&
                  data.enroll_data.length > 0 ? (
                    <span className="text-error">Premium course</span>
                  ) : (
                    <span className="text-error">Free course</span>
                  )}
                </div>
              </div>
              <div className="w-full flex flex-col gap-5">
                <span className="text-black text-2xl font-bold">
                  Personal information
                </span>
                <span className="text-gray-500">
                  Update your account's profile picture, name and email address{" "}
                </span>
              </div>
              <div className="w-full">
                <div className="flex flex-col items-start">
                  {/* Avatar */}
                  <div className="flex gap-5">
                    <span className="text-black text-2xl font-bold">
                      Avatar:
                    </span>
                    <div className="avatar w-60 h-60">
                      <img
                        src={previewAvatar}
                        alt="Avatar preview"
                        className="rounded-full w-60 h-60 object-cover"
                      />
                      <label htmlFor="avatar-upload">
                        <i className="absolute bottom-0 right-0 fa-regular fa-pen-to-square text-lg text-black cursor-pointer hover:text-xl duration-200"></i>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  {/* Form */}
                  <form className="mt-6 w-[60%] " onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="text-2xl font-bold text-black">
                          Name
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-primary w-full bg-white rounded-lg text-black"
                      />
                    </div>

                    {/* Email */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="text-2xl font-bold text-black">
                          Email
                        </span>
                      </label>
                      <input
                        type="email"
                        placeholder="email@gmail.com"
                        value={data?.email}
                        disabled
                        className="input input-primary w-full bg-white rounded-lg text-black disabled:bg-white disabled:text-black"
                      />
                    </div>

                    {/* Change Password */}
                    <div className="form-control mt-4">
                      <label className="label">
                        <span className="text-2xl font-bold text-black">
                          Change Password
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="***********"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input input-primary w-full bg-white rounded-lg text-black"
                        />
                        <div className="absolute right-2 top-2">
                          <i
                            onClick={() => setShowPassword((prev) => !prev)}
                            className={`text-error fa-solid ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          ></i>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="form-control mt-6">
                      <button
                        type="submit"
                        className="btn w-[10rem] btn-error text-white rounded-lg"
                        disabled={isUploading}
                      >
                        {isUploading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-[20rem] flex flex-col justify-center items-center gap-10 bg-white rounded-2xl p-10">
              <span className="text-error font-bold text-xl">No Data</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default Account;
