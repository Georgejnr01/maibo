import Link from "next/link";
import React from "react";
import { sanityClient } from "../../sanity";
import Image from "next/image";

function Index({ categories }) {
  return (
    <div className="grid grid-cols-2 gap-6 px-5 mt-16 md:px-16 md:gap-12 md:grid-cols-3 lg:grid-cols-4">
      {categories?.map((cat) => (
        <Link
          href={`/collections/${cat.slug}`}
          key={cat._id}
          className="product overflow-hidden relative flex items-center justify-center w-full h-[200px]"
        >
          <div className="absolute top-0 w-full h-full bg-black/40 -z-20"></div>
          <Image
            src={cat.image}
            alt="image"
            width="300"
            height="150"
            className="absolute object-cover -z-50"
          />

          <div className="z-10 text-center text-white">{cat.name}</div>
        </Link>
      ))}
    </div>
  );
}

export default Index;

export async function getServerSideProps() {
  const categoryQuery = `*[_type == 'category']{
      _id,
      name,
     "slug": slug.current,
     "image": image.asset -> url,
    }`;

  const categories = await sanityClient.fetch(categoryQuery);

  return {
    props: {
      categories,
    },
  };
}
