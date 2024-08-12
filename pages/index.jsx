import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { sanityClient } from "../sanity";

export default function Home({ categories }) {
  const [activeCat, setActiveCat] = useState(categories[0].name);
  const [catProds, setcatProds] = useState([]);

  useEffect(() => {
    const getProds = async () => {
      const getCategorizedProducts = `*[_type == 'product' && $collection in category[]->name]{
        _id,
        name,
        description,
        new,
        inStock,
        discountedPrice,
        originalPrice,
        "productImage": productImage.asset->url,
        "productImage2": productImage2.asset->url
      }`;
      const categorizedProducts = await sanityClient.fetch(
        getCategorizedProducts,
        {
          collection: activeCat,
        }
      );
      setcatProds(categorizedProducts);
    };
    getProds();
  }, [activeCat]);

  const seconds = 600;
  const timeStamp = new Date(Date.now() + seconds * 10000);

  return (
    <div>
      <Analytics />
      <div className="relative h-56 md:h-[35rem] w-full mb-12">
        <Image
          fill
          src="/assets/banner.jpg"
          priority
          alt="demo"
          className="object-cover object-center"
        />
        <div className="absolute top-0 left-0 grid w-full h-full place-items-end bg-black/40">
          <div className="relative flex flex-col text-center items-center justify-center text-white w-full h-full">
            <h1 className="max-w-[200px] md:max-w-3xl text-xl md:leading-[1.35] font-['Playfair_Display','sans-serif'] font-semibold md:text-6xl md:font-bold">
              立即购买超值优惠
            </h1>
            <h1 className="max-w-[200px] md:max-w-3xl mt-[10px] text-xl md:leading-[1.35] font-['Playfair_Display','sans-serif'] font-semibold md:text-6xl md:font-bold">
              Shop amazing deals now
            </h1>
            <Link
              href="/shop"
              className="relative block px-4 py-2 lg:px-5 lg:py-3 mx-auto mt-6 overflow-hidden font-medium transition-all duration-200 border-2 hover:border-transparent group hover:text-black w-fit"
            >
              <span className="absolute left-0 block w-full h-full transition-all duration-200 bg-white -bottom-12 group-hover:bottom-0 -z-0"></span>
              <span className="relative z-10 text-[12px] lg:text-[16px]">
                Shop Now
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mb-[12px] lg:mb-16">
        <span className="block text-center mx-auto"></span>
      </div>
      <div className="relative w-full min-h-[30vh] px-5 group md:px-16">
        <div className="">In Stock</div>
        <div className="gridImages w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              href={cat.name && `/collections/${cat.name?.replace(/ /g, "_")}`}
              key={cat._id}
              className="product overflow-hidden relative flex items-center justify-center w-full h-[150px] lg:h-[200px]"
            >
              <div className="bg-black/60 w-full h-full absolute top-0 -z-20"></div>
              {cat.image && (
                <Image
                  src={cat.image}
                  alt="image"
                  width="300"
                  height="150"
                  className="object-cover absolute -z-50"
                />
              )}

              <div className="text-center text-white z-10">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-12 lg:mt-16">
        {/* Categories */}
        <div className="w-full px-5 md:px-16 overflow-hidden shadow-sm shadow-[#e6e6e6] sticky z-40 bg-white top-[75px]">
          <div className="overflow-scroll removeScroll flex text-nowrap">
            {categories.map((i) => (
              <button
                key={i._id}
                onClick={() => setActiveCat(i.name)}
                className={`mx-5 text-sm py-[15px] ${
                  activeCat == i.name
                    ? "font-bold border-b-2 border-black"
                    : "font-normal border-none"
                }`}
              >
                {i.name}
              </button>
            ))}
          </div>
        </div>
        {catProds.length > 0 ? (
          <div className="px-5 md:px-16">
            <div className="grid grid-cols-2 gap-6 mt-6 lg:mt-12 md:gap-12 md:grid-cols-3 lg:grid-cols-4">
              {catProds.map((product) => (
                <Card key={product._id} data={product} />
              ))}
            </div>
          </div>
        ) : (
          <div>No products under this category</div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const productQuery = `*[_type == 'product'][0...20]{
    _id,
    name,
    inStock,
    discountedPrice,
    originalPrice,
    "productImage": productImage.asset->url,
    "productImage2": productImage2.asset->url
  }`;

  const products = await sanityClient.fetch(productQuery);

  const testimonialQuery = `*[_type=="testimonial"]|order(name){
    _id,
    name,
    quote,
    "profileImage": profileImage.asset -> url
  }`;

  const testimonials = await sanityClient.fetch(testimonialQuery);

  const categoryQuery = `*[_type == 'category']{
    _id,
    name,
   "slug": slug.current,
   "image": image.asset -> url,
  }`;

  const categories = await sanityClient.fetch(categoryQuery);

  return {
    props: {
      products,
      testimonials,
      categories,
    },
  };
}
