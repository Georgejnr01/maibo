import React, { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { BsFilterLeft } from "react-icons/bs";
import Card from "../components/Card";
import { sanityClient } from "../sanity";

function Shop({ products, categories }) {
  const [isFilterOpened, setFilterState] = useState(false);
  const handleFilterToggle = () => {
    setFilterState(!isFilterOpened);
  };

  const [category, setCategories] = useState([]);
  const [isCategoryOpened, setCategoryState] = useState(false);
  const [isSortByOpened, setSortByState] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [apply, setApply] = useState(false);
  const [dataToApply, setApplyData] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    const getSearch = async () => {
      category.forEach(async (cat) => {
        const query = `*[_type == 'product' && $collection in categories[]->slug.current] | order(${sortBy}){
          _id,
          name,
          inStock,
          discountedPrice,
          originalPrice,
          "productImage": productImage.asset->url,
          "productImage2": productImage2.asset->url
        }`;

        let res = await sanityClient.fetch(query, {
          collection: cat,
        });

        setApplyData((prev) => {
          let state = Array.from(
            new Set([...prev, ...res].map((a) => a._id))
          ).map((id) => {
            return [...prev, ...res].find((a) => a._id === id);
          });

          return state;
        });
      });
    };
    if (category.length > 0 && sortBy) {
      getSearch();
    }
  }, [category, sortBy]);

  const handleCategory = (e) => {
    if (e.target.checked) {
      return setCategories((prev) => [...prev, e.target.value]);
    }
    let state = category.filter((n) => n !== e.target.value);
    setCategories([...state]);
    setApplyData([]);
  };

  const handleApply = () => {
    setApply(true);
    setData(dataToApply);
    handleFilterToggle();
  };
  return (
    <div className="relative py-5">
      <span
        className={`fixed z-40 bg-white/70 transition-all duration-700 h-full top-0 left-0 ${
          isFilterOpened ? "opacity-100 w-full" : "opacity-0 w-0"
        }`}
      ></span>
      <div
        className={`fixed z-50 top-0 right-0 h-screen w-full overflow-auto overflow-scroll-hidden md:w-1/2 p-5 bg-white items-center transition-all duration-700 shadow-md space-y-5 pt-16 ${
          isFilterOpened
            ? "translate-x-0 opacity-100"
            : "translate-x-[100%] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleFilterToggle}
          className="absolute text-xs font-medium uppercase top-5 right-5"
        >
          Close
        </button>
        <div className="space-y-6 mb-6">
          <div className="px-5">
            <span className="flex items-center justify-between mb-5 text-xs font-medium uppercase">
              <h4>Category {category.length > 0 && `(${category.length})`}</h4>
              {isCategoryOpened ? (
                <BiMinus
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setCategoryState(false)}
                />
              ) : (
                <BiPlus
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setCategoryState(true)}
                />
              )}
            </span>
            <ul
              className={` overflow-hidden text-xs space-y-5 transition-all duration-200 ${
                isCategoryOpened ? "h-fit" : "h-0"
              }`}
            >
              {categories.map((c) => (
                <li key={c._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={c.name}
                    value={c.slug}
                    id={c._id}
                    className="bg-black cursor-pointer"
                    onChange={handleCategory}
                  />
                  <label htmlFor={c._id} className="cursor-pointer">
                    {c.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="px-5">
            <span className="flex items-center justify-between mb-5 text-xs font-medium uppercase">
              <h4>Sort by</h4>
              {isSortByOpened ? (
                <BiMinus
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setSortByState(false)}
                />
              ) : (
                <BiPlus
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => setSortByState(true)}
                />
              )}
            </span>
            <ul
              className={` overflow-hidden text-xs space-y-5 transition-all duration-200 ${
                isSortByOpened ? "h-44" : "h-0"
              }`}
            >
              <li className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortby"
                  id="sortby"
                  className="bg-black cursor-pointer"
                  value="new"
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <label htmlFor="sortby" className="cursor-pointer">
                  New in
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortby"
                  id="sortby"
                  className="bg-black cursor-pointer"
                  value="inStock"
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <label htmlFor="sortby" className="cursor-pointer">
                  In stock
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortby"
                  id="ascending"
                  className="bg-black cursor-pointer"
                  value="originalPrice asc"
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <label htmlFor="ascending" className="cursor-pointer">
                  Price ascending
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="sortby"
                  id="descending"
                  className="bg-black cursor-pointer"
                  value="originalPrice desc"
                  onChange={(e) => setSortBy(e.target.value)}
                />
                <label htmlFor="descending" className="cursor-pointer">
                  Price descending
                </label>
              </li>
            </ul>
          </div>
        </div>
        <span className="block w-full bottom-10">
          <button
            type="button"
            onClick={handleApply}
            className=" block w-[90%] mx-auto py-2 text-sm text-center border-2 "
          >
            Apply
            {`${
              dataToApply.length > 0 ? " " + "(" + dataToApply.length + ")" : ""
            }`}
          </button>
        </span>
      </div>
      <div className="flex items-start justify-between px-5 mt-20 md:px-16">
        <h3 className="text-sm font-medium">Luxury for All</h3>
        <p className="hidden max-w-sm text-xs text-center sm:block">
          Demo is a luxurious jewelry brand that is committed to delivering
          quality and premium products that exudes class, style and taste.
        </p>
        <button
          type="button"
          onClick={handleFilterToggle}
          className="flex items-center space-x-2 text-xs font-medium uppercase"
        >
          <BsFilterLeft className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-16 md:gap-12 md:grid-cols-3 lg:grid-cols-4">
        {!apply ? (
          <>
            {products.length > 0 &&
              products.map((product) => (
                <Card key={product._id} data={product} />
              ))}
          </>
        ) : (
          <>
            {data.length > 0 &&
              data.map((product) => <Card key={product._id} data={product} />)}
          </>
        )}
      </div>
    </div>
  );
}

export default Shop;

export async function getServerSideProps() {
  const productQuery = `*[_type == 'product'] | order(name){
    _id,
    name,
    inStock,
    discountedPrice,
    originalPrice,
    "productImage": productImage.asset->url,
    "productImage2": productImage2.asset->url
  }`;

  const products = await sanityClient.fetch(productQuery);

  const categoryQuery = `*[_type == 'category']{
    _id,
    name,
   "slug": slug.current,
  }`;

  const categories = await sanityClient.fetch(categoryQuery);

  return {
    props: {
      products,
      categories,
    },
  };
}
