import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";
import Navbar from "../components/UI/Navbar";
import { auth } from "../firebase";
import { invalid, login, verified } from "../redux/slices/auth";
import { update } from "../redux/slices/rate";
import { sanityClient } from "../sanity";

function Layout({ children }) {
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(login(user));
      dispatch(verified());
    }
    dispatch(invalid());
  });

  useEffect(() => {
    const getRate = async () => {
      const rateQuery = `*[_type == 'rate'][0] {
        currency,
        rate
      }`;

      let res = await sanityClient.fetch(rateQuery);
      if (res) {
        dispatch(update(res));
      }
    };

    getRate();
  }, [dispatch]);

  return (
    <div className="relative">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
