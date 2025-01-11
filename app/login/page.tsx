"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

interface Errors {
  username?: string;
  password?: string;
}

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors: Errors = {};

    if (!username) {
      validationErrors.username = "Username is required";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Handle the login logic here
    console.log("Logging in with", username, password);
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login Page</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Username:
              {errors.username && (
                <p className="text-red-500 text-sm mt-1 inline-block float-right">
                  {errors.username}
                </p>
              )}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleChangeUsername}
              className={`w-full p-2 border border-gray-300 rounded-md`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password:
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 inline-block float-right">
                  {errors.password}
                </p>
              )}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleChangePassword}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
