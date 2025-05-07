import React from "react";

export default function InputLabel({ labelTitle }) {
  return (
    <>
      <label className="block text-sm text-left font-medium text-gray-700 dark:text-gray-500 mb-1">
        {labelTitle.title}
      </label>
    </>
  );
}
