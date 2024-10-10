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

export default function PlanDuration({ duration }) {
  const displayDuration =
    duration % 12 === 0
      ? `${duration / 12} year${duration / 12 > 1 ? "s" : ""}`
      : `${duration} month${duration > 1 ? "s" : ""}`;

  return <span>{displayDuration}</span>;
}
