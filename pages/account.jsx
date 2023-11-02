import { signOut } from "@firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { RiLoader3Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "../components/Table";
import { auth } from "../firebase";
import { useGetOrders } from "../hooks/useGetOrders";
import useGetUser from "../hooks/useGetUser";
import { logout } from "../redux/slices/auth";

function Account() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, isVerifying, user } = useSelector(
    (state) => state.auth
  );
  const { data, isLoading } = useGetUser(user.uid);
  const { orders, isLoading: orderLoading } = useGetOrders(data);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      let results = orders.filter((order) => order?.id?.includes(searchTerm));
      setSearchResults([...results]);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, orders]);

  useEffect(() => {
    if (!isAuthenticated && !isVerifying) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router, isVerifying]);

  if (isVerifying) {
    return <div className="px-5 mt-20 md:px-16">Loading...</div>;
  }

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Sign Out success");
        dispatch(logout());
      })
      .catch((error) => {
        if (error) {
          toast.error("Couldn't Sign Out");
        }
      });
  };

  return (
    <div className="w-full px-5 mt-20 md:px-16">
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-end justify-between px-3 py-2 mb-5 space-x-2 text-sm font-medium transition-transform duration-200 border w-fit hover:scale-105"
      >
        <AiOutlineUser className="w-5 h-5" />
        <span>Log out</span>
      </button>
      <h1 className="text-lg font-medium md:text-xl lg:text-2xl ">Account</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex w-full text-xs lg:text-sm border-b mt-16 lg:max-w-md"
      >
        <input
          type="search"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-1 py-3 bg-transparent border-none outline-none"
          placeholder="Search orders by id"
        />
      </form>
      {!isLoading ? (
        <div className="flex flex-col items-start w-full mt-8 md:gap-x-5 gap-y-12 md:flex-row md:justify-between md:mt-10">
          <div className="md:w-[80%] w-full">
            <h2 className="mb-2 text-sm font-medium md:text-base lg:text-lg md:mb-4">
              Order History
            </h2>
            {!orderLoading ? (
              <div className="w-full overflow-auto overflow-scroll-hidden">
                {orders.length !== 0 &&
                  searchResults.length === 0 &&
                  !searchTerm && <Table data={orders} />}
                {orders.length !== 0 &&
                  searchResults.length !== 0 &&
                  searchTerm && <Table data={searchResults} />}
                {searchTerm && searchResults.length === 0 && (
                  <p className="text-xs md:text-sm text-[#3A3A3A]">
                    No order found.
                  </p>
                )}
                {orders.length === 0 && (
                  <p className="text-xs md:text-sm text-[#3A3A3A]">
                    You haven&apos;t placed any orders yet.
                  </p>
                )}
              </div>
            ) : (
              <RiLoader3Fill className="block w-6 h-6 mx-auto mt-5 text-black animate-spin" />
            )}
          </div>
          <div className="md:w-[20%] text-sm">
            <h3 className="mb-2 text-sm font-medium md:text-base lg:text-lg md:mb-3">
              Account Details
            </h3>
            <h4 className="text-[#3A3A3A]">
              <span className="uppercase">{data?.addressed_as}.</span>&nbsp;
              {`${data?.lastname} ${data?.firstname}`}
            </h4>
            <p className="text-[#3A3A3A] text-xs opacity-70 mt-1">
              {data?.email}
            </p>
            <p className="text-[#3A3A3A] text-xs opacity-70 mt-1">
              {data?.country}
            </p>
          </div>
        </div>
      ) : (
        <RiLoader3Fill className="block w-6 h-6 mx-auto mt-5 text-black animate-spin" />
      )}
    </div>
  );
}

export default Account;
