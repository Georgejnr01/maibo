import Image from "next/image";
import React from "react";
import { AiOutlineMinusSquare, AiOutlinePlusSquare } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { decrement, increment, remove } from "../redux/slices/cart";
import { formatter } from "../utils/Formatter";

function CartItem({ product }) {
  const dispatch = useDispatch();
  return (
    <div className="flex justify-between items-start transition-all duration-200">
      <span className="flex h-32 md:h-36 items-start justify-between flex-col">
        <span className="text-xs md:text-sm">
          {product?.new && (
            <p className="md:text-xs mb-3">{product?.new ? "New" : ""}</p>
          )}
          <h4 className="mb-1">{product?.name}</h4>
          <p className="mt-3 text-xs md:text-sm">
            {product?.discountedPrice !== product?.originalPrice &&
              `${formatter.format(product?.discountedPrice)} from `}{" "}
            <span
              className={`${
                product?.discountedPrice !== product?.originalPrice
                  ? "line-through"
                  : ""
              }`}
            >
              {formatter.format(product?.originalPrice)}
            </span>
          </p>
          <span className="flex mt-3 justify-between items-center w-28">
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
          className="text-xs hover:underline"
          onClick={() => dispatch(remove({ _id: product._id }))}
        >
          Remove
        </button>
      </span>
      <span className="relative block h-32 md:h-36 w-28 md:w-32">
        <Image src={product?.productImage} alt="item" fill />
      </span>
    </div>
  );
}

export default CartItem;
