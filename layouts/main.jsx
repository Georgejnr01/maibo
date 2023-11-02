import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";
import Navbar from "../components/UI/Navbar";
import { auth } from "../firebase";
import { invalid, login, verified } from "../redux/slices/auth";

function Layout({ children }) {
  const dispatch = useDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(login(user));
      dispatch(verified());
    }
    dispatch(invalid());
  });
  return (
    <div className="relative">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
