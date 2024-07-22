import { Timestamp, addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineLoading, AiOutlineUser } from "react-icons/ai";
import { BsHandbag } from "react-icons/bs";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { RiMenu4Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { db } from "../../firebase";
import useSearch from "../../hooks/useSearch";
import Logo from "../../public/maibo.png";
// import LogoIcon from "../../public/assets/maiboIcon.png";
import {
  addFromLocalStorage,
  addTotalPrice,
  clear,
  addServiceCharge,
} from "../../redux/slices/cart";
import { formatter } from "../../utils/Formatter";
import CartItem from "../CartItem";

function Navbar() {
  const [isNavbarOpened, setNavbarState] = useState(false);
  const { products } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const handleToggle = () => {
    setNavbarState(!isNavbarOpened);
  };

  const [isSearchOpened, setSearchState] = useState(false);
  const handleSearchToggle = () => {
    setSearchState(!isSearchOpened);
  };

  const [isCartOpened, setCartState] = useState(false);
  const handleCartToggle = () => {
    setCartState(!isCartOpened);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-white md:px-16">
      <span
        className={`fixed bg-white/80 z-40 transition-all duration-700 h-full top-0 left-0 ${
          isNavbarOpened ? "opacity-100 w-full" : "opacity-0 w-0"
        }`}
      ></span>
      <SearchModal opened={isSearchOpened} handle={handleSearchToggle} />
      <Cart opened={isCartOpened} handle={handleCartToggle} />
      <ul
        className={`fixed md:relative z-50 top-0 right-0 h-screen md:h-auto md:w-fit w-full md:translate-x-0 md:opacity-100 md:p-0 p-5 bg-white md:flex md:items-center items-center transition-all duration-700 shadow-md md:shadow-none md:space-y-0 md:pt-0 space-y-5 pt-16 ${
          isNavbarOpened
            ? "translate-x-0 opacity-100"
            : "translate-x-[100%] opacity-0"
        }`}
      >
        <IoMdClose
          onClick={handleToggle}
          className="absolute w-5 h-5 transition-all duration-150 cursor-pointer md:hidden top-5 right-5 hover:scale-110"
        />
        {[
          {
            title: "shop",
            link: "/shop",
          },
          {
            title: "collections",
            link: "/collections",
          },
          {
            title: "contact",
            link: "/contact",
          },
        ].map((d) => (
          <li
            key={d.link}
            className="block text-xs transition-all duration-300 md:inline-block md:mr-5 md:last-of-type:mr-0 group hover:bg-[#ff2a00] md:hover:bg-transparent"
          >
            <Link
              title={d.title}
              onClick={handleToggle}
              href={d.link}
              className="block px-5 py-3 capitalize transition-all duration-300 md:hidden group-hover:text-white"
            >
              {d.title}
            </Link>
            <Link
              title={d.title}
              href={d.link}
              className="hidden px-0 py-0 capitalize transition-all duration-300 md:block"
            >
              {d.title}
            </Link>
          </li>
        ))}
      </ul>
      <span className="flex items-center space-x-2 md:space-x-0">
        <RiMenu4Fill
          className="w-5 h-5 cursor-pointer md:hidden"
          onClick={handleToggle}
        />
        <Link href="/" className="relative w-[6.75rem] h-[2.85rem]">
          <Image
            src={Logo}
            alt="Maibo"
            fill
            className=" object-cover object-center"
          />
          {/* 
          <Image
            src={LogoIcon}
            alt="Maibo"
            fill
            className="object-cover object-center sm:hidden"
          /> */}
        </Link>
      </span>

      <ul className="flex items-center space-x-3 md:space-x-6">
        <li>
          <IoIosSearch
            onClick={handleSearchToggle}
            className="w-5 h-5 cursor-pointer"
            title="Search"
          />
        </li>
        <li className="relative">
          <Link
            title={Object.keys(user).length > 0 ? "Account" : "Login"}
            href={Object.keys(user).length > 0 ? "/account" : "/auth/login"}
          >
            <AiOutlineUser className="w-5 h-5" />
          </Link>
        </li>
        <li className="relative">
          <BsHandbag
            className="w-5 h-5 cursor-pointer"
            title="Bag"
            onClick={handleCartToggle}
          />
          <span className="absolute grid px-1 text-xs font-medium text-white bg-[#ff2a00] rounded-full place-items-center -top-1 -right-1">
            {products.length}
          </span>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

function SearchModal({ opened, handle }) {
  const [term, setTerm] = useState("");

  const { data } = useSearch(term);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <span
        className={`fixed z-40 bg-white/70 transition-all duration-700 h-full top-0 left-0 ${
          opened ? "opacity-100 w-full" : "opacity-0 w-0"
        }`}
      ></span>
      <div
        className={`fixed z-50 top-0 right-0 h-screen w-full md:w-1/2 p-5 bg-white items-center overflow-auto overflow-scroll-hidden transition-all duration-700 shadow-md space-y-5 pt-16 ${
          opened ? "translate-x-0 opacity-100" : "translate-x-[100%] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handle}
          className="absolute text-xs font-medium uppercase top-5 right-5"
        >
          Close
        </button>
        <form onSubmit={handleSubmit} className="flex w-full text-xs border-b">
          <input
            type="text"
            name="term"
            value={term}
            className="w-full px-1 py-3 bg-transparent border-none outline-none"
            onChange={(e) => setTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-5 py-3 font-medium uppercase bg-transparent"
          >
            Search
          </button>
        </form>
        {data.length > 0 && (
          <div>
            <h3 className="mt-10 mb-5 text-xs underline uppercase">Results</h3>
            <div className="space-y-4">
              {data.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={handle}
                  className="block text-xs uppercase transition-transform duration-200 hover:scale-100 hover:underline"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        {data.length === 0 && term && (
          <p className="mt-10 text-xs text-center uppercase">
            Product not available
          </p>
        )}
      </div>
    </>
  );
}

function Cart({ opened, handle }) {
  const { products } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { rate } = useSelector((state) => state.exchangeRate);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in before checkout");
      handle();
      return router.push("/auth/login");
    }
    setLoading(true);

    const OrderedProducts = products.map((product) => ({
      id: product._id,
      name: product.name,
      link: product.productLink,
      quantity: product.quantity,
      image: product.productImage,
      price: product.discountedPrice * rate || product.originalPrice * rate,
      color: product.color.color,
      size: product.size.size,
    }));

    try {
      addDoc(collection(db, "orders"), {
        order: [...OrderedProducts],
        user: user.uid,
        totalPrice,
        serviceCharge,
        date_created: new Date().toLocaleString("default", {
          dateStyle: "full",
        }),
        payment_status: "Pending",
        fulfillment_status: "Pending",
        checkoutDetails: {},
      }).then((data) => {
        setLoading(false);
        handle();
        dispatch(clear());
        if (data.id) {
          router.push({
            pathname: "/checkout",
            query: { order_id: data.id },
          });
        }
      });
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      let price = 0;
      products.forEach((item) => {
        price += item?.discountedPrice
          ? item?.discountedPrice * rate * item.quantity
          : item?.originalPrice * rate * item.quantity;
      });
      setTotalPrice(price);
      dispatch(addTotalPrice(price));
      let service = 0;
      products.forEach((item) => {
        service += 80 * item.quantity;
      });
      setServiceCharge(service);
      dispatch(addServiceCharge(service));
    } else {
      setTotalPrice(0);
      let cart = localStorage.getItem("products");
      if (cart && products.length === 0) {
        const parsed = JSON.parse(cart);
        if (parsed.length > 0) {
          dispatch(addFromLocalStorage(parsed));
        }
      }
    }
  }, [dispatch, products, rate]);
  return (
    <>
      <span
        className={`fixed z-40 bg-white/70 transition-all duration-700 h-full top-0 left-0 ${
          opened ? "opacity-100 w-full" : "opacity-0 w-0"
        }`}
      ></span>
      <div
        className={`fixed z-50 top-0 right-0 h-screen w-full md:w-1/2 p-5 bg-white items-center transition-all duration-700 shadow-md space-y-5 pt-16 ${
          opened ? "translate-x-0 opacity-100" : "translate-x-[100%] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handle}
          className="absolute text-xs font-medium uppercase top-5 right-5"
        >
          Close
        </button>
        <div className="relative space-y-10 overflow-auto h-[500px] lg:h-[450px] overflow-scroll-hidden">
          {products.map((p) => (
            <CartItem key={p._id} product={p} />
          ))}
        </div>
        <span className="absolute bottom-0 left-0 block w-full pt-5 pb-10 bg-white">
          <p className="flex justify-between items-center w-[90%] mx-auto text-xs mb-3">
            <span>Estimated Total</span>
            <span>{formatter.format(totalPrice)}</span>
          </p>
          <Link href="/checkout">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading || products.length === 0}
              style={{
                opacity: loading || products.length === 0 ? "0.5" : "1",
              }}
              className=" block w-[90%] mx-auto py-2 uppercase  bg-black text-white text-sm text-center border-2 "
            >
              {loading ? (
                <AiOutlineLoading className="w-5 h-5 mx-auto animate-spin" />
              ) : (
                "Check out"
              )}
            </button>
          </Link>
        </span>
      </div>
    </>
  );
}
