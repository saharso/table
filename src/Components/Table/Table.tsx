import { Column, RowUpdatePayload } from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import TableCell from "./Components/TableCell";
interface TableProps<Row = unknown> {
  rows: Row[];
  columns: Column<Row>[];
  identifier: keyof Row;
  onRowUpdate: ({ row, columnId, value, index }: RowUpdatePayload<Row>) => void;
}

export default function Table<Row = unknown>({
  rows,
  columns,
  onRowUpdate,
}: TableProps<Row>) {
  const sortedColumns = columns.sort((a, b) => a.ordinalNo - b.ordinalNo);
  return (
    <Virtuoso
      data={rows}
      className={styles.TableWrapper}
      useWindowScroll
      itemContent={(index, row: Row) => {
        return (
          <>
            <div className={styles.TableROw}>
              <div className={styles.ToggleRowOpen}>
                <button>+</button>
              </div>
              {sortedColumns.map((column) => {
                return (
                  <TableCell<Row>
                    key={column.id as string}
                    row={row}
                    column={column}
                    onRowUpdate={onRowUpdate}
                  />
                );
              })}
            </div>
            <div>HELLO</div>
          </>
        );
      }}
    />
  );
}
