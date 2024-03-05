import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function AuthLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, isVerifying } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !isVerifying) {
      router.push("/account");
    }
  }, [isAuthenticated, isVerifying, router]);

  if (isVerifying) {
    return <div className="px-5 mt-20 md:px-16">Loading...</div>;
  }

  return <div>{children}</div>;
}

export default AuthLayout;
