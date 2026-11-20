// Central currency formatting so a missing/invalid value never renders ₹NaN.
export const formatINR = (value) => {
  const amount = Number(value);
  return `₹${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"}`;
};

export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
