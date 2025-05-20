import InputLabel from "./InputLabel";

const SelectInput = ({ name, label, value, onChange, options }) => {
  return (
    <div>
      <InputLabel labelTitle={{ title: label }} />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623] dark:bg-gray-700 dark:text-white"
        required>
        <option value="">{`Select ${label}`}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
