import { CellEditPayload, Column, GroupBy, RowUpdatePayload } from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import { GroupByHeader, TableCell, TableHead } from "./Components";
import React, { FC, useMemo, useState } from "react";
import useGroupBy from "./hooks/useGroupBy";
import { v4 as uuId } from "uuid";

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

interface TableRowProps<Row = unknown> {
  columns: Column<Row>[];
  row: Row;
  onCellUpdate?: ({ row, columnId, value, index }: RowUpdatePayload) => void;
  index?: number;
  setEditable: React.Dispatch<CellEditPayload>;
  editable: CellEditPayload;
}
const TableRow = React.memo(
  ({
    columns,
    row,
    index,
    onCellUpdate,
    setEditable,
    editable,
  }: TableRowProps) => {
    return (
      <div className={styles.TableRow}>
        {columns.map((column) => {
          return (
            <TableCell
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
    );
  },
);

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
              {groupBy ? (
                <>
                  <GroupByHeader
                    row={row}
                    rowOpen={rowOpen}
                    onCollapseToggle={onToggleRowCollapse}
                    groupedColumn={groupedColumn as Column}
                  />
                  {rowOpen && (
                    <div className={styles.TableDrawer}>
                      {row.items.map((row, index) => {
                        return (
                          <TableRow
                            key={uuId()}
                            columns={columnsWithoutGroupBy as Column[]}
                            row={row}
                            index={index}
                            onCellUpdate={onCellUpdate as any}
                            setEditable={setEditable}
                            editable={editable}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <TableRow
                  key={uuId()}
                  columns={sortedColumns as Column[]}
                  row={row}
                  index={index}
                  onCellUpdate={onCellUpdate as any}
                  setEditable={setEditable}
                  editable={editable}
                />
              )}
            </>
          );
        }}
      />
    </div>
  );
}
