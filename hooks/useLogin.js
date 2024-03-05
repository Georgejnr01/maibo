import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { login } from "../redux/slices/auth";

function useLogin() {
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setPersistence(auth, browserSessionPersistence)
      .then(() =>
        signInWithEmailAndPassword(auth, data.email, data.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            dispatch(login(user));
            setSuccess(true);
            toast.success("Authentication Successful", {
              toastId: "login-success",
            });
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage || "Authentication failed", {
              toastId: "login-error",
            });
          })
          .finally(() => {
            setLoading(false);
          })
      )
      .catch((error) => {
        // Handle Errors here.
        const errorMessage = error.message;
        toast.error(errorMessage || "Authentication failed", {
          toastId: "login-error",
        });
        setLoading(false);
      });
  };

  return { handleSubmit, isLoading, isSuccess };
}

export default useLogin;
