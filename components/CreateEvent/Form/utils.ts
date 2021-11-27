export function getDateTime(date: Date): string {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function add1h(date: Date): Date {
  date.setHours(date.getHours() + 1);
  return date;
}

export function add10min(date: Date): Date {
  date.setMinutes(date.getMinutes() + 10);
  return date;
}
