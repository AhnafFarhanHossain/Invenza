import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full py-6 px-16 bg-light-base flex items-center justify-between">
      <div>
        <Image
          src={"/invenza-white.png"}
          width={120}
          height={32}
          alt="Invenza Logo"
          className="w-auto h-auto"
        />
      </div>
      <div className="flex space-x-4">
        <a href="/" className="text-gray-600 hover:text-gray-900">
          Home
        </a>
        <a href="/about" className="text-gray-600 hover:text-gray-900">
          About
        </a>
        <a href="/contact" className="text-gray-600 hover:text-gray-900">
          Contact
        </a>
      </div>
    </div>
  );
};

export default Navbar;
