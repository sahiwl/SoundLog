
import React from 'react';

const Signup = () => {
 return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
    <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-md">
      <h2 className="text-2xl font-semibold text-white">Sign-up</h2>
      <p className="mt-1 text-sm text-gray-400">
        Enter your email below to create an account
      </p>

      <form className="mt-6 space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            placeholder="m@example.com"
            className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
          />
        </div>

        <div className="text-left">
          <label className="flex justify-between text-sm font-medium text-gray-300">
            <span>Password</span>
            {/* <a href="#" className="text-gray-400 hover:underline">
              Forgot your password?
            </a> */}
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm text-gray-200 focus:border-white focus:outline-none"
          />
        </div>

        <button className="w-full rounded bg-white px-4 py-2 text-black font-medium hover:bg-gray-200">
          Signup
        </button>
      </form>

      <button className="mt-4 w-full rounded border border-gray-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
        Signup with Google
      </button>

      <p className="mt-4 text-center text-sm text-gray-400">
        been here already?{' '}
        <a href="/login" className="text-white underline">
          Login
        </a>
      </p>
    </div>
  </div>
    )
}

export default Signup
