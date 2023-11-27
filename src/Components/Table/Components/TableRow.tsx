import { Column, RowUpdatePayload } from "../types";
import TableCell from "./TableCell";
import { v4 as uuId } from "uuid";

interface TableRowProps<Row = unknown> {
  row: Row;
  columns: Column<Row>[];
  onCellUpdate: ({ row, columnId, value }: RowUpdatePayload<Row>) => void;
}

export default function TableRow<Row = unknown>({
  row,
  columns,
  onCellUpdate,
}: TableRowProps<Row>) {
  return (
    <tr>
      {columns.map((column) => (
        <TableCell
          key={uuId()}
          column={column}
          row={row}
          onCellUpdate={onCellUpdate}
        />
      ))}
    </tr>
  );
}
