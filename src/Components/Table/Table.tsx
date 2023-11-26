import { Column, RowUpdatePayload } from "./types";
import TableHead from "./Components/TableHead";
import styles from "./Table.module.scss";
import TableRow from "./Components/TableRow";

interface TableProps<Row = unknown> {
  rows: Row[];
  columns: Column<Row>[];
  identifier: keyof Row;
  onRowUpdate: ({ row, columnId, value, index }: RowUpdatePayload<Row>) => void;
}

export default function Table<Row = unknown>({
  rows,
  columns,
  identifier,
  onRowUpdate,
}: TableProps<Row>) {
  const sortedColumns = columns.sort((a, b) => a.ordinalNo - b.ordinalNo);
  return (
    <table className={styles.Table}>
      <TableHead<Row> columns={sortedColumns} />
      <tbody>
        {rows.map((row) => {
          const index = rows.findIndex((r) => r === row);
          return (
            <TableRow
              key={row[identifier] as string}
              row={row}
              columns={sortedColumns}
              onRowUpdate={(update) => onRowUpdate({ ...update, index })}
            ></TableRow>
          );
        })}
      </tbody>
    </table>
  );
}
