import { useFormspark } from "@formspark/use-formspark";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

const FORMSPARK_FORM_ID = "VCwW9GLml";

function Contact() {
  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });

  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [alert, setAlert] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    await submit({ message, name, email, number });
    setAlert(true);
  };

  return (
    <div className="relative py-5 mx-5">
      <div className="mt-12 md:max-w-3xl mx-auto ">
        <h1 className="text-4xl md:text-5xl opacity-95">Contact Us</h1>
        <div className="flex flex-col gap-y-4 md:gap-y-6 my-10 md:my-14 opacity-80 font-medium">
          <span>
            Call: <Link href={"tel:+447830732460"}>+447366184756</Link>
          </span>
          <span>
            Email:{" "}
            <Link href={"mailto:maibomart@gmail.com"}>maibomart@gmail.com</Link>
          </span>
        </div>
        {alert && (
          <div className="text-3xl bg-gray text-[#000] p-5">
            Message Sent{" "}
            <span className="relative h-14 w-14">
              <Image fill src="/assets/check.gif" alt="" />
            </span>{" "}
            <div className="text-[.9rem] text-[#3A3A3A] mt-5">
              Thank you for contacting us. We will look into this and get back
              to you soon
            </div>
          </div>
        )}
        {!alert && (
          <form
            onSubmit={onSubmit}
            className="mt-20 -mb-28 w-full grid grid-cols-1 gap-y-4"
          >
            <div className="grp flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-[#3A3A3A] shadow w-full px-5 py-3"
                placeholder="Name*"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-[#3A3A3A] shadow w-full px-5 py-3"
                placeholder="*Email"
                required
              />
            </div>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="border border-[#3A3A3A] shadow w-full px-5 py-3"
              placeholder="Phone Number*"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-[#3A3A3A]  shadow w-full px-5 py-3"
              placeholder="Comment"
            />
            <button
              disabled={submitting}
              className="bg-[#000] mt-6 text-white w-[120px] text-center py-3 px-5"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
