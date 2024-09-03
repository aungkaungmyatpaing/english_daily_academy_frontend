export function formatPrice(number) {
  return new Intl.NumberFormat("en-US").format(number);
}
