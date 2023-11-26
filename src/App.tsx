import React from "react";
import "./App.scss";
// import generateMockEntry from "./utils/createMocks";
import mock1 from "./mocks/mock1.json";
import { Table } from "./Components";
import RowData from "./type/RowData";
import { Column } from "./Components/Table/types";

// generate mock data
// const mockDataArray = Array.from({ length: 3000 }, generateMockEntry);

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
    width: 200,
  },
];

function App() {
  return (
    <div className="App">
      <Table<RowData> rows={mock1} columns={columns} identifier={"id"} />
    </div>
  );
}

export default App;
