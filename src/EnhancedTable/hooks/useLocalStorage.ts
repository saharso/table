import React, { useEffect } from "react";
import { Pojo, RowUpdatePayload } from "../types";
const storageName = "storageEntries";

export default function useLocalStorage<Row = Pojo>({
  setDataByLocalStorage,
  update,
  identifier,
}: {
  setDataByLocalStorage: React.Dispatch<React.SetStateAction<Row[]>>;
  update: RowUpdatePayload;
  identifier: keyof Row;
}) {
  const [storageEntries, setStorageEntries] = React.useState<
    Record<string, Record<string, unknown>>
  >({});

  useEffect(() => {
    if (Object.keys(storageEntries).length !== 0) {
      const previousEntries = JSON.parse(localStorage.getItem(storageName));
      localStorage.setItem(
        storageName,
        JSON.stringify({ ...previousEntries, ...storageEntries }),
      );
    }
  }, [storageEntries]);

  useEffect(() => {
    const storageEntries = JSON.parse(localStorage.getItem(storageName));
    storageEntries &&
      setDataByLocalStorage((prev) => {
        return prev.map((d) => {
          const lcRow = storageEntries[d[identifier as keyof Row]];
          if (lcRow) {
            return lcRow;
          }
          return d;
        });
      });
  }, [identifier, setDataByLocalStorage]);

  useEffect(() => {
    setStorageEntries((prev) => {
      if (!update) return prev;
      const clone = { ...prev };
      clone[update.row[identifier as keyof typeof update.row] as string] = {
        ...(update.row as Record<string, unknown>),
        [update.columnId]: update.value,
      };
      return clone;
    });
  }, [update, identifier]);

  return { setStorageEntries };
}
