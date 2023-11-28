import React, { useState } from "react";
import "./App.scss";
import mock from "./mocks/mock.json";
import { Table, ToolBar } from "./Components";
import RowData from "./type/RowData";
import { RowUpdatePayload } from "./Components/Table/types";
import { columns } from "./const";
import {
  useCellUpdate,
  useFilterColumns,
  useLocalStorage,
  useSearch,
} from "./hooks";

const originalData = mock as RowData[];
const identifier = "id";
const groupBy = "firstName";

function App() {
  const [data, setData] = useState(originalData);
  const [update, setUpdate] = useState<RowUpdatePayload>();
  useLocalStorage<RowData>({
    setDataByLocalStorage: setData,
    update,
    identifier: identifier,
  });
  const { setSearchValue, filteredData } = useSearch<RowData>({
    data,
    keys: ["firstName", "lastName", "email", "options", "phone", "number"],
  });

  const { onCellUpdate } = useCellUpdate<RowData>({
    setUpdate,
    setData,
    identifier,
  });

  const { selectedColumns, handleColumnSelection } = useFilterColumns<RowData>({
    groupBy,
  });

  return (
    <div className="App">
      <ToolBar<RowData>
        onSearch={setSearchValue}
        columns={columns}
        groupBy={groupBy}
        selectedColumns={selectedColumns}
        onFilterColumnChange={handleColumnSelection}
      />
      <Table<RowData>
        rows={filteredData}
        columns={columns}
        onCellUpdate={onCellUpdate}
        groupBy={groupBy}
        selectedColumns={selectedColumns}
      />
    </div>
  );
}

export default App;
