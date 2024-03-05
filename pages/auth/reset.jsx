import { sendPasswordResetEmail } from "@firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/UI/Input";
import { auth } from "../../firebase";
import AuthLayout from "../../layouts/AuthLayout";

function Reset() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    sendPasswordResetEmail(auth, data.email)
      .then(function () {
        // Email sent.
        toast.success("Email sent Successfully!", {
          toastId: "reset",
        });
      })
      .catch(function (error) {
        // An error happened.
        const errorMessage = error.message;
        toast.error(errorMessage || "Couldn't send email. Please try again.", {
          toastId: "reset",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AuthLayout>
      <div className="max-w-xl mx-auto px-5 mt-20 md:px-16">
        <button
          type="button"
          className="text-xs border px-4 py-2 mb-5"
          onClick={() => router.back()}
        >
          Back
        </button>
        <h1 className="uppercase text-xs font-medium">
          RESET PASSWORD REQUEST
        </h1>
        <p className="text-xs mt-16">
          Provide the e-mail address of your account to receive a password reset
          e-mail.
        </p>
        <form className="mt-10" autoComplete="off" onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            label="Email Address"
            required
            autoFocus
            id="email"
          />
          <p className="text-xs font-medium my-8">
            All fields marked with an * are mandatory
          </p>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              opacity: isLoading ? "0.5" : "1",
            }}
            className="block text-center py-3 text-xs font-medium w-full border"
          >
            {isLoading ? "Sending Reset Email" : "Reset"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Reset;
