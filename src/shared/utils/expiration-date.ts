export function expirationDate(days = 1) {
  if (days <= 0) throw new Error('Expiration days must be greater than 0');

  return new Date(Date.now() + 1000 * 60 * 60 * 24 * days);
}
