import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.scss";
import mock1 from "./mocks/mock1.json";
import { Table, ToolBar } from "./Components";
import RowData from "./type/RowData";
import { RowUpdatePayload } from "./Components/Table/types";
import { columns } from "./const";
import { useLocalStorage, useSearch } from "./hooks";
// import generateMockEntry from "./utils/createMocks";

// // generate mock data
// const mockDataArray = Array.from({ length: 3000 }, () => {
//   return {
//     ...generateMockEntry(),
//     items: Array.from({ length: 8 }, generateMockEntry),
//   };
// });
// console.log(mockDataArray);

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
  const [data, setData] = React.useState(mock1 as RowData[]);
  const [openRows, setOpenRows] = React.useState<Set<string>>(new Set());
  const { setStorageEntries } = useLocalStorage({
    setDataByLocalStorage: setData,
  });
  const { searchValue, setSearchValue, filteredData } = useSearch<RowData>({
    data,
    keys: ["firstName", "lastName", "email"],
  });

  const onCellUpdate = (update: RowUpdatePayload<RowData>) => {
    const updatedData = data.map((rowData) => {
      if (rowData.id === update.row.id) {
        setStorageEntries((prev) => {
          return getUpdatedEntry(rowData, prev, update);
        });
        return { ...rowData, [update.columnId]: update.value };
      }
      return rowData;
    });
    setData(updatedData);
  };

  return (
    <div className="App">
      <ToolBar searchValue={searchValue} onSearch={setSearchValue} />
      <Table<RowData>
        rows={filteredData}
        columns={columns}
        identifier={"id"}
        onCellUpdate={onCellUpdate}
        openRows={openRows}
        groupKey={"items"}
        onRowToggle={(id: string) => {
          setOpenRows((prev) => {
            const newPrev = new Set(prev);
            if (newPrev.has(id)) {
              newPrev.delete(id);
            } else {
              newPrev.add(id);
            }
            return newPrev;
          });
        }}
      />
    </div>
  );
}

export default App;
