import { Column } from "./types";
import TableHead from "./Components/TableHead";
import styles from "./Table.module.scss";
import TableRow from "./Components/TableRow";

interface TableProps<Row = unknown> {
  rows: Row[];
  columns: Column<Row>[];
  identifier: keyof Row;
}

export default function Table<Row = unknown>({
  rows,
  columns,
  identifier,
}: TableProps<Row>) {
  const sortedColumns = columns.sort((a, b) => a.ordinalNo - b.ordinalNo);
  return (
    <table className={styles.Table}>
      <TableHead<Row> columns={sortedColumns} />
      <tbody>
        {rows.map((row, index) => (
          <TableRow
            key={row[identifier] as string}
            row={row}
            columns={sortedColumns}
          ></TableRow>
        ))}
      </tbody>
    </table>
  );
}
