import { doc, updateDoc, getDoc } from "firebase/firestore";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { db } from "../firebase";
import useGetUser from "../hooks/useGetUser";
import { sanityClient } from "../sanity";
import { formatter } from "../utils/Formatter";
import emailjs from "@emailjs/browser";

function Checkout({ shippingFee }) {
  const router = useRouter();
  const [order_id, setOrderId] = useState("");
  const { isAuthenticated, isVerifying, user } = useSelector(
    (state) => state.auth
  );
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const { totalPrice } = useSelector((state) => state.cart);
  const { data, isLoading: gettingUser } = useGetUser(user.uid);
  const [paying, setPaying] = useState(false);
  const [successful, setSuccess] = useState(false);
  const [orders, setOrders] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    zipcode: "",
    phone: "",
  });
  const [emailConfirm, setEmailConfirm] = useState(false);
  const form = useRef();

  useEffect(() => {
    if (totalPrice === 0 && isAuthenticated && !router?.query?.order_id) {
      router.push("/");
      toast.error("No valid order");
    } else if (isAuthenticated) {
      setOrderId(router?.query?.order_id || "");
    }
  }, [totalPrice, router, isAuthenticated]);

  useEffect(() => {
    let getOrders = "";
    const getProdDetails = async (order_id) => {
      try {
        const docSnap = await getDoc(doc(db, "orders", order_id));
        docSnap.data().order.map((i) => {
          getOrders += `Product Name:${i.name} Quantity Ordered:${
            i.quantity
          } Price:${i.price} Total Price:${i.price * i.quantity} Link:${
            i.link
          } \n`;
        });
      } catch (error) {
        console.log(error.message);
      }
      setOrders(getOrders);
    };
    getProdDetails(order_id);
    console.log(orders);
  }, [order_id]);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: totalPrice,
    currency: "NGN",
    payment_options: "ussd, card, mobilemoney",
    // redirect_url: "http://localhost:3000/",
    customer: {
      email: data?.email,
      phone_number: data["phone number"] || "",
      name: data?.firstname + " " + data?.lastname,
    },
    customizations: {
      title: "Payment",
      logo: "https://proclassics.co/assets/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  useEffect(() => {
    if (!isAuthenticated && !isVerifying) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router, isVerifying]);

  if (isVerifying) {
    return <div className="px-5 mt-20 md:px-16">Loading...</div>;
  }

  const updatePaymentStatusHandler = (data, status) => {
    const docRef = doc(db, "orders", order_id);
    return updateDoc(docRef, {
      payment_method: paymentMethod,
      payment_status: status,
      checkoutDetails: data,
    }).finally(() => {
      setPaying(false);
      sendSellerEmail();
    });
  };

  const handlePaymentByCash = (data) => {
    handleFlutterPayment({
      callback: (response) => {
        updatePaymentStatusHandler(data, "Paid")
          .then(() => {
            if (response.status === "successful") {
              toast.success("Payment successful", {
                toastId: "payment_success",
              });
              setSuccess(true);
              router.push("/");
            }
          })
          .catch((err) => {
            if (err) {
              toast.error("Payment failed", {
                toastId: "payment_error",
              });
              router.push("/");
            }
          });
        closePaymentModal(); // this will close the modal programmatically
      },
      onClose: () => {
        toast.error("Payment cancelled... Pay later on your dashboard");
        setPaying(false);
      },
    });
  };

  const handlePaymentByCrypto = () => {
    let messageForEmail = `I would like to make payment for my order - #${order_id} with crypto`;
    let link = `mailto:demo@gmail.com?subject=Payment with Crypto&body=${messageForEmail}`;
    updatePaymentStatusHandler(data, "Pending")
      .then(() => {
        toast.success("Opening Email App", {
          toastId: "payment_success",
        });
        setSuccess(true);
        let a = document.createElement("a");
        a.href = link;
        a.click();
        router.push("/");
      })
      .catch((err) => {
        if (err) {
          toast.error("Failed to update", {
            toastId: "payment_error",
          });
          router.push("/");
        }
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setPaying(true);

    if (paymentMethod === "Cash") {
      return handlePaymentByCash(data);
    }
    return handlePaymentByCrypto(data);
  };

  const sendSellerEmail = () => {
    emailjs
      .sendForm("service_r462hoa", "template_evij4iw", form.current, {
        publicKey: "54xX0RxWn1uBV9pgg",
      })
      .then(
        () => {
          console.log("Email successfully sent");
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  return (
    <div className="px-5 mt-20 md:px-16 text-[#3A3A3A]">
      {/* Emailjs form */}
      <form ref={form} className="hidden" onSubmit={sendSellerEmail}>
        <input
          type="text"
          name="name"
          value={`${userData.firstName} ${userData.lastName}`}
          readOnly
        />
        <input type="email" name="email" value={userData.email} readOnly />
        <input name="city" value={userData.city} readOnly />
        <input name="address1" value={userData.address1} readOnly />
        <input name="address2" value={userData.address2} readOnly />
        <input name="zipCode" value={userData.zipcode} readOnly />
        <input name="phone" value={userData.phone} readOnly />
        <textarea name="message" value={orders} readOnly />
        <input type="submit" value="Send" />
      </form>

      <form onSubmit={handleSubmit}>
        <div className="w-full md:flex md:justify-between md:items-start md:gap-x-8">
          <div className="billings md:w-[50%] text-[#3A3A3A] md:mt-0">
            <div className="pb-2 text-base font-extrabold border-b border-b-zinc-200 mt-14">
              SHIPPING ADDRESS
            </div>
            <div className="flex flex-col mt-8 input-fields gap-y-4">
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="firstName"
                >
                  First Name *
                </label>
                <input
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      firstName: e.target.value,
                    }))
                  }
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="lastName"
                >
                  Last Name *
                </label>
                <input
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      lastName: e.target.value,
                    }))
                  }
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="email"
                >
                  Email *
                </label>
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  id="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      email: e.target.value,
                    }))
                  }
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="country"
                >
                  Country / Region *
                </label>
                <input
                  placeholder="Nigeria"
                  type="text"
                  name="country"
                  id="country"
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="addressLine1"
                >
                  Address Line 1 *
                </label>
                <input
                  placeholder="Address Line 1"
                  type="text"
                  name="addressLine1"
                  id="addressLine1"
                  value={userData.address1}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      address1: e.target.value,
                    }))
                  }
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="addressLine2"
                >
                  Address Line 2
                </label>
                <input
                  placeholder="Address Line 2"
                  type="text"
                  name="addressLine2"
                  id="addressLine2"
                  value={userData.address2}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      address2: e.target.value,
                    }))
                  }
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="city"
                >
                  City / Suburb *
                </label>
                <input
                  placeholder="City / Suburb"
                  type="text"
                  name="city"
                  id="city"
                  value={userData.city}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      city: e.target.value,
                    }))
                  }
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="zipCode"
                >
                  Zip / Postcode *
                </label>
                <input
                  placeholder="6 digits, for example: 101402"
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  value={userData.zipcode}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      zipcode: e.target.value,
                    }))
                  }
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>

              <div className="flex flex-col input-group gap-y-4">
                <label
                  className="text-[0.92rem] font-medium opacity-80"
                  htmlFor="phone"
                >
                  Mobile Phone *
                </label>
                <input
                  placeholder="Mobile Phone"
                  type="text"
                  name="phone_number"
                  id="phone"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((userData) => ({
                      ...userData,
                      phone: e.target.value,
                    }))
                  }
                  required
                  className="p-2 text-sm bg-transparent border-b outline-none shadow-b-xl border-b-zinc-200"
                />
              </div>
            </div>
          </div>
          <div className="md:mt-0 md:w-[50%] md:order-2">
            <div className="pb-2 text-base font-extrabold border-b border-b-zinc-200 mt-14">
              SUMMARY
            </div>
            <div className="mt-8">
              <div className="flex justify-between total">
                <div className="font-medium">ITEMS TOTAL</div>
                <div className="font-medium text-[#3A3A3A]">
                  {formatter.format(totalPrice)}
                </div>
              </div>
              <div className="flex justify-between mt-4 mb-8 total">
                <div className="font-medium">SHIPPING</div>
                <div className="font-medium text-[#3A3A3A]">
                  {formatter.format(shippingFee?.fee || 0)}
                </div>
              </div>

              <div className="flex justify-between py-8 text-lg border-t sumtotal border-t-zinc-200">
                <div className="font-extrabold ">TOTAL</div>
                <div className="font-extrabold ">
                  {formatter.format(totalPrice + 200)}
                </div>
              </div>

              <div className="text max-w-xs text-[#3A3A3A] text-sm leading-relaxed">
                The total amount you pay includes all applicable customs duties
                & taxes. We guarantee no additional charges on delivery.
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-14 md:w-[50%]">
          {/* <div className="mt-14 md:w-[50%] md:order-1">
            <div className="pb-2 text-base font-extrabold border-b border-b-zinc-200">
              PAYMENT
            </div>
            <div className="mt-4">
              <div> Please choose your payment method</div>
              <div className="flex mt-6 cards gap-x-3">
                {["Cash", "Crypto"].map((m) => (
                  <button
                    type="button"
                    key={m}
                    className={`p-5 md:px-10 ${
                      m === paymentMethod
                        ? "bg-black text-white"
                        : "bg-transparent border border-black text-black"
                    }`}
                    onClick={() => setPaymentMethod(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="mt-6 text-sm leading-relaxed">
                After clicking &quot;Pay&quot; with the payment option of choice
                selected a pop-up will appear. Review your payment and shipping
                details to complete your purchase. You will be redirected to the
                &quot;ProClassics&quot; Order Confirmation page afterwards.
              </div>
            </div>
          </div> */}
          <div className="mt-6 text-xs leading-relaxed opacity-90">
            By clicking Pay, you agree to purchase your item(s) from ProClassics
            as merchant of record for this transaction, on ProClassics&apos;s
            Terms and Conditions and Privacy Policy.
          </div>
          <button
            type="submit"
            disabled={gettingUser || paying || successful}
            style={{
              opacity: gettingUser || paying || successful ? "0.5" : "1",
            }}
            className="bg-[#212121] text-white py-4 w-full mt-10 text-center text-sm"
          >
            {paying ? "PAYING" : "PAY"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;

export async function getServerSideProps() {
  const shippingQuery = `*[_type == 'shipping'][0]{
    fee,
  }`;

  const shippingFee = await sanityClient.fetch(shippingQuery);

  return {
    props: {
      shippingFee,
    },
  };
}
