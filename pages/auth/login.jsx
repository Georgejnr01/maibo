import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Input from "../../components/UI/Input";
import useLogin from "../../hooks/useLogin";
import AuthLayout from "../../layouts/AuthLayout";

function Login() {
  const { handleSubmit, isLoading, isSuccess } = useLogin();

  return (
    <AuthLayout>
      <div className="max-w-xl mx-auto px-5 mt-20 md:px-16">
        <h1 className="uppercase text-xs font-medium">Sign in</h1>
        <p className="text-xs mt-16">
          If you are already a Demo Family member, please enter your login
          information.
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
          <Input
            type="password"
            name="password"
            label="Password"
            required
            id="password"
          />
          <Link
            href="/auth/reset"
            className="block text-xs mt-3 font-medium hover:underline"
          >
            Forgot Password
          </Link>
          <p className="text-xs font-medium my-8">
            All fields marked with an * are mandatory
          </p>
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            style={{
              opacity: isLoading ? "0.5" : "1",
            }}
            className="block text-center py-3 text-xs font-medium w-full border"
          >
            {isLoading ? "Logging in" : "Login"}
          </button>
        </form>
        <div className="text-xs mt-16">
          <h2 className="uppercase font-medium mb-3">New Member</h2>
          <p className="mb-5">
            Create your personal account with us to become a member of the
            Givenchy Family.
          </p>
          <Link
            href="/auth/register"
            className="block text-center py-3 font-medium w-full border"
          >
            Create an account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
