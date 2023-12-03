import { Column, Pojo } from "../types";
import { useMemo } from "react";

interface DisplayColumnsProps<Row = Pojo> {
  columns: Column<Row>[];
  groupBy?: keyof Row;
  selectedColumns?: Set<string>;
}
export default function useDisplayColumns<Row = Pojo>({
  columns,
  groupBy,
  selectedColumns,
}: DisplayColumnsProps<Row>) {
  const displayColumns = useMemo(
    () =>
      columns
        .sort((a, b) => {
          return (a.ordinalNo || 0) - (b.ordinalNo || 0);
        })
        .reduce((result, column) => {
          if (column.id === groupBy) {
            // group-by column should be the first column
            result.unshift(column);
          } else {
            // filter by selected columns, group-by is always displayed
            if (selectedColumns.has(column.id as string)) {
              result.push(column);
            }
          }
          return result;
        }, [] as Column<Row>[]),
    [columns, groupBy, selectedColumns],
  );

  return { displayColumns };
}
