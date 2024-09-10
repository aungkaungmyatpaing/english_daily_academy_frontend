export function formatPrice(number) {
  return new Intl.NumberFormat("en-US").format(number);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short", // Short month name
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
