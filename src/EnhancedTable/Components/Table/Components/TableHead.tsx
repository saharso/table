import { Column, Pojo, SortState } from "../../../types";
import styles from "../Table.module.scss";
import classNames from "classnames";
import { getCellWidth } from "../utils";
import { IconButton } from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
interface TableHeadProps<Row = Pojo> {
  columns: Column<Row>[];
  onSort: (sortState: SortState) => void;
  sortState: SortState;
}

export default function TableHead<Row = Pojo>({
  columns,
  onSort,
  sortState,
}: TableHeadProps<Row>) {
  return (
    <div
      className={classNames(styles.TableRow, styles.TableHead)}
      role="rowgroup"
    >
      {columns.map((column) => (
        <div
          role="columnheader"
          className={classNames(styles.TableCell, styles.TableHeadCell, {
            [styles.activeSort]: sortState?.dataKey === column.id,
            [styles.unsorted]: sortState?.dataKey !== column.id,
          })}
          style={getCellWidth(column as Column)}
          key={column.id as string}
        >
          {column.title}
          <IconButton
            size="small"
            className={styles.SortButton}
            onClick={() => {
              onSort({ dataKey: column.id as string, asc: !sortState?.asc });
            }}
          >
            {sortState?.dataKey !== column.id && <UnfoldMoreIcon />}
            {sortState?.dataKey === column.id && sortState?.asc && (
              <ExpandLessIcon />
            )}
            {sortState?.dataKey === column.id && !sortState?.asc && (
              <ExpandMoreIcon />
            )}
          </IconButton>
        </div>
      ))}
    </div>
  );
}
