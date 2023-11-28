import { useEffect, useState } from "react";
import { columns } from "../const";
import { Pojo } from "../Components/Table/types";

export default function useFilterColumns<Row = Pojo>({
  groupBy,
}: {
  groupBy: keyof Row;
}) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const selectedColumns = new Set<string>();
    columns.forEach((column) => {
      if (column.id === groupBy) return;
      selectedColumns.add(column.id as string);
    });
    setSelectedColumns(selectedColumns);
  }, [groupBy]);

  const handleColumnSelection = (columnId: string) => {
    setSelectedColumns((prev) => {
      const clone = new Set(prev);
      if (clone.has(columnId)) {
        clone.delete(columnId);
      } else {
        clone.add(columnId);
      }
      return clone;
    });
  };

  return { selectedColumns, setSelectedColumns, handleColumnSelection };
}
