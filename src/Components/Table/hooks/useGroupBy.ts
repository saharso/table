import { useMemo } from "react";
import getGroupBy from "../utils/getGroupBy";
import { GroupBy } from "../types";

interface GroupByHook<Row> {
  groupBy: keyof Row;
  rows: Row[];
}

function isGroupBy(groupBy: any): groupBy is GroupBy<unknown> {
  return Reflect.has(groupBy, "items") && Reflect.has(groupBy, "groupValue");
}
export default function useGroupBy<Row = unknown>({
  groupBy,
  rows,
}: GroupByHook<Row>) {
  const data = useMemo(() => {
    if (!groupBy) return rows;
    return getGroupBy<Row>(rows, groupBy);
  }, [rows, groupBy]);

  return { data, isGrouped: Boolean(groupBy), isGroupBy };
}
