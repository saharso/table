import {
  CellEditPayload,
  Column,
  GroupBy,
  Pojo,
  RowUpdatePayload,
  SortState,
} from "../../types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import { GroupByHeader, TableHead, TableRow } from "./Components";
import React, { useState } from "react";
import useGroupBy from "./hooks/useGroupBy";
import { v4 as uuId } from "uuid";
import { setToggle } from "./utils";

interface TableProps<Row = Pojo> {
  rows: Row[];
  columns: Column<Row>[];
  onCellUpdate?: ({ row, columnId, value, index }: RowUpdatePayload) => void;
  groupBy?: keyof Row;
  onSort: (sortState: SortState) => void;
  identifier: keyof Row;
  sortState: SortState;
}
export default function Table<Row = Pojo>({
  rows,
  columns,
  onCellUpdate,
  groupBy,
  identifier,
  onSort,
  sortState,
}: TableProps<Row>) {
  const [editable, setEditable] = useState<CellEditPayload>();
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set());
  const { data, isGroupBy, groupedColumn } = useGroupBy<Row>({
    groupBy,
    rows,
    columns,
  });

  const onToggleRowCollapse = (row: GroupBy) => {
    setCollapsedRows((prev) => {
      const id = row.groupValue as string;
      return setToggle(prev, id);
    });
  };

  if (!data || data.length === 0) return <div>No rows to show</div>;
  return (
    <div className={styles.Table} role={"table"}>
      <TableHead columns={columns} onSort={onSort} sortState={sortState} />
      <Virtuoso
        role="rowgroup"
        data={data as never[]}
        useWindowScroll
        itemContent={(_, row: GroupBy | Row) => {
          const rowOpen =
            isGroupBy(row) && !collapsedRows.has(row.groupValue as string);
          return (
            <>
              {isGroupBy(row) ? (
                <>
                  <GroupByHeader<Row>
                    row={row as GroupBy}
                    rowOpen={rowOpen}
                    onCollapseToggle={onToggleRowCollapse}
                    groupedColumn={groupedColumn as Column}
                    items={row.items as Row[]}
                    columns={columns}
                  />
                  {rowOpen && (
                    <div className={styles.TableGroupedRowsDrawer}>
                      {row.items.map((row) => {
                        return (
                          <TableRow
                            key={uuId()}
                            columns={columns as Column[]}
                            row={row}
                            rowId={row[identifier as string] as string}
                            onCellUpdate={onCellUpdate as any}
                            setEditable={setEditable}
                            editable={editable}
                            groupedColumn={groupedColumn as Column}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <TableRow
                  key={uuId()}
                  columns={columns as Column[]}
                  row={row as Pojo}
                  rowId={row[identifier] as string}
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
