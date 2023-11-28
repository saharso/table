import { CellEditPayload, Column, Pojo, RowUpdatePayload } from "../types";
import React from "react";
import styles from "../Table.module.scss";
import { TableCell } from "./index";

interface TableRowProps<Row = Pojo> {
  columns: Column<Row>[];
  row: Row;
  onCellUpdate?: ({ row, columnId, value, index }: RowUpdatePayload) => void;
  index?: number;
  setEditable: React.Dispatch<CellEditPayload>;
  editable: CellEditPayload;
}
const TableRow = React.memo(
  ({
    columns,
    row,
    index,
    onCellUpdate,
    setEditable,
    editable,
  }: TableRowProps) => {
    return (
      <div className={styles.TableRow} role={"row"}>
        {columns.map((column) => {
          return (
            <TableCell
              key={column.id as string}
              row={row}
              column={column}
              onCellUpdate={onCellUpdate}
              index={index}
              onEdit={setEditable}
              editable={editable}
            />
          );
        })}
      </div>
    );
  },
);

export default TableRow;
