export const formatPrice = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const parsePrice = (value) => {
  if (typeof value === "number") return value;
  const price = String(value || "0")
    .replace(/From/gi, "")
    .replace(/Rs\.?/gi, "")
    .replace(/LKR/gi, "")
    .replace(/[^\d.]/g, "");

  return Number(price || 0);
};
