import { CellEditPayload, Column, RowUpdatePayload } from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import TableCell from "./Components/TableCell";
import TableHead from "./Components/TableHead";
import { useState } from "react";
interface TableProps<Row = unknown> {
  rows: Row[];
  columns: Column<Row>[];
  identifier?: keyof Row;
  groupKey?: keyof Row;
  onCellUpdate?: ({
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
  onCellUpdate,
  identifier,
  onRowToggle,
  openRows,
  groupKey,
  removeHeader,
}: TableProps<Row>) {
  const sortedColumns = columns.sort((a, b) => a.ordinalNo - b.ordinalNo);
  const [editable, setEditable] = useState<CellEditPayload>();
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
                  {onCellUpdate && (
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
                      onCellUpdate={onCellUpdate}
                      index={index}
                      onEdit={setEditable}
                      editable={editable}
                    />
                  );
                })}
              </div>
              {openRows?.has(row[identifier] as string) && (
                <div className={styles.TableDrawer}>
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
