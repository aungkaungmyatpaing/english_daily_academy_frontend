"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();
  const session = useSession();

  console.log("Use Session", session);

  const isActive = (path) => pathname === path;
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="w-full h-[90px] py-2 px-20 flex justify-between bg-base-200">
      <Image
        src="/assets/images/logo_1.png"
        alt="Logo"
        width={200}
        height={200}
      />
      <div className="flex items-center gap-20 font-bold">
        <div
          className={`py-2 ${
            isActive("/") ? "border-b-[3px] border-b-error" : ""
          }`}
        >
          <Link href="/">Home</Link>
        </div>
        <div
          className={`py-2 ${
            isActive("/courses") ? "border-b-[3px] border-b-error" : ""
          }`}
        >
          <Link href="/courses">Courses</Link>
        </div>
        <div
          className={`py-2 ${
            isActive("/pricing") ? "border-b-[3px] border-b-error" : ""
          }`}
        >
          <Link href="/pricing">Pricing</Link>
        </div>
        <div
          className={`py-2 ${
            isActive("/aboutus") ? "border-b-[3px] border-b-error" : ""
          }`}
        >
          <Link href="/aboutus">About Us</Link>
        </div>

        {session.status == "authenticated" && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar">
              <div className="w-16 rounded-full">
                <img
                  src={
                    session?.data?.user?.avatar ||
                    session?.data?.user?.image ||
                    "/assets/images/logo_2.png"
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow"
            >
              <li>
                <Link href={"/profile"}>
                  <i className="fa-solid fa-user"></i> Profile
                </Link>
              </li>
              <li>
                <a onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
