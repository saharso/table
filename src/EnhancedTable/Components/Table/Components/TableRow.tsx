import {
  CellEditPayload,
  Column,
  Pojo,
  RowUpdatePayload,
} from "../../../types";
import React from "react";
import styles from "../Table.module.scss";
import { TableCell } from "./index";

interface TableRowProps<Row = Pojo> {
  columns: Column<Row>[];
  row: Row;
  onCellUpdate?: ({ row, columnId, value, index }: RowUpdatePayload) => void;
  rowId?: string;
  setEditable: React.Dispatch<CellEditPayload>;
  editable: CellEditPayload;
  groupedColumn?: Column<Row>;
}
const TableRow = React.memo(
  ({
    columns,
    row,
    rowId,
    onCellUpdate,
    setEditable,
    editable,
    groupedColumn,
  }: TableRowProps) => {
    return (
      <div
        className={styles.TableRow}
        role={"row"}
        data-testid={`table-row-${rowId}`}
      >
        {columns.map((column) => {
          return (
            <TableCell
              key={column.id as string}
              row={row}
              column={column}
              onCellUpdate={onCellUpdate}
              rowId={rowId}
              onEdit={setEditable}
              editable={editable}
              groupedColumn={groupedColumn}
            />
          );
        })}
      </div>
    );
  },
);

export default TableRow;
