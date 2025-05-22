export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const convertToISO = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString();
};