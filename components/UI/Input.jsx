import React, { useState } from "react";

function Input({ type, label, name, autoFocus, required, id, ...props }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  const check = (e) => {
    if (!e.checkValidity()) {
      if (type === "email")
        return setError(
          "The e-mail address is invalid (format: email@domaine.fr)"
        );
      if (type === "password")
        return setError("Password must be at least 6 characters long.");
    } else {
      setError("");
    }
  };
  return (
    <label htmlFor={id} className="relative text-xs font-medium block mb-10">
      <span
        className={`absolute  transition-all duration-300 ${
          active ? "-top-4" : "top-4"
        } ${error ? "text-red-500" : ""} left-0`}
      >
        {label}
        {required ? "*" : ""}
      </span>
      <input
        type={type}
        name={name}
        id={id}
        onFocus={() => setActive(true)}
        onBlur={(e) => {
          if (e.target.value) {
            setActive(true);
          }
        }}
        {...props}
        onChange={(e) => {
          if (e.target.value) {
            setActive(true);
            check(e.target);
          } else {
            if (required) setError(`${label} is required`);
          }
        }}
        required={required}
        className="border-b bg-transparent w-full px-1 outline-none py-3"
        autoFocus={autoFocus}
        autoComplete="off"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </label>
  );
}

export default Input;
