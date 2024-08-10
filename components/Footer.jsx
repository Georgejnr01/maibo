import Link from "next/link";
import React from "react";
import {
  AiFillInstagram,
  AiOutlineTwitter,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { BsArrowRight, BsPaypal, BsYoutube } from "react-icons/bs";
import { FaCcDiscover } from "react-icons/fa";
import { GrAmex } from "react-icons/gr";
import { RiMastercardFill, RiVisaFill } from "react-icons/ri";
import { TbBrandTiktok } from "react-icons/tb";

function Footer() {
  return (
    <footer className="mt-36">
      <div className="px-5 py-8 mb-16 border-y border-black/10 md:px-16">
        <div className="flex flex-col items-start justify-between md:flew-wrap md:flex-row md:space-x-5">
          <ul>
            <h4 className="mb-3 text-base font-medium md:text-lg">
              Quick Links
            </h4>
            <li className="mb-3 capitalize last:mb-0">
              <Link
                href={`/collections`}
                className="text-sm transition-all duration-150 hover:underline"
              >
                Collections
              </Link>
            </li>
          </ul>
          <ul className="mt-5 md:mt-0">
            <h4 className="mb-3 text-base font-medium md:text-lg">Info</h4>
            {[
              {
                title: "contact us",
                link: "/contact",
              },
              { title: "shipping policy", link: "/policy" },
            ].map((d) => (
              <li key={d.title} className="mb-3 capitalize last:mb-0">
                <Link
                  href={d.link}
                  className="text-sm transition-all duration-150 hover:underline"
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="max-w-md mt-5 md:mt-0">
            <h4 className="mb-3 text-base font-medium md:text-lg">Mission</h4>
            <p className="text-sm">
              Our goal is to rid every element of doubt and berated self esteem
              by giving our millennials classy and exquisite accessories with
              excellent packaging and superb customer service.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between mt-12 space-y-5 md:flex-row md:space-y-0 md:items-center">
          <div>
            {/* <h4 className="mb-3 text-sm font-normal md:text-base">
              Subscribe to our emails
            </h4>
            <form className="flex items-center p-1 border-2 border-black max-w-fit">
              <input
                type="email"
                name="email"
                id=""
                placeholder="Email"
                className="px-3 py-1 border-none outline-none w-60"
              />
              <button type="submit">
                <BsArrowRight className="w-5 h-5" />
              </button>
            </form> */}
          </div>
          <span className="flex items-center space-x-4">
            {[
              {
                icon: <AiOutlineWhatsApp className="w-5 h-5 text-black" />,
                link: "https://wa.me/2349042850276",
              },
              {
                icon: <AiFillInstagram className="w-5 h-5 text-black" />,
                link: "https://www.instagram.com/maibostore?igsh=MXhuaW56OHFoMTNxYQ==",
              },
            ].map((d) => (
              <Link href={d.link} key={d.link} className="">
                {d.icon}
              </Link>
            ))}
          </span>
        </div>
      </div>
      <div className="pb-8 mx-auto w-fit ">
        <span className="flex items-center mb-2 space-x-4">
          <RiVisaFill className="w-5 h-5 text-black" />
          <RiMastercardFill className="w-5 h-5 text-black" />
          <GrAmex className="w-5 h-5 text-black" />
          <BsPaypal className="w-5 h-5 text-black" />
          <FaCcDiscover className="w-5 h-5 text-black" />
        </span>
        <p className="text-xs text-center opacity-70">
          &copy; {new Date().getFullYear().toString()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
