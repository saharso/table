import { Column } from "../types";

interface TableHeadProps<Row = unknown> {
  columns: Column<Row>[];
}

export default function TableHead<Row = unknown>({
  columns,
}: TableHeadProps<Row>) {
  return (
    <tr>
      {columns.map((column) => (
        <th key={column.id as string}>{column.title}</th>
      ))}
    </tr>
  );
}
