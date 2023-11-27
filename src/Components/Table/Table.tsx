import { CellEditPayload, Column, GroupBy, RowUpdatePayload } from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import TableCell from "./Components/TableCell";
import TableHead from "./Components/TableHead";
import React, { useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useGroupBy from "./hooks/useGroupBy";
import classNames from "classnames";
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
  removeHeader?: boolean;
  groupBy?: keyof Row;
}

interface GroupByRowProps {
  row: GroupBy;
  rowOpen: boolean;
  onCollapseToggle: (row: GroupBy) => void;
  groupedColumn: Column;
}
function GroupByRow<Row = unknown>({
  row,
  rowOpen,
  onCollapseToggle,
  groupedColumn,
}: GroupByRowProps) {
  return (
    <div className={classNames(styles.TableRow, {})}>
      <div className={styles.ToggleRowOpen}>
        <IconButton onClick={() => onCollapseToggle(row)}>
          {rowOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>

      <div>
        <span>{groupedColumn.title}</span>
        :&nbsp;
        <span>{row.groupValue}</span>
      </div>
    </div>
  );
}

export default function Table<Row = unknown>({
  rows,
  columns,
  onCellUpdate,
  identifier,
  removeHeader,
  groupBy,
}: TableProps<Row>) {
  const sortedColumns = useMemo(
    () => columns.sort((a, b) => a.ordinalNo - b.ordinalNo),
    [columns],
  );
  const [editable, setEditable] = useState<CellEditPayload>();
  const { data, isGroupBy, groupedColumn, columnsWithoutGroupBy } = useGroupBy({
    groupBy,
    rows,
    columns: sortedColumns,
  });
  const [collapsedRows, setCollapsedRows] = React.useState<Set<string>>(
    new Set(),
  );

  const onToggleRowCollapse = (row: GroupBy) => {
    setCollapsedRows((prev) => {
      const newPrev = new Set(prev);
      const id = row.groupValue as string;
      if (newPrev.has(id)) {
        newPrev.delete(id);
      } else {
        newPrev.add(id);
      }
      return newPrev;
    });
  };
  return (
    <div className={styles.Table}>
      {!removeHeader && <TableHead columns={columnsWithoutGroupBy} />}
      <Virtuoso
        data={data as never[]}
        useWindowScroll
        itemContent={(index, row: GroupBy) => {
          const rowOpen =
            isGroupBy(row) && !collapsedRows.has(row.groupValue as string);
          return (
            <>
              <GroupByRow
                row={row}
                rowOpen={rowOpen}
                onCollapseToggle={onToggleRowCollapse}
                groupedColumn={groupedColumn as Column}
              />
              {rowOpen && (
                <div className={styles.TableDrawer}>
                  {row.items.map((row, index) => {
                    return (
                      <div className={styles.TableRow} key={index}>
                        {columnsWithoutGroupBy.map((column) => {
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
                    );
                  })}
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
