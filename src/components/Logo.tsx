import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

const Logo = () => {
  return (
    <Link href="/">
      <h2
        className={twMerge(
          "text-2xl text-black hover:text-indigo-700 font-bold uppercase  duration-300 hover:scale-105 active:scale-90 transition-all ease-in-out"
        )}
      >
        Shopping
      </h2>
    </Link>
  );
};

export default Logo;
