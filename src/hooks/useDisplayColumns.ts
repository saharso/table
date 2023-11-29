import { Column, Pojo } from "../Components/Table/types";
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
        .sort((a, b) => a.ordinalNo - b.ordinalNo)
        .filter(({ id }) => {
          if (id === groupBy) return true;
          return selectedColumns.has(id as string);
        }),
    [columns, groupBy, selectedColumns],
  );

  return { displayColumns };
}
