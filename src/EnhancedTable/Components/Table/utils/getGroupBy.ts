import { GroupBy, Pojo } from "../../../types";

export default function getGroupBy<Row = Pojo>(
  data: Row[],
  field: keyof Row,
): GroupBy[] {
  const groupedData: Record<string, GroupBy> = {};

  data.forEach((row) => {
    const groupValue = row[field] as string;
    if (!groupedData[groupValue]) {
      groupedData[groupValue] = { groupValue, items: [row as Pojo] };
    } else {
      groupedData[groupValue].items.push(row as Pojo);
    }
  });

  return Object.values(groupedData);
}
