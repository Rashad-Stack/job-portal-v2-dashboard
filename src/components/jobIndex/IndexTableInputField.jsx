const IndexTableInputField = ({ label, name, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00ab0c] focus:border-[#1e6623] dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
};

export default IndexTableInputField;
