import React, { useEffect, useState } from "react";
import "./EnhancedTable.scss";
import { Table, ToolBar } from "./Components";
import { Column, Pojo, RowUpdatePayload } from "./types";
import {
  useCellUpdate,
  useFilterColumns,
  useLocalStorage,
  useSearch,
} from "./hooks";

interface EnhancedTableProps<Row = Pojo> {
  data: Row[];
  columns: Column<Row>[];
  groupBy?: keyof Row;
  identifier: keyof Row;
}
function EnhancedTable<Row = Pojo>({
  data,
  columns,
  identifier,
  groupBy,
}: EnhancedTableProps<Row>) {
  const [rows, setRows] = useState<Row[]>(data);
  const [update, setUpdate] = useState<RowUpdatePayload>();
  useLocalStorage<Row>({
    setDataByLocalStorage: setRows,
    update,
    identifier,
  });
  const { setSearchValue, filteredData } = useSearch<Row>({
    data: rows,
    keys: columns.map((column) => column.id),
  });

  const { onCellUpdate } = useCellUpdate<Row>({
    setUpdate,
    setData: setRows,
    identifier,
  });

  const { selectedColumns, handleColumnSelection } = useFilterColumns<Row>({
    groupBy,
  });

  useEffect(() => {
    setRows(rows);
  }, [rows]);

  return (
    <div className="EnhancedTable">
      <ToolBar<Row>
        onSearch={setSearchValue}
        columns={columns}
        groupBy={groupBy}
        selectedColumns={selectedColumns}
        onFilterColumnChange={handleColumnSelection}
      />
      <Table<Row>
        rows={filteredData}
        columns={columns}
        onCellUpdate={onCellUpdate}
        groupBy={groupBy}
        selectedColumns={selectedColumns}
      />
    </div>
  );
}

export default EnhancedTable;
