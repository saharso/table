export default function groupBy<Row = unknown>(data: Row[], field: keyof Row) {
  const groupedData: Record<string, { items: Row[]; groupValue: string }> = {};

  data.forEach((row) => {
    const groupValue = row[field] as string;
    if (!groupedData[groupValue]) {
      groupedData[groupValue] = { groupValue, items: [] };
    } else {
      groupedData[groupValue].items.push(row);
    }
  });

  return Object.values(groupedData);
}
