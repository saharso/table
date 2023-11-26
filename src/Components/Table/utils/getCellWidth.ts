import { Column } from "../types";

export default function getCellWidth(column: Column) {
  return column.width ? { width: column.width } : { flex: 1, width: 0 };
}
