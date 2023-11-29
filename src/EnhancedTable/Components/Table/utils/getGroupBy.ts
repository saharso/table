import { GroupBy, Pojo } from "../../../types";

export default function getGroupBy<Row = Pojo>(
  data: Row[],
  field: keyof Row,
): GroupBy<Row>[] {
  const groupedData: Record<string, GroupBy<Row>> = {};

  data.forEach((row) => {
    const groupValue = row[field] as string;
    if (!groupedData[groupValue]) {
      groupedData[groupValue] = { groupValue, items: [row] };
    } else {
      groupedData[groupValue].items.push(row as Row);
    }
  });

  return Object.values(groupedData);
}
