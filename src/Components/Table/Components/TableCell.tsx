import { Column } from "../types";

interface TableCellProps<Row = unknown> {
  row: Row;
  column: Column<Row>;
}

export default function TableCell<Row = unknown>({
  row,
  column,
}: TableCellProps<Row>) {
  return <td>{row[column.id] as string}</td>;
}
