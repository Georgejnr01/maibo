import React from "react";
import Card from "../../components/Card";
import { sanityClient } from "../../sanity";

function Collection({ products }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mt-16 md:gap-12 md:grid-cols-3 lg:grid-cols-4">
        {products.length > 0 &&
          products.map((product) => <Card key={product._id} data={product} />)}
      </div>
      {products.length === 0 && (
        <p className="text-xs mt-10 uppercase text-center font-medium">
          Product not available under this collection
        </p>
      )}
    </div>
  );
}

export default Collection;

export const getStaticPaths = async () => {
  const categoryQuery = `*[_type == 'category']{
      slug,
    }`;

  const categories = await sanityClient.fetch(categoryQuery);
  const paths = categories.map((cat) => ({
    params: {
      collection: cat.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }) => {
  const productsQuery = `*[_type == 'product' && $collection in category[]->slug.current]{
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

  const products = await sanityClient.fetch(productsQuery, {
    collection: params.collection,
  });

  if (!products) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      products,
    },
    revalidate: 60,
  };
};
