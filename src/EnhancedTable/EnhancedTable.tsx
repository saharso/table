import React, { useEffect, useState } from "react";
import "./EnhancedTable.scss";
import { Table, ToolBar } from "./Components";
import { Column, Pojo, RowUpdatePayload } from "./types";
import {
  useCellUpdate,
  useDisplayColumns,
  useFilterColumns,
  useLocalStorage,
  useSearch,
} from "./hooks";
import { useSort } from "./Components/Table/hooks";

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
  const [rows, setRows] = useState<Row[]>();
  const [update, setUpdate] = useState<RowUpdatePayload>();
  const { selectedColumns, handleColumnSelection } = useFilterColumns<Row>({
    groupBy,
  });
  const { displayColumns } = useDisplayColumns<Row>({
    groupBy,
    columns,
    selectedColumns,
  });

  useLocalStorage<Row>({
    setDataByLocalStorage: setRows,
    update,
    identifier,
    dataReady: Array.isArray(rows),
  });

  const { setSearchValue, filteredData } = useSearch<Row>({
    data: rows || [],
    keys: displayColumns.map((column) => column.id),
  });

  const { onCellUpdate } = useCellUpdate<Row>({
    setUpdate,
    setData: setRows,
    identifier,
  });

  const { handleSortingState, sortState } = useSort<Row>({
    rows: filteredData,
    setData: setRows,
  });

  useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <div className="EnhancedTable">
      <ToolBar<Row>
        onSearch={setSearchValue}
        originalColumns={columns}
        groupBy={groupBy}
        selectedColumns={selectedColumns}
        onFilterColumnChange={handleColumnSelection}
      />
      <Table<Row>
        rows={filteredData}
        columns={displayColumns}
        onCellUpdate={onCellUpdate}
        groupBy={groupBy}
        onSort={handleSortingState}
        identifier={identifier}
        sortState={sortState}
      />
    </div>
  );
}

export default EnhancedTable;
