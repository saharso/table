import { GroupBy } from "../types";

export default function getGroupBy<Row = unknown>(
  data: Row[],
  field: keyof Row,
): GroupBy[] {
  const groupedData: Record<string, GroupBy> = {};

  data.forEach((row) => {
    const groupValue = row[field] as string;
    if (!groupedData[groupValue]) {
      groupedData[groupValue] = { groupValue, items: [] };
    } else {
      const { [field]: _, ...rest } = row;
      groupedData[groupValue].items.push(rest);
    }
  });

  return Object.values(groupedData);
}