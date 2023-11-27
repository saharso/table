import { CellEditPayload, Column, RowUpdatePayload } from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import TableCell from "./Components/TableCell";
import TableHead from "./Components/TableHead";
import { useState } from "react";
import { IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
          const rowOpen = openRows?.has(row[identifier] as string);
          return (
            <>
              <div className={styles.TableRow}>
                <div className={styles.ToggleRowOpen}>
                  {onCellUpdate && (
                    <IconButton
                      onClick={() => onRowToggle(row[identifier] as string)}
                    >
                      {rowOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
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
              {/*{rowOpen && (*/}
              {/*  <div className={styles.TableDrawer}>*/}
              {/*    {*/}
              {/*      <Table*/}
              {/*        columns={sortedColumns}*/}
              {/*        rows={row[groupKey] as Row[]}*/}
              {/*        removeHeader={true}*/}
              {/*      />*/}
              {/*    }*/}
              {/*  </div>*/}
              {/*)}*/}
            </>
          );
        }}
      />
    </div>
  );
}
