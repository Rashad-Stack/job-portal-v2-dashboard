import React from "react";

export default function JobIndexButton({
  isSubmitting,
  actionName,
  onClick,
  type = "submit",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isSubmitting}
      className="w-full py-3 px-4 bg-gradient-to-r from-[#00ab0c] to-[#00ab0c] text-white font-medium rounded-lg hover:from-[#549458] hover:to-[#15881c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ab0c] transition-all duration-300"
    >
      {isSubmitting ? `${actionName}...` : actionName}
    </button>
  );
}
