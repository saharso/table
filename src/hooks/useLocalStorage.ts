import React, { useEffect } from "react";
import RowData from "../type/RowData";
const storageName = "storageEntries";
export default function useLocalStorage({
  setDataByLocalStorage,
}: {
  setDataByLocalStorage: React.Dispatch<React.SetStateAction<RowData[]>>;
}) {
  const [storageEntries, setStorageEntries] = React.useState<
    Record<string, RowData>
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
          return storageEntries[d.id as string] ?? d;
        });
      });
  }, []);

  return { setStorageEntries };
}
