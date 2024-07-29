import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { sanityClient } from "../sanity";

export default function Home({ products, testimonials, categories }) {
  const [isPlayed, setPlayState] = useState(false);
  const [activeCat, setActiveCat] = useState(categories[0].name);
  const [catProds, setcatProds] = useState([]);
  const handlePlay = () => {
    setPlayState(true);
  };
  const handlePause = () => {
    setPlayState(false);
  };

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
  }, [setcatProds, activeCat]);

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
            {/* <p className="mb-2 text-sm italic opacity-90">Making You New...</p> */}
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
        <span className="block text-center mx-auto">
          {/* <h2 className=" mb-2 text-2xl font-medium md:text-4xl">
            Christmas up to 70% off{" "}
            <div className=" text-red-500 ">
              <LiveTimer />{" "}
            </div>
          </h2> */}
          {/*   <p className="text-sm md:text-base">
            Functional products made of luxurious materials to improve
            people&apos;s lives in small but mighty ways.
          </p>--> */}
        </span>
        {/* <div className="grid grid-cols-2 mx-[5vw] gap-6 mt-12 md:gap-12 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 &&
            products.slice(0, 4).map((product) => (
              <Card key={product._id} data={product} />
            ))}
        </div> */}
      </div>
      {/* <div className="px-5 mb-16 md:px-16">
        <h3 className="text-xl md:text-2xl">Back in stock!</h3>
        <div className="grid gap-3 mt-5 gird-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <Link href="/collections/clothes" className="block group">
              <span className="relative block h-64 lg:h-[50rem] md:h-96 w-full overflow-hidden">
                <Image
                  src="/assets/shirt.jpg"
                  alt="image"
                  fill
                  sizes="(max-width: 768px) 100vw,
                  (max-width: 1200px) 50vw,
                  33vw"
                  className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
                />
              </span>
              <span className="flex items-center py-2 mt-3 space-x-3">
                <span>Clothes</span>
                <BsArrowRight className="w-6 h-6 transition-all duration-200 group-hover:w-8" />
              </span>
            </Link>
          </div>
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-1">
            <div>
              <Link href="/collections/bag" className="block group">
                <span className="relative block w-full h-64 overflow-hidden md:h-80">
                  <Image
                    src="/assets/bag.jpg"
                    alt="image"
                    sizes="(max-width: 768px) 100vw,
                    (max-width: 1200px) 50vw,
                    33vw"
                    fill
                    className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
                  />
                </span>
                <span className="flex items-center py-3 mt-3 space-x-3">
                  <span>Bags</span>
                  <BsArrowRight className="w-6 h-6 transition-all duration-200 group-hover:w-8" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="relative px-5 group md:px-16">
        <span
          className="relative block h-72 md:h-96 lg:h-[30rem]"
          onClick={handlePause}
        >
          <Image
            src="/assets/100000578.jpg"
            fill
            sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
            alt="thumbnail"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </span>
        <BsFillPlayCircleFill
          onClick={handlePlay}
          className="absolute w-12 h-12 text-white transition-transform duration-150 -translate-x-1/2 -translate-y-1/2 cursor-pointer md:w-16 md:h-16 hover:scale-105 top-1/2 left-1/2"
        />
        {isPlayed && (
          <div className="absolute max-w-full overflow-hidden -translate-x-1/2 -translate-y-1/2 w-fit top-1/2 left-1/2">
            <iframe
              width="560"
              height="315"
              className="max-w-full"
              src="https://www.youtube.com/embed/QqtYlY6k53I?si=SRxYa6_oaTNKhhsd"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        )}
      </div> */}
      <div className="relative w-full min-h-[30vh] px-5 group md:px-16">
        <div className="">In Stock</div>
        <div className="gridImages w-full h-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              href={`/collections/${cat.slug}`}
              key={cat._id}
              className="product overflow-hidden relative flex items-center justify-center w-full h-[150px] lg:h-[200px]"
            >
              <div className="bg-black/60 w-full h-full absolute top-0 -z-20"></div>
              <Image
                src={cat.image}
                alt="image"
                width="300"
                height="150"
                className="object-cover absolute -z-50"
              />

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
      {/* {testimonials && (
        <div className="grid grid-cols-2 gap-6 px-5 mb-16 md:px-16 md:gap-12 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="flex flex-col items-center max-w-sm text-center"
            >
              <span className="relative block w-16 h-16 overflow-hidden rounded-full">
                <Image
                  src={t.profileImage}
                  alt="testifier"
                  fill
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                />
              </span>
              <blockquote>
                <cite className="block mt-2 text-sm font-medium md:text-base">
                  {t.name}
                </cite>
                <q className="block mt-3 text-xs md:text-sm">{t.quote}</q>
              </blockquote>
            </div>
          ))}
        </div>
      )} */}
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
