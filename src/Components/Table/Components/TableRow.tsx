import { Column } from "../types";
import TableCell from "./TableCell";
import { v4 as uuId } from "uuid";

interface TableRowProps<Row = unknown> {
  row: Row;
  columns: Column<Row>[];
}

export default function TableRow<Row = unknown>({
  row,
  columns,
}: TableRowProps<Row>) {
  return (
    <tr>
      {columns.map((column) => (
        <TableCell key={uuId()} column={column} row={row} />
      ))}
    </tr>
  );
}
