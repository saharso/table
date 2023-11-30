import React, { useCallback } from "react";
import { Pojo, RowUpdatePayload } from "../types";
import { produce } from "immer";

interface CellUpdateProps<Row = Pojo> {
  identifier: keyof Row;
  setUpdate: React.Dispatch<React.SetStateAction<RowUpdatePayload>>;
  setData: React.Dispatch<React.SetStateAction<Row[]>>;
}
export default function useCellUpdate<Row>({
  identifier,
  setUpdate,
  setData,
}: CellUpdateProps<Row>) {
  const onCellUpdate = useCallback(
    (update: RowUpdatePayload) => {
      setUpdate(update);
      setData((prevData) =>
        produce(prevData, (draftData) => {
          const rowIndex = draftData.findIndex((rowData) => {
            const row = rowData as Row;
            return (
              row[identifier as keyof Row] === update.row[identifier as string]
            );
          });
          if (rowIndex !== -1) {
            const row = draftData[rowIndex] as Row;
            const columnId = update.columnId as keyof Row;
            (row[columnId] as string) = update.value as string;
          }
        }),
      );
    },
    [identifier, setData, setUpdate],
  );

  return { onCellUpdate };
}
