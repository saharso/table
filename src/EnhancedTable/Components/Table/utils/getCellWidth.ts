import { Column } from "../../../types";

export default function getCellWidth(column: Column) {
  return column.width
    ? { width: column.width, minWidth: column.minWidth || 40 }
    : { flex: 1, width: 0, minWidth: column.minWidth || 40 };
}
