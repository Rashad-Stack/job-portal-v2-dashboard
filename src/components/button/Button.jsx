import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Button({
  label,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center gap-4 px-3 py-1 rounded-md font-medium transition duration-200 focus:outline-none";

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-700",
    success: "bg-green-500 text-white hover:bg-green-700",
    danger: "bg-red-500 text-white hover:bg-red-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-500 hover:bg-gray-200",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        baseStyles,
        variants[variant],
        disabledStyles,
        className
      )}
    >
      {label && <span>{label}</span>}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["delete", "submit", "reset", "cancel"]),
  variant: PropTypes.oneOf([
    "primary",
    "success",
    "danger",
    "warning",
    "outline",
    "ghost",
  ]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
