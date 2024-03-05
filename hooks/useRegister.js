import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";

function useRegister() {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { password, ...data } = Object.fromEntries(formData);
    createUserWithEmailAndPassword(auth, data.email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const ref = collection(db, "users");
        await setDoc(doc(ref, user.uid), {
          ...data,
          isAdmin: false,
          date_created: Timestamp.now(),
        });
        setSuccess(true);
        toast.success("Registration Successful", {
          toastId: "registration-success",
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage || "Registration failed", {
          toastId: "registration-success",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { handleSubmit, isLoading, isSuccess };
}

export default useRegister;
