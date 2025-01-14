'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Errors {
  username?: string;
  password?: string;
}

export default function Page() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors: Errors = {};

    if (!username) {
      validationErrors.username = 'Username is required';
    }

    if (!password) {
      validationErrors.password = 'Password is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Handle the login logic here
    console.log('Logging in with', username, password);
  };

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">Login Page</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username:
              {errors.username && (
                <p className="float-right mt-1 inline-block text-sm text-red-500">
                  {errors.username}
                </p>
              )}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleChangeUsername}
              className={`w-full rounded-md border border-gray-300 p-2`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password:
              {errors.password && (
                <p className="float-right mt-1 inline-block text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handleChangePassword}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
