import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import "./App.scss";
import mock from "./mocks/mock.json";
import { Table, ToolBar } from "./Components";
import RowData from "./type/RowData";
import { RowUpdatePayload } from "./Components/Table/types";
import { columns } from "./const";
import { useCellUpdate, useLocalStorage, useSearch } from "./hooks";
import { produce } from "immer";

const originalData = mock as RowData[];
const identifier = "id";

function App() {
  const [data, setData] = useState(originalData);
  const [update, setUpdate] = useState<RowUpdatePayload>();
  useLocalStorage<RowData>({
    setDataByLocalStorage: setData,
    update,
    identifier: identifier,
  });
  const { searchValue, setSearchValue, filteredData } = useSearch<RowData>({
    data,
    keys: ["firstName", "lastName", "email", "options", "phone", "number"],
  });

  const { onCellUpdate } = useCellUpdate<RowData>({
    setUpdate,
    setData,
    identifier,
  });

  return (
    <div className="App">
      <ToolBar searchValue={searchValue} onSearch={setSearchValue} />
      <Table<RowData>
        rows={filteredData}
        columns={columns}
        onCellUpdate={onCellUpdate}
        groupBy={"firstName"}
      />
    </div>
  );
}

export default App;
