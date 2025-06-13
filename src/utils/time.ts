export function fromJulianDate(date: number) {
  return (date - 2440587.5) * 86400000;
}

export function toJulianDate(date: number) {
  return date / 86400000 + 2440587.5;
}
