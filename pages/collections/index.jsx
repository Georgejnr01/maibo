import Link from "next/link";
import React from "react";
import { sanityClient } from "../../sanity";
import Image from "next/image";

function Index({ categories }) {
  return (
    <div className="grid grid-cols-2 gap-6 px-5 md:px-16 mt-16 md:gap-12 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((cat) => (
            <Link
              href={`/collections/${cat.slug}`}
              key={cat._id}
              className="prodct relative flex items-center justify-center w-full h-[200px]"
            >
              <div className="bg-black/60 w-full h-full absolute top-0 -z-20"></div>
              <Image
                src="/assets/bag.png"
                alt="image"
                width="300"
                height="150"
                className="object-cover absolute -z-50"
              />

              <div className="text-center text-white z-10">{cat.name}</div>
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
    }`;

  const categories = await sanityClient.fetch(categoryQuery);

  return {
    props: {
      categories,
    },
  };
}
