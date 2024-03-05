import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";

function useGetUser(id) {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [isSuccess, setSuccess] = useState(false);

  useEffect(() => {
    if (Object.keys(data).length === 0) {
      setLoading(true);
    }
    const getUser = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
        setSuccess(true);
        setLoading(false);
      }
    };

    if (id && !isSuccess && Object.keys(data).length === 0) {
      getUser();
    } else {
      setLoading(false);
    }
  }, [isSuccess, id, data]);

  return { data, isLoading };
}

export default useGetUser;
