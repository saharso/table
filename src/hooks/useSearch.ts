import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";

interface UseSearchProps<Row> {
  data: Row[];
  keys: Array<keyof Row>;
}
export default function useSearch<Row = unknown>({
  data,
  keys,
}: UseSearchProps<Row>) {
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const fuse = useMemo(() => {
    return new Fuse(data, {
      threshold: 0,
      keys: keys as string[],
    });
  }, [keys, data]);

  useEffect(() => {
    if (searchValue) {
      const results = fuse.search(searchValue);
      setFilteredData(results.map((result) => result.item));
    } else {
      setFilteredData(data);
    }
  }, [searchValue, data]);
  return { searchValue, setSearchValue, filteredData };
}
