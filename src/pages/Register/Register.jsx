import React, { useState } from "react";
import Logo from "../../components/common/Logo";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      alert("Please fill in all required fields and accept the terms.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v2/user/create",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("svaAuth")}`,
          },
          withCredentials: true,
        }
      );

      navigate("/setting/manage_moderator");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Error signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-6 mx-auto lg:h-[80vh] md:h-screen sm:h-[80vh] lg:py-0">
        <div className="w-full bg-white rounded-lg dark:border sm:max-w-md xl:p-0 rounded-lg p-4 shadow-[0px_3px_8px_rgba(0,0,0,0.24)] ">
          <div className="sm:p-4 md:p-6 lg:p-6 space-y-4 sm:py-3 ">
            <Link
              to="/"
              className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900  pt-4  sm:pt-2 md:pt-3 lg:pt-4 dark:text-white"
            >
              <Logo />
            </Link>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
              Create a Moderator
            </h1>
            <form className="space-y-4 text-left" onSubmit={handleSubmit}>
              <div className="text-left">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-7 sm:h-8 md:h-10 lg:h-10 bg-gray-50 border border-gray-300
             text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-7 sm:h-8 md:h-10 lg:h-10 bg-gray-50 border border-gray-300
             text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-7 sm:h-8 md:h-10 lg:h-10 bg-gray-50 border border-gray-300
             text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full  text-white bg-[#E5383B] font-medium rounded-[8px]
                 text-sm h-7 sm:h-8 md:h-10 lg:h-10  px-5 py-0 sm:py-0.5 md:py-1.5 lg:py-2.5 text-center"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
