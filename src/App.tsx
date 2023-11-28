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
import { useLocalStorage, useSearch } from "./hooks";
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
  const onCellUpdate = useCallback((update: RowUpdatePayload) => {
    setUpdate(update);
    setData((prevData) =>
      produce(prevData, (draftData) => {
        const rowIndex = draftData.findIndex(
          (rowData) => rowData[identifier] === update.row[identifier],
        );
        if (rowIndex !== -1) {
          const row = draftData[rowIndex] as RowData;
          const columnId = update.columnId as keyof RowData;
          (row[columnId] as string) = update.value as string;
        }
      }),
    );
  }, []);

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
