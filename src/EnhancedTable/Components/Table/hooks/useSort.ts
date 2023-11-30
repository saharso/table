import React, { useCallback } from "react";
import arraySort from "array-sort";
import { SortState } from "../../../types";

export default function useSort<Row>({
  rows,
  setData,
}: {
  rows: Row[];
  setData: React.Dispatch<React.SetStateAction<Row[]>>;
}) {
  const [sortState, setSortState] = React.useState<SortState>(null);

  const handleSortingState = useCallback(
    (sortingState: SortState) => {
      const sorted =
        sortingState != null
          ? arraySort(
              [...rows],
              function (a, b) {
                return a[sortingState.dataKey as keyof Row] >
                  b[sortingState.dataKey as keyof Row]
                  ? 1
                  : -1;
              },
              {
                reverse: !sortingState.asc,
              },
            )
          : rows;
      setData(sorted);
      setSortState(sortingState);
    },
    [rows, setData],
  );

  return { handleSortingState, sortState };
}
