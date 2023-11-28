import { Column, Pojo } from "../types";
import styles from "../Table.module.scss";
import classNames from "classnames";
import { getCellWidth } from "../utils";

interface TableHeadProps<Row = Pojo> {
  columns: Column<Row>[];
}

export default function TableHead<Row = Pojo>({
  columns,
}: TableHeadProps<Row>) {
  return (
    <div className={classNames(styles.TableRow, styles.TableHead)}>
      <div className={styles.ToggleRowOpen} />
      {columns.map((column) => (
        <div
          className={styles.TableCell}
          style={getCellWidth(column as Column)}
          key={column.id as string}
        >
          {column.title}
        </div>
      ))}
    </div>
  );
}
