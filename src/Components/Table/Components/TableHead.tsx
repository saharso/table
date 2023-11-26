import { Column } from "../types";
import styles from "../Table.module.scss";
import classNames from "classnames";
import { getCellWidth } from "../utils";

interface TableHeadProps<Row = unknown> {
  columns: Column<Row>[];
}

export default function TableHead<Row = unknown>({
  columns,
}: TableHeadProps<Row>) {
  return (
    <div className={classNames(styles.TableRow, styles.TableHead)}>
      <div className={styles.ToggleRowOpen} />
      {columns.map((column) => (
        <div style={getCellWidth(column as Column)} key={column.id as string}>
          {column.title}
        </div>
      ))}
    </div>
  );
}
