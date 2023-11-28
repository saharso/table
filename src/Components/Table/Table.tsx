import {
  CellEditPayload,
  Column,
  GroupBy,
  Pojo,
  RowUpdatePayload,
} from "./types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import { GroupByHeader, TableCell, TableHead } from "./Components";
import React, { useMemo, useState } from "react";
import useGroupBy from "./hooks/useGroupBy";
import { v4 as uuId } from "uuid";

interface TableProps<Row = Pojo> {
  rows: Row[];
  columns: Column<Row>[];
  onCellUpdate?: ({ row, columnId, value, index }: RowUpdatePayload) => void;
  removeHeader?: boolean;
  groupBy?: keyof Row;
  selectedColumns?: Set<string>;
}

interface TableRowProps<Row = Pojo> {
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

export default function Table<Row = Pojo>({
  rows,
  columns,
  onCellUpdate,
  removeHeader,
  groupBy,
  selectedColumns,
}: TableProps<Row>) {
  const displayColumns = useMemo(
    () =>
      columns
        .sort((a, b) => a.ordinalNo - b.ordinalNo)
        .filter(({ id }) => {
          if (id === groupBy) return true;
          return selectedColumns.has(id as string);
        }),
    [columns, groupBy, selectedColumns],
  );
  const [editable, setEditable] = useState<CellEditPayload>();
  const { data, isGroupBy, groupedColumn, columnsWithoutGroupBy } = useGroupBy({
    groupBy,
    rows,
    columns: displayColumns,
  });
  const [collapsedRows, setCollapsedRows] = React.useState<Set<string>>(
    new Set(),
  );

  const onToggleRowCollapse = (row: GroupBy) => {
    setCollapsedRows((prev) => {
      const newPrev = new Set(prev);
      const id = row.groupValue as string;
      newPrev.has(id) ? newPrev.delete(id) : newPrev.add(id);
      return newPrev;
    });
  };
  return (
    <div className={styles.Table}>
      {!removeHeader && <TableHead columns={columnsWithoutGroupBy} />}
      <Virtuoso
        data={data as never[]}
        useWindowScroll
        itemContent={(index, row: GroupBy | Pojo) => {
          const rowOpen =
            isGroupBy(row) && !collapsedRows.has(row.groupValue as string);
          return (
            <>
              {groupBy ? (
                <>
                  <GroupByHeader
                    row={row as GroupBy}
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
                  columns={displayColumns as Column[]}
                  row={row as Pojo}
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
