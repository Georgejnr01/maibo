import Image from "next/image";
import React from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment, remove } from "../redux/slices/cart";
import { formatter } from "../utils/Formatter";

function CartItem({ product }) {
  const dispatch = useDispatch();
  const { rate } = useSelector((state) => state.exchangeRate);
  return (
    <div className="flex w-full pb-[10px] shadow-sm shadow-[#b3b3b3] justify-between items-center transition-all duration-200">
      <span className="flex h-[146px] md:h-[156px] items-start justify-between flex-col">
        <span className="text-xs md:text-sm">
          {product?.new && (
            <p className="md:text-xs font-bold mb-1 lg:mb-2">
              {product?.new ? "New!" : ""}
            </p>
          )}
          <h4 className="mb-1 h-[20px] w-[180px] lg:w-[450px] 2xl:w-[600px] truncate">
            {product?.name}
          </h4>
          <div className="lg:mt-2 lg:flex items-center">
            {product?.color.color !== "" && product?.color.image !== "" && (
              <div className="flex items-center mr-[20px]">
                <div className="font-bold mr-[5px]">Color:</div>
                {product?.color.image && product?.color.image !== "" && (
                  <div className="w-[15px] h-[15px] relative bg-gray mr-[5px]">
                    <Image src={product?.color.image} fill alt="colorImg" />
                  </div>
                )}
                {product?.color.color !== "" && (
                  <div>{product?.color.color}</div>
                )}
              </div>
            )}
            {product?.size.image !== "" && product?.size.size !== "" && (
              <div className=" mt-[5px] lg:mt-0 flex items-center">
                <div className="font-bold mr-[5px]">Size:</div>
                {product?.size.image && product?.size.image !== "" && (
                  <div className="w-[15px] h-[15px] relative bg-gray mr-[5px]">
                    <Image src={product?.size.image} fill alt="sizeImg" />
                  </div>
                )}
                {<div>{product?.size.size}</div>}
              </div>
            )}
          </div>
          <p className="mt-1 lg:mt-2 text-xs md:text-sm">
            {product?.discountedPrice !== product?.originalPrice &&
              `${formatter.format(product?.discountedPrice * rate)} from `}{" "}
            <span
              className={`${
                product?.discountedPrice !== product?.originalPrice
                  ? "line-through"
                  : ""
              }`}
            >
              {formatter.format(product?.originalPrice * rate)}
            </span>
          </p>
          <span className="flex mt-1 lg:mt-2 justify-between items-center w-28">
            <AiOutlineMinusSquare
              className="w-5 opacity-80 h-5 cursor-pointer"
              onClick={() => {
                if (product.quantity > 1) {
                  dispatch(decrement({ _id: product._id }));
                }
              }}
            />
            <p className="md:text-xs font-medium opacity-70">
              Qty: {product.quantity}
            </p>
            <AiOutlinePlusSquare
              className="w-5 opacity-80 h-5 cursor-pointer"
              onClick={() => dispatch(increment({ _id: product._id }))}
            />
          </span>
        </span>
        <button
          className="text-xs mt-1 lg:mt-2 hover:underline"
          onClick={() => dispatch(remove({ _id: product._id }))}
        >
          Remove
        </button>
      </span>
      <span className="relative block h-[146px] md:h-[156px] w-32 md:w-[132px]">
        {product?.productImage && (
          <Image
            src={product?.productImage}
            alt="item"
            fill
            className="object-cover object-center"
          />
        )}
      </span>
    </div>
  );
}

export default CartItem;
