import React from "react";
import "./App.scss";
import { List } from "immutable";
// import generateMockEntry from "./utils/createMocks";
import mock1 from "./mocks/mock1.json";
import { Table } from "./Components";
import RowData from "./type/RowData";
import { Column, RowUpdatePayload } from "./Components/Table/types";

// // generate mock data
// const mockDataArray = Array.from({ length: 3000 }, generateMockEntry);
// console.log(mockDataArray);
const columns: Column<RowData>[] = [
  {
    id: "email",
    ordinalNo: 20,
    title: "Email",
    type: "string",
    width: 200,
  },
  {
    id: "firstName",
    ordinalNo: 2,
    title: "First Name",
    type: "string",
    width: 200,
  },
  {
    id: "lastName",
    ordinalNo: 3,
    title: "Last Name",
    type: "string",
    width: 200,
  },
  {
    id: "available",
    ordinalNo: 4,
    title: "Available",
    type: "boolean",
    width: 200,
  },
  {
    id: "options",
    ordinalNo: 5,
    title: "Options",
    type: "options",
    width: 200,
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

function App() {
  const [data, setData] = React.useState(mock1 as RowData[]);
  const onRowUpdate = (row: RowUpdatePayload<RowData>) => {
    const updatedData = data.map((d) => {
      if (d.id === row.row.id) {
        return { ...d, [row.columnId]: row.value };
      }
      return d;
    });
    setData(updatedData);
  };
  return (
    <div className="App">
      <Table<RowData>
        rows={data}
        columns={columns}
        identifier={"id"}
        onRowUpdate={onRowUpdate}
      />
    </div>
  );
}

export default App;
