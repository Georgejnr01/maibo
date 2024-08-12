import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../redux/slices/cart";
import { sanityClient } from "../../sanity";
import { formatter } from "../../utils/Formatter";
import { toast } from "react-toastify";

function Product({ product }) {
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const { products } = useSelector((state) => state.cart);
  const { rate } = useSelector((state) => state.exchangeRate);
  const [isProductDetailsOpened, setProductDetailsState] = useState(false);
  const [color, setColor] = useState({ color: "", image: "" });
  const [size, setSize] = useState({ size: "", image: "" });

  const handleClickScroll = (value) => {
    const element = document.getElementById(value);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleToggle = () => {
    setProductDetailsState(!isProductDetailsOpened);
  };

  const CheckSelection = () => {
    if (product?.colors !== null && color.color == "") {
      toast.error("Please select a color");
    } else if (product?.sizes !== null && size.size == "") {
      toast.error("Please select a size");
    } else {
      addToBag();
    }
  };

  const addToBag = () => {
    const prodDetails = {
      _id: product._id + "" + color.color + "" + size.size,
      name: product.name,
      new: product.new,
      color: color,
      size: size,
      discountedPrice: product.discountedPrice,
      originalPrice: product.originalPrice,
      productImage: product.productImage,
      productLink: product.productLink,
    };
    const prod = products.find(
      ({ _id }) => _id == product._id + "" + color.color + "" + size.size
    );
    if (prod) {
      toast.error("Product with the same specifications already exists in bag");
    } else {
      dispatch(add({ ...prodDetails, quantity: 1 }));
      toast.success("Product has been added to Bag");
    }
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
    }, 1000);
  };

  return (
    <div>
      <div className="grid lg:grid-cols-2">
        <div className="lg:w-[50vw] w-[100vw] overflow-hidden bg-gray h-[30vh] lg:min-h-[100vh]">
          <div className="overflow-scroll lg:pt-[60px] flex items-center flex-row lg:flex-col w-full lg:w-full h-full">
            <div className="flex lg:flex-col">
              <div className="lg:w-[25vw] w-[50vw] min-h-[200px] lg:mb-12 mr-[3vw] lg:mr-0 lg:min-h-[350px] relative">
                {product?.productImage && (
                  <Image
                    fill
                    src={product?.productImage}
                    alt="Image"
                    className="object-contain object-center"
                  />
                )}
              </div>
              {product?.productImage2 && (
                <div className="lg:w-[25vw] w-[50vw] min-h-[200px] lg:mb-12  mr-[3vw] lg:mr-0 lg:min-h-[350px] relative">
                  {product?.productImage2 && (
                    <Image
                      fill
                      src={product?.productImage2}
                      alt="Image"
                      className="object-contain object-center"
                    />
                  )}
                </div>
              )}
              {product?.colors !== null &&
                product?.colors.map(
                  (i, index) =>
                    i.image !== null && (
                      <div
                        key={index}
                        id={i.color}
                        className="lg:w-[25vw] w-[50vw] min-h-[200px] bg-white lg:mb-12  mr-[3vw] lg:mr-0 lg:min-h-[350px] relative"
                      >
                        {i.image && (
                          <Image
                            fill
                            src={i.image}
                            alt="Image"
                            className="object-contain object-center"
                          />
                        )}
                      </div>
                    )
                )}
              {product?.sizes !== null &&
                product?.sizes.map(
                  (i, index) =>
                    i.image !== null && (
                      <div
                        key={index}
                        id={i.size}
                        className="lg:w-[25vw] w-[50vw] min-h-[200px] bg-white lg:mb-12  mr-[3vw] lg:mr-0 lg:min-h-[350px] relative"
                      >
                        {i.image && (
                          <Image
                            fill
                            src={i.image}
                            alt="Image"
                            className="object-contain object-center"
                          />
                        )}
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
        <div className="p-10 lg:sticky top-20 md:px-16 lg:px-32 md:py-16">
          <span className="text-xs md:text-sm">
            {product?.new && (
              <p className="mb-3 md:text-xs">{product?.new ? "New" : ""}</p>
            )}
            <h4 className="mb-1 font-bold">{product?.name}</h4>
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
            onClick={CheckSelection}
            className="block w-full py-3 mt-12 text-xs text-white uppercase bg-black"
          >
            {adding ? (
              <AiOutlineLoading className="w-4 h-4 mx-auto animate-spin" />
            ) : (
              "Add to bag"
            )}
          </button>
          <div
            className={`${
              product?.colors !== null ? "block" : "hidden"
            } mt-[15px] lg:mt-[30px]`}
          >
            <div className="font-bold text-xs lg:text-sm">
              Select your preferred color
            </div>
            <div className="grid grid-cols-2">
              {product?.colors !== null &&
                product?.colors.map((i, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setColor({ color: i.color, image: i.image });
                      handleClickScroll(i.color);
                    }}
                    className={`mt-[5px] p-[5px] lg:p-[10px] border-[1px] ${
                      color.color == i.color
                        ? "border-black"
                        : "border-transparent"
                    } flex items-center justify-start`}
                  >
                    {i.image != null && (
                      <div className="lg:w-[35px] w-[25px] lg:h-[35px] h-[25px] relative mr-[15px] bg-gray">
                        <Image fill src={i.image} alt="colorImg" />
                      </div>
                    )}
                    {i.color != null && (
                      <div
                        className={`text-xs text-start ${
                          color.color == i.color ? "font-bold" : "font-normal"
                        }`}
                      >
                        {i.color}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
          <div
            className={`${
              product?.sizes !== null ? "block" : "hidden"
            } mt-[10px] lg:mt-[20px]`}
          >
            <div className="font-bold text-xs lg:text-sm">
              Select your preferred size
            </div>
            <div className="grid grid-cols-2">
              {product?.sizes !== null &&
                product?.sizes.map((i, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSize({ size: i.size, image: i.image });
                      handleClickScroll(i.size);
                    }}
                    className={`mt-[10px] p-[5px] lg:p-[10px] border-[1px] ${
                      size.size == i.size
                        ? "border-black"
                        : "border-transparent"
                    } flex items-center justify-start`}
                  >
                    {i.image != null && (
                      <div className="lg:w-[35px] w-[25px] lg:h-[35px] h-[25px] relative mr-[15px] bg-gray">
                        <Image fill src={i.image} alt="sizeImg" />
                      </div>
                    )}
                    {i.size != null && (
                      <div
                        className={`text-xs ${
                          size.size == i.size ? "font-bold" : "font-normal"
                        }`}
                      >
                        {i.size}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
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
    'colors': colors[] {
      color,
      'image': image.asset->url
    },
    'sizes': sizes[] {
      size,
      'image': image.asset->url
    },
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
