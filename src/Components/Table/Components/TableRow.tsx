import { Column, RowUpdatePayload } from "../types";
import TableCell from "./TableCell";
import { v4 as uuId } from "uuid";

interface TableRowProps<Row = unknown> {
  row: Row;
  columns: Column<Row>[];
  onRowUpdate: ({ row, columnId, value }: RowUpdatePayload<Row>) => void;
}

export default function TableRow<Row = unknown>({
  row,
  columns,
  onRowUpdate,
}: TableRowProps<Row>) {
  return (
    <tr>
      {columns.map((column) => (
        <TableCell
          key={uuId()}
          column={column}
          row={row}
          onRowUpdate={onRowUpdate}
        />
      ))}
    </tr>
  );
}
