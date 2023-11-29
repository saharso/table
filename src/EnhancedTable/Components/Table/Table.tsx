import {
  CellEditPayload,
  Column,
  GroupBy,
  Pojo,
  RowUpdatePayload,
} from "../../types";
import styles from "./Table.module.scss";
import { Virtuoso } from "react-virtuoso";
import { GroupByHeader, TableHead, TableRow } from "./Components";
import React, { useState } from "react";
import useGroupBy from "./hooks/useGroupBy";
import { v4 as uuId } from "uuid";
import { useDisplayColumns } from "../../hooks";
import { setToggle } from "./utils";

interface TableProps<Row = Pojo> {
  rows: Row[];
  columns: Column<Row>[];
  onCellUpdate?: ({ row, columnId, value, index }: RowUpdatePayload) => void;
  groupBy?: keyof Row;
  selectedColumns?: Set<string>;
}
export default function Table<Row = Pojo>({
  rows,
  columns,
  onCellUpdate,
  groupBy,
  selectedColumns,
}: TableProps<Row>) {
  const [editable, setEditable] = useState<CellEditPayload>();
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set());
  const { displayColumns } = useDisplayColumns<Row>({
    groupBy,
    columns,
    selectedColumns,
  });
  const { data, isGroupBy, groupedColumn, columnsWithoutGroupBy } = useGroupBy({
    groupBy,
    rows,
    columns: displayColumns,
  });

  const onToggleRowCollapse = (row: GroupBy) => {
    setCollapsedRows((prev) => {
      const id = row.groupValue as string;
      return setToggle(prev, id);
    });
  };
  return (
    <div className={styles.Table} role={"table"}>
      <TableHead columns={columnsWithoutGroupBy} />
      <Virtuoso
        role="rowgroup"
        data={data as never[]}
        useWindowScroll
        itemContent={(index, row: GroupBy | Pojo) => {
          const rowOpen =
            isGroupBy(row) && !collapsedRows.has(row.groupValue as string);
          return (
            <>
              {groupBy ? (
                <>
                  <GroupByHeader<Row>
                    row={row as GroupBy}
                    rowOpen={rowOpen}
                    onCollapseToggle={onToggleRowCollapse}
                    groupedColumn={groupedColumn as Column}
                    items={row.items as Row[]}
                  />
                  {rowOpen && (
                    <div className={styles.TableGroupedRowsDrawer}>
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
