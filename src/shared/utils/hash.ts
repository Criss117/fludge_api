import bcrypt from 'bcrypt';

export function hash(value: string) {
  return bcrypt.hash(value, 10);
}

export function compare(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}
