import React from "react";

const CustomSelect = ({
  id,
  name,
  value,
  onChange,
  options,
  disabledOption,
  register,
  className = "",
  ...props
}) => {
  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        {...(register ? register(name) : {})}
        className={`w-full appearance-none p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-white ${className}`}
        {...props}
      >
        {disabledOption && (
          <option value="" disabled>
            {disabledOption}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-gray-700 hover:bg-green-500 hover:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {/* Custom Dropdown Arrow */}
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-600">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default CustomSelect;