import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-[100px] py-6 px-20 flex justify-between items-center ">
      <Image
        src="/assets/images/logo_1.png"
        alt="Logo"
        width={140}
        height={140}
      />
      <div className="pl-[4rem] flex flex-col text-center gap-1">
        <div className="flex gap-5">
          <span className="text-xs text-secondary">Terms & Conditions</span>
          <span className="text-xs text-secondary">
            @2023 English Daily Academy.All rights reserved.
          </span>
        </div>
        <span className="text-xs text-secondary">
          This website is developed by App.com.mm
        </span>
      </div>
      <div className="flex gap-5">
        <Image
          src="/assets/images/facebook.png"
          alt="Logo"
          width={50}
          height={50}
        />
        <Image
          src="/assets/images/messenger.png"
          alt="Logo"
          width={50}
          height={50}
        />
        <Image
          src="/assets/images/google.png"
          alt="Logo"
          width={50}
          height={50}
        />
        <Image
          src="/assets/images/youtube.png"
          alt="Logo"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
};

export default Footer;
