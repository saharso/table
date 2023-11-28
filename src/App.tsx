import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.scss";
import mock from "./mocks/mock.json";
import { Table, ToolBar } from "./Components";
import RowData from "./type/RowData";
import { RowUpdatePayload } from "./Components/Table/types";
import { columns } from "./const";
import { useLocalStorage, useSearch } from "./hooks";
import { produce } from "immer";

function App() {
  const [data, setData] = useState(mock as RowData[]);
  const [update, setUpdate] = useState<RowUpdatePayload<RowData>>();
  useLocalStorage({
    setDataByLocalStorage: setData as unknown as Dispatch<
      SetStateAction<Record<string, unknown>[]>
    >,
    update,
    identifier: "id",
  });
  const { searchValue, setSearchValue, filteredData } = useSearch<RowData>({
    data,
    keys: ["firstName", "lastName", "email", "options"],
  });
  const onCellUpdate = useCallback((update: RowUpdatePayload<RowData>) => {
    setUpdate(update);
    setData((prevData) =>
      produce(prevData, (draftData) => {
        const rowIndex = draftData.findIndex(
          (rowData) => rowData.id === update.row.id,
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
