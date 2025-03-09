import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import SearchInput from "./SearchInput";
import { navBarList } from "@/constants";
import Link from "next/link";
import { HiMenuAlt2 } from "react-icons/hi";

const Header = () => {
  return (
    <header className="w-full h-20 bg-white border-b border-b-black">
      <Container className="flex items-center justify-between h-full">
        <Logo />
        <SearchInput />
        <div className=" overflow-hidden hidden md:flex space-x-4 items-center ">
          {navBarList?.map((item, index) => (
            <div key={index}>
              <Link className="navBarItem inline-block" href={item.href}>
                {item.title}
              </Link>
            </div>
          ))}
          <Link href={"/signin"} className="navBarItem">
            Sign In
          </Link>
          <Link href={"/studio"} className="navBarItem">
            Studio
          </Link>
        </div>
        <HiMenuAlt2 className="text-3xl hover:text-indigo-700 flex md:hidden cursor-pointer" />
      </Container>
    </header>
  );
};

export default Header;
