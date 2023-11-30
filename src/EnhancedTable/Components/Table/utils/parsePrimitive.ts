function isNumeric(str: string | number) {
  if (typeof str === "number") return true;
  return /^\d+$/.test(str);
}

export default function parsePrimitive(data: string | number) {
  if (isNumeric(data)) {
    return Number(data).toLocaleString();
  }
  return data;
}
