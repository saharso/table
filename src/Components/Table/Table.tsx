import { Column, RowUpdatePayload } from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import TableCell from "./Components/TableCell";
import TableHead from "./Components/TableHead";
interface TableProps<Row = unknown> {
  rows: Row[];
  columns: Column<Row>[];
  identifier?: keyof Row;
  groupKey?: keyof Row;
  onRowUpdate?: ({
    row,
    columnId,
    value,
    index,
  }: RowUpdatePayload<Row>) => void;
  openRows?: Set<string>;
  onRowToggle?: (id: string) => void;
  removeHeader?: boolean;
}

export default function Table<Row = unknown>({
  rows,
  columns,
  onRowUpdate,
  identifier,
  onRowToggle,
  openRows,
  groupKey,
  removeHeader,
}: TableProps<Row>) {
  const sortedColumns = columns.sort((a, b) => a.ordinalNo - b.ordinalNo);
  return (
    <div className={styles.Table}>
      {!removeHeader && <TableHead columns={sortedColumns} />}
      <Virtuoso
        data={rows}
        useWindowScroll
        itemContent={(index, row: Row) => {
          return (
            <>
              <div className={styles.TableRow}>
                <div className={styles.ToggleRowOpen}>
                  {onRowUpdate && (
                    <button
                      onClick={() => onRowToggle(row[identifier] as string)}
                    >
                      +
                    </button>
                  )}
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
              {openRows?.has(row[identifier] as string) && (
                <div>
                  {
                    <Table
                      columns={sortedColumns}
                      rows={row[groupKey] as Row[]}
                      removeHeader={true}
                    />
                  }
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
