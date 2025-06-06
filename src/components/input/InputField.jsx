import InputLabel from "./InputLabel";
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
  divClass,
  error,
  ...rest
}) => {
  return (
    <div className={divClass}>
      <InputLabel labelTitle={{ title: label }} />
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623] dark:bg-gray-700 dark:text-white ${className}`}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
