import { CellEditPayload, Column, GroupBy, RowUpdatePayload } from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import TableCell from "./Components/TableCell";
import TableHead from "./Components/TableHead";
import { useState } from "react";
import { IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useGroupBy from "./hooks/useGroupBy";
interface TableProps<Row = unknown> {
  rows: Row[];
  columns: Column<Row>[];
  identifier?: keyof Row;
  onCellUpdate?: ({
    row,
    columnId,
    value,
    index,
  }: RowUpdatePayload<Row>) => void;
  openRows?: Set<string>;
  onRowToggle?: (id: string) => void;
  removeHeader?: boolean;
  groupBy?: keyof Row;
}

export default function Table<Row = unknown>({
  rows,
  columns,
  onCellUpdate,
  identifier,
  onRowToggle,
  openRows,
  removeHeader,
  groupBy,
}: TableProps<Row>) {
  const sortedColumns = columns.sort((a, b) => a.ordinalNo - b.ordinalNo);
  const [editable, setEditable] = useState<CellEditPayload>();
  const { data, isGrouped, isGroupBy } = useGroupBy({ groupBy, rows });

  return (
    <div className={styles.Table}>
      {!removeHeader && <TableHead columns={sortedColumns} />}
      <Virtuoso
        data={data as never[]}
        useWindowScroll
        itemContent={(index, row: Row | GroupBy) => {
          const rowOpen = true;
          return (
            <>
              <div className={styles.TableRow}>
                <div className={styles.ToggleRowOpen}>
                  {onCellUpdate && (
                    <IconButton
                    // onClick={() => onRowToggle(row[identifier] as string)}
                    >
                      {rowOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                  )}
                </div>
                {isGroupBy(row) && (
                  <div className={styles.GroupBy}>{row.groupValue}</div>
                )}
                {!isGroupBy(row) &&
                  sortedColumns.map((column) => {
                    return (
                      <TableCell<Row>
                        key={column.id as string}
                        row={row as Row}
                        column={column}
                        onCellUpdate={onCellUpdate}
                        index={index}
                        onEdit={setEditable}
                        editable={editable}
                      />
                    );
                  })}
              </div>
              {isGroupBy(row) && (
                <div className={styles.TableDrawer}>
                  {
                    <Table
                      columns={sortedColumns}
                      rows={row.items as Row[]}
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
