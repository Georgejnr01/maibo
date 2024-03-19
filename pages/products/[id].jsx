import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../redux/slices/cart";
import { sanityClient } from "../../sanity";
import { formatter } from "../../utils/Formatter";

function Product({ product }) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const { products } = useSelector((state) => state.cart);
  const { rate } = useSelector((state) => state.exchangeRate);
  const [isProductDetailsOpened, setProductDetailsState] = useState(false);

  const handleToggle = () => {
    setProductDetailsState(!isProductDetailsOpened);
  };

  const addToBag = () => {
    setAdding(true);
    setTimeout(() => {
      dispatch(add({ ...product, quantity: 1 }));
      setAdding(false);
    }, 1000);
  };

  const checkIfAlreadyAdded = () => {
    let item = products.find((d) => d?._id === product?._id);
    if (item) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <div className="grid lg:grid-cols-2">
        <div className="h-96 flex justify-between items-center lg:block lg:min-h-[200vh] bg-gray space-y-12 py-16">
          <span className="relative block min-h-[20rem] w-full">
            <Image
              fill
              src={product?.productImage}
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              alt="image"
              className="object-contain object-center"
            />
          </span>
          {product?.productImage2 && (
            <span className="relative block min-h-[20rem] w-full">
              <Image
                fill
                sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                src={product?.productImage2}
                alt="image"
                className="object-contain object-center"
              />
            </span>
          )}
        </div>
        <div className="p-10 lg:h-screen lg:sticky top-20 md:px-16 lg:px-32 md:py-16">
          <span className="text-xs md:text-sm">
            {product?.new && (
              <p className="mb-3 md:text-xs">{product?.new ? "New" : ""}</p>
            )}
            <h4 className="mb-1">{product?.name}</h4>
            <p className="mt-3 text-xs md:text-sm">
              {product?.discountedPrice !== product?.originalPrice &&
                `${formatter.format(
                  product?.discountedPrice * rate
                )} from `}{" "}
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
          </span>
          <button
            type="button"
            onClick={addToBag}
            disabled={!product?.inStock || checkIfAlreadyAdded() || adding}
            style={{
              opacity:
                !product?.inStock || checkIfAlreadyAdded() || adding
                  ? ".5"
                  : "1",
            }}
            className="block w-full py-3 mt-12 text-xs text-white uppercase bg-black"
          >
            {adding ? (
              <AiOutlineLoading className="w-4 h-4 mx-auto animate-spin" />
            ) : checkIfAlreadyAdded() ? (
              "Added to Bag"
            ) : (
              "Add to Bag"
            )}
          </button>
          <span className="block mt-10 space-y-5">
            <button
              type="button"
              onClick={handleToggle}
              className="text-xs font-medium uppercase transition-all duration-200 hover:underline"
            >
              Product Details
            </button>
            <span
              className={`block overflow-hidden transition-all text-xs md:text-sm duration-300 ${
                isProductDetailsOpened ? "h-72" : "h-0"
              }`}
            >
              {product?.description}
            </span>
            <Link
              href="/contact"
              className="block text-xs font-medium uppercase transition-all duration-200 hover:underline"
            >
              Contact us
            </Link>
          </span>
        </div>
      </div>
      {/* <div className="mt-16 h-96"></div> */}
    </div>
  );
}

export default Product;

export const getStaticPaths = async () => {
  const productQuery = `*[_type == 'product']{
    _id,
  }`;

  const products = await sanityClient.fetch(productQuery);
  const paths = products.map((product) => ({
    params: {
      id: product?._id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }) => {
  const productQuery = `*[_type == 'product' && _id == $id][0]{
    _id,
    name,
    description,
    new,
    inStock,
    productLink,
    discountedPrice,
    originalPrice,
    "productImage": productImage.asset->url,
    "productImage2": productImage2.asset->url
  }`;

  const product = await sanityClient.fetch(productQuery, {
    id: params?.id,
  });

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60,
  };
};
