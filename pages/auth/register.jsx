import dynamic from "next/dynamic";
import React, { useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import Input from "../../components/UI/Input";
import useRegister from "../../hooks/useRegister";
import AuthLayout from "../../layouts/AuthLayout";

const options = [
  { value: "mr.", label: "Mr." },
  { value: "mrs.", label: "Mrs." },
];

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

function Register() {
  const [selectedOption, setSelectedOption] = useState("");
  const [country, setSelectedCountry] = useState("Nigeria");
  const { handleSubmit, isLoading, isSuccess } = useRegister();

  return (
    <AuthLayout>
      <div className="max-w-xl mx-auto px-5 mt-20 md:px-16">
        <h1 className="uppercase text-xs font-medium">CREATE AN ACCOUNT</h1>
        <p className="text-xs mt-10">
          Be the first to know about new collections and exclusive events
          through your personal account.
        </p>
        <form className="mt-16" autoComplete="off" onSubmit={handleSubmit}>
          <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
            autoFocus
            name="addressed_as"
            required
            className="bg-transparent w-full text-xs mb-10 outline-none block"
          />
          <Input
            type="text"
            name="firstname"
            label="First Name"
            required
            id="firstname"
          />
          <Input
            type="text"
            name="lastname"
            label="Last Name"
            required
            id="lastname"
          />
          <Input
            type="email"
            name="email"
            label="Email Address"
            required
            id="email"
          />
          <Input
            type="tel"
            name="phone number"
            label="Phone Number"
            required
            id="tel"
          />
          <CountryDropdown
            name="country"
            value={country}
            showDefaultOption
            onChange={(val) => setSelectedCountry(val)}
            className="bg-transparent w-full text-xs mb-10 outline-none block border-b  py-3 px-1"
            required={true}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            required
            id="password"
            pattern=".{6,}"
            title="Password must be at least 6 characters long."
          />
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
            {isLoading ? "CREATING" : "CREATE AN ACCOUNT"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Register;
