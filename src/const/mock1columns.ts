import { Column } from "../EnhancedTable/types";
import Mock1Model from "../type/Mock1Model";

const mock1columns: Column<Mock1Model>[] = [
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
    options: [
      { value: "option1", label: "Option 1", color: "#ef3e66" },
      { value: "option2", label: "Option 2", color: "#f8ed14" },
      { value: "option3", label: "Option 3", color: "#6dfa3e" },
    ],
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

export default mock1columns;
