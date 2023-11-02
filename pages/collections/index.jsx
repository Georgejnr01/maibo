import Link from "next/link";
import React from "react";
import { sanityClient } from "../../sanity";

function Index({ categories }) {
  return (
    <div className="grid grid-cols-2 gap-6 px-5 md:px-16 mt-16 md:gap-12 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((cat) => (
        <Link
          href={`/collections/${cat.slug}`}
          key={cat._id}
          className="p-3 w-full h-full md:h-32 border-2 grid transition-all duration-200 hover:bg-slate-200 place-items-center border-black"
        >
          <h2 className="text-sm font-semibold">{cat.name}</h2>
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
