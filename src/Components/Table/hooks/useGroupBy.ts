import { useMemo } from "react";
import { getGroupBy } from "../utils";
import { Column, GroupBy, Pojo } from "../types";

interface GroupByHook<Row> {
  groupBy: keyof Row;
  rows: Row[];
  columns: Column<Row>[];
}

function isGroupBy(groupBy: any): groupBy is GroupBy {
  return Reflect.has(groupBy, "items") && Reflect.has(groupBy, "groupValue");
}
export default function useGroupBy<Row = Pojo>({
  groupBy,
  rows,
  columns,
}: GroupByHook<Row>) {
  const data = useMemo(() => {
    if (!groupBy) return rows;
    return getGroupBy<Row>(rows, groupBy);
  }, [rows, groupBy]);
  const groupedColumn = useMemo(
    () => columns.find(({ id }) => id === groupBy),
    [columns, groupBy],
  );
  const columnsWithoutGroupBy = useMemo(() => {
    return columns.filter(({ id }) => id !== groupBy);
  }, [columns, groupBy]);

  return { data, isGroupBy, groupedColumn, columnsWithoutGroupBy };
}
