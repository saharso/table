import React, { useEffect } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.scss";
// import generateMockEntry from "./utils/createMocks";
import mock1 from "./mocks/mock1.json";
import { Table } from "./Components";
import RowData from "./type/RowData";
import { Column, RowUpdatePayload } from "./Components/Table/types";
// import generateMockEntry from "./utils/createMocks";

// // generate mock data
// const mockDataArray = Array.from({ length: 3000 }, () => {
//   return {
//     ...generateMockEntry(),
//     items: Array.from({ length: 8 }, generateMockEntry),
//   };
// });
// console.log(mockDataArray);
const columns: Column<RowData>[] = [
  {
    id: "email",
    ordinalNo: 20,
    title: "Email",
    type: "string",
    width: 300,
  },
  {
    id: "firstName",
    ordinalNo: 2,
    title: "First Name",
    type: "string",
    width: 250,
  },
  {
    id: "lastName",
    ordinalNo: 3,
    title: "Last Name",
    type: "string",
    width: 250,
  },
  {
    id: "available",
    ordinalNo: 4,
    title: "Available",
    type: "boolean",
    width: 90,
  },
  {
    id: "options",
    ordinalNo: 5,
    title: "Options",
    type: "options",
    width: 200,
    options: ["option1", "option2", "option3"],
  },
  {
    id: "phone",
    ordinalNo: 5,
    title: "Phone",
    type: "string",
    // width: 200,
  },
  {
    id: "number",
    ordinalNo: 5,
    title: "Number",
    type: "number",
    width: 200,
  },
];

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

const storageName = "storageEntries";
function App() {
  const [data, setData] = React.useState(mock1 as RowData[]);
  const [openRows, setOpenRows] = React.useState<Set<string>>(new Set());
  const [storageEntries, setStorageEntries] = React.useState<
    Record<string, RowData>
  >({});
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

  useEffect(() => {
    if (Object.keys(storageEntries).length !== 0) {
      const previousEntries = JSON.parse(localStorage.getItem(storageName));
      localStorage.setItem(
        storageName,
        JSON.stringify({ ...previousEntries, ...storageEntries }),
      );
    }
  }, [storageEntries]);

  useEffect(() => {
    const storageEntries = JSON.parse(localStorage.getItem(storageName));
    storageEntries &&
      setData((prev) => {
        return prev.map((d) => {
          return storageEntries[d.id as string] ?? d;
        });
      });
  }, []);
  return (
    <div className="App">
      <Table<RowData>
        rows={data}
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
