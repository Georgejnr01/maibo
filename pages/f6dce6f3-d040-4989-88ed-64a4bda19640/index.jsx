"use client";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Page() {
  const [orders, setOrders] = useState();
  useEffect(() => {
    let a = [];
    const getOrders = async () => {
      const q = collection(db, "orders");
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        a.push({ id: doc.id, order: doc.data() });
      });
      setOrders(a);
    };
    getOrders();
  }, []);

  return (
    <div className="p-[5vw]">
      <div className="mb-[10px] font-bold">ORDERS</div>
      <div className="flex flex-col gap-[10px]">
        {orders &&
          orders
            .sort(
              (a, b) =>
                new Date(b?.order?.date_created) -
                new Date(a?.order?.date_created)
            )
            .map((i, index) => <OrderItem key={index} i={i} />)}
      </div>
    </div>
  );
}

function OrderItem({ i }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className={`border border-black w-full p-[10px]`}>
      <div className="flex items-center justify-between">
        <div>{i.id}</div>
        <div>{i.order.payment_status}</div>
        <div
          className="text-[10px] cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          {" "}
          {showDetails ? "Hide Details" : "Show Details"}{" "}
        </div>
      </div>
      <div className={`${showDetails ? "block" : "hidden"} mt-[10px]`}>
        <div>Firstname: {i?.order?.checkoutDetails?.firstName}</div>
        <div>Lastname: {i?.order?.checkoutDetails?.lastName}</div>
        <div>Address1: {i?.order?.checkoutDetails?.address1}</div>
        <div>Address2: {i?.order?.checkoutDetails?.address2}</div>
        <div>City: {i?.order?.checkoutDetails?.city}</div>
        <div>Email: {i?.order?.checkoutDetails?.email}</div>
        <div>Phone: {i?.order?.checkoutDetails?.phone}</div>
        <div>Zipcode: {i?.order?.checkoutDetails?.zipcode}</div>
        <div>Date: {i?.order?.date_created}</div>
        <div>Service Charge: &#8358;{i?.order?.serviceCharge}</div>
        <div>Total Price: &#8358;{i?.order?.totalPrice}</div>
        <div>Shipping Method: {i?.order?.checkoutDetails?.shippingMethod}</div>
        <div className="mt-[10px] font-bold">Products</div>
        {i?.order?.order?.map((i, index) => (
          <div key={index} className="flex gap-[5px]">
            <b>{index + 1}.</b>
            <div className="w-full">
              <div className="break-words">Link: {i.link}</div>
              <div className="break-words">Name: {i.name}</div>
              <div>Price: {i.price}</div>
              <div>Quantity: {i.quantity}</div>
              <div>Color: {i.color}</div>
              <div>Size: {i.size}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
