import React, { useCallback, useEffect } from "react";
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

function getUpdatedEntry(
  rowData: RowData,
  prev: Record<string, RowData>,
  update: RowUpdatePayload<RowData>,
) {
  const shallowClone = { ...prev };
  shallowClone[rowData.id as string] = {
    ...rowData,
    [update.columnId]: update.value,
  };
  return shallowClone;
}

function App() {
  const [data, setData] = React.useState(mock as RowData[]);
  const { setStorageEntries } = useLocalStorage({
    setDataByLocalStorage: setData,
  });
  const { searchValue, setSearchValue, filteredData } = useSearch<RowData>({
    data,
    keys: ["firstName", "lastName", "email"],
  });
  const onCellUpdate = useCallback((update: RowUpdatePayload<RowData>) => {
    setData((prevData) =>
      produce(prevData, (draftData) => {
        const rowIndex = draftData.findIndex(
          (rowData) => rowData.id === update.row.id,
        );
        if (rowIndex !== -1) {
          const row = draftData[rowIndex] as RowData;
          const columnId = update.columnId as keyof RowData;
          (row[columnId] as string) = update.value as string;
          setStorageEntries((prev) => {
            return getUpdatedEntry(draftData[rowIndex], prev, update);
          });
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
        identifier={"id"}
        onCellUpdate={onCellUpdate}
        groupBy={"firstName"}
      />
    </div>
  );
}

export default App;
