import React from "react";
import Logo from "../../components/common/Logo";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { createUser } from "../../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        role: "MODERATOR",
      };

      const response = await createUser(payload);
      console.log("data", response.data);
      navigate("/setting/manage_moderator");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <section className="">
      <div className="flex flex-col items-center justify-center px-6 py-6 mx-auto lg:h-[80vh] md:h-screen sm:h-[80vh] lg:py-0">
        <div className="w-full bg-white rounded-lg dark:border sm:max-w-md xl:p-0 rounded-lg p-4 shadow-[0px_3px_8px_rgba(0,0,0,0.24)]">
          <div className="sm:p-4 md:p-6 lg:p-6 space-y-4 sm:py-3">
            <Link
              to="/"
              className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 pt-4 sm:pt-2 md:pt-3 lg:pt-4 dark:text-white"
            >
              <Logo />
            </Link>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
              Create a Moderator
            </h1>
            <form className="space-y-4 text-left" onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className={`h-7 sm:h-8 md:h-10 lg:h-10 bg-gray-50 border border-gray-300
                    text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                    ${errors.name ? "border-red-500" : ""}`}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
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
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`h-7 sm:h-8 md:h-10 lg:h-10 bg-gray-50 border border-gray-300
                    text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                    ${errors.email ? "border-red-500" : ""}`}
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
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
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className={`h-7 sm:h-8 md:h-10 lg:h-10 bg-gray-50 border border-gray-300
                    text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                    ${errors.password ? "border-red-500" : ""}`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white bg-[#E5383B] font-medium rounded-[8px]
                  text-sm h-7 sm:h-8 md:h-10 lg:h-10 px-5 py-0 sm:py-0.5 md:py-1.5 lg:py-2.5 text-center
                  disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}