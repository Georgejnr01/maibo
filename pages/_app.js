import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../layouts/main";
import { store } from "../redux/store";
import "../styles/globals.css";
import { Analytics } from '@vercel/analytics/react';

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => url !== router.asPath && setLoading(true);
    const handleComplete = (url) =>
      url === router.asPath &&
      setTimeout(() => {
        setLoading(false);
      }, 2000);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return loading ? (
    <div className="fixed z-[200] top-0 left-0 bg-black/30 w-screen h-1">
      <div className="w-5 h-full bg-black global-loader"></div>
    </div>
  ) : (
    <div className="fixed z-[200] top-0 left-0 bg-black/30 w-screen h-1 global-loader-finished">
      <div className="w-full h-full bg-black"></div>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
      <Analytics />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Loading />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
