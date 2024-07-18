import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { RiLoader3Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "../../components/OrderTable";
import { db } from "../../firebase";
import useGetUser from "../../hooks/useGetUser";
import { addTotalPrice } from "../../redux/slices/cart";
import { formatter } from "../../utils/Formatter";

function Order({ order }) {
  const router = useRouter();
  const data = JSON.parse(order);
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(false);
  const { isAuthenticated, isVerifying, user } = useSelector(
    (state) => state.auth
  );
  const { data: userDetails, isLoading: getting } = useGetUser(user?.uid);

  useEffect(() => {
    if (!isAuthenticated && !isVerifying) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router, isVerifying]);

  if (isVerifying) {
    return <div className="px-5 mt-20 md:px-16">Loading...</div>;
  }

  const handle = async (status) => {
    setUpdating(true);
    const docRef = doc(db, "orders", data?.id);
    updateDoc(docRef, {
      fulfillment_status: status,
    })
      .then(() => {
        setUpdating(false);
        toast.success("Status updated successfully");
        router.reload();
      })
      .catch(() => {
        setUpdating(false);
        toast.error("Failed to update status");
      });
  };

  const updatePaymentStatusHandler = () => {
    const docRef = doc(db, "orders", data?.id);
    updateDoc(docRef, {
      payment_status: "Paid",
    })
      .then(() => {
        setUpdating(false);
        toast.success("Status updated successfully");
        router.reload();
      })
      .catch(() => {
        setUpdating(false);
        toast.error("Failed to update status");
      });
  };

  const MakePayment = () => {
    dispatch(addTotalPrice(data?.data?.totalPrice + 50));
    router.push({
      pathname: "/checkout",
      query: { order_id: data.id },
    });
  };
  return (
    <div className="w-full px-5 mt-20 md:px-16">
      <button
        onClick={() => router.back()}
        className="block mb-5 text-sm font-medium underline cursor-pointer w-fit"
      >
        Return to Account Page
      </button>
      <div className="flex flex-col items-start w-full mt-10 md:gap-x-5 gap-y-12 md:flex-row md:justify-between">
        <div className="md:w-[80%] w-full">
          <h1 className="mb-1 text-sm font-medium md:text-base lg:text-lg">
            Order <span className="text-sm opacity-70">#{data?.id}</span>
          </h1>
          <p className="mb-2 text-xs opacity-70">
            Fulfillment Status: {data?.data?.fulfillment_status}
          </p>
          <p className="text-xs lg:text-sm">
            Placed on{" "}
            {new Date(
              data?.data?.date_created?.seconds * 1000
            ).toLocaleString()}
          </p>
          <div className="mt-5">
            <Table data={data} />
            <div className="border border-t-0">
              <p className="flex items-center justify-between px-4 py-2 text-sm">
                <span>Subtotal</span>
                <span>{formatter.format(data?.data?.totalPrice)}</span>
              </p>
              <p className="flex items-center justify-between px-4 py-2 text-sm">
                <span>Service Charge</span>
                <span>{formatter.format(data?.data?.serviceCharge)}</span>
              </p>
              <p className="flex items-center justify-between px-4 py-2 text-sm font-medium md:text-lg">
                <span>Total</span>
                <span>
                  {formatter.format(
                    data?.data?.totalPrice + data?.data?.serviceCharge
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-[20%] text-sm">
          <h3 className="mb-2 text-sm font-medium md:text-base">
            Shipping Details
          </h3>
          {data?.data?.checkoutDetails?.firstName ? (
            <>
              <h4 className="text-[#3A3A3A]">
                {`${data?.data?.checkoutDetails?.lastName} ${data?.data?.checkoutDetails?.firstName}`}
              </h4>
              <p className="text-[#3A3A3A] text-xs opacity-70 mt-1">
                {data?.data?.checkoutDetails?.email}
              </p>
              <p className="text-[#3A3A3A] text-xs opacity-70 mt-1">
                {data?.data?.checkoutDetails?.phone_number}
              </p>
              <p className="text-[#3A3A3A] text-xs opacity-70 mt-1">
                {data?.data?.checkoutDetails?.country}
              </p>
              <p className="text-[#3A3A3A] text-xs opacity-70 mt-1">
                {data?.data?.checkoutDetails?.addressLine1}
              </p>
            </>
          ) : (
            <p className="mt-1 text-xs opacity-70">No shipping details</p>
          )}
        </div>
      </div>
      {data?.data?.payment_status === "Pending" &&
        data?.data?.user === user?.uid && (
          <button
            onClick={MakePayment}
            className="px-3 py-2 mt-16 text-sm border block"
          >
            Make Payment
          </button>
        )}
      {!getting &&
        userDetails?.isAdmin &&
        data?.data?.payment_method === "Crypto" &&
        data?.data?.user !== user?.uid &&
        data?.data?.payment_status === "Pending" && (
          <button
            disabled={updating}
            style={{
              opacity: updating ? "0.5" : "1",
            }}
            onClick={updatePaymentStatusHandler}
            className="px-3 py-2 text-sm mt-16 border block w-fit"
          >
            {updating ? "Updating" : "Received Crypto Payment"}
          </button>
        )}
      {!getting &&
        userDetails?.isAdmin &&
        data?.data?.payment_status !== "Pending" && (
          <span className="flex items-center mt-16 space-x-3">
            {data?.data?.fulfillment_status !== "Processing" &&
              data?.data?.fulfillment_status !== "Delivered" && (
                <button
                  disabled={updating}
                  style={{
                    opacity: updating ? "0.5" : "1",
                  }}
                  onClick={() => handle("Processing")}
                  className="px-3 py-2 text-sm border"
                >
                  {updating ? "Updating" : "Process"}
                </button>
              )}
            {data?.data?.fulfillment_status === "Processing" &&
              data?.data?.fulfillment_status !== "Delivered" && (
                <button
                  disabled={updating}
                  style={{
                    opacity: updating ? "0.5" : "1",
                  }}
                  onClick={() => handle("Delivered")}
                  className="px-3 py-2 text-sm border"
                >
                  {updating ? "Updating" : "Delivered"}
                </button>
              )}
          </span>
        )}
    </div>
  );
}

export default Order;

export const getStaticPaths = async () => {
  let orders = [];
  const q = collection(db, "orders");
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, order: doc.data() });
  });
  const paths = orders?.map((d) => ({
    params: {
      order: d.id,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }) => {
  let order = "";
  const docRef = doc(db, "orders", params.order);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    order = JSON.stringify({ id: docSnap.id, data: docSnap.data() });
  }

  if (!order) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      order,
    },
    revalidate: 60,
  };
};
