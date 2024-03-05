import React, { useEffect, useState } from "react";
import { sanityClient } from "../sanity";

function useSearch(term) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (term) {
      const getSearchResult = async () => {
        let query;
        query = `*[_type == "product" && (name match "*" + $term + "*")] | order(name)`;

        let res = await sanityClient.fetch(query, {
          term,
        });
        setData(res);
      };
      getSearchResult();
    } else {
      setData([]);
    }
  }, [term]);
  return { data };
}

export default useSearch;
