import { Column } from "../Components/Table/types";
import RowData from "../type/RowData";

const columns: Column<RowData>[] = [
  {
    id: "email",
    ordinalNo: 20,
    title: "Email",
    type: "string",
    width: 300,
    overflow: "ellipsis",
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
    minWidth: 300,
  },
  {
    id: "number",
    ordinalNo: 5,
    title: "Number",
    type: "number",
    width: 200,
    overflow: "break-word",
    minWidth: 100,
  },
];

export default columns;
