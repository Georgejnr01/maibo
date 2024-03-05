import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase";

export const useGetOrders = (data) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (orders.length === 0) {
      setLoading(true);
    }
    const getOrders = async () => {
      const q = data.isAdmin
        ? query(collection(db, "orders"), orderBy("date_created", "desc"))
        : query(
            collection(db, "orders"),
            orderBy("date_created", "desc"),
            where("user", "==", user.uid)
          );

      const querySnapshot = await getDocs(q);
      let dataK = [];
      querySnapshot.forEach((doc) => {
        dataK.push({ id: doc.id, order: doc.data() });
      });
      setLoading(false);
      setSuccess(true);
      setOrders(dataK);
    };

    if (Object.keys(data).length > 0) {
      if (user.uid && !isSuccess && orders.length === 0) {
        getOrders();
      } else {
        setLoading(false);
      }
    }
  }, [user, orders, isSuccess, data]);
  return { orders, isLoading };
};
