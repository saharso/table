import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import styles from "./ToolBar.module.scss";
import { debounce } from "lodash";

interface ToolBarProps {
  onSearch: (value: string) => void;
  searchValue: string;
}
export default function ToolBar({ onSearch, searchValue }: ToolBarProps) {
  const [displayValue, setDisplayValue] = React.useState<string>("");
  const debouncedInputChange = debounce((value: string) => {
    onSearch(value);
  }, 100);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedInputChange(e.target.value);
    setDisplayValue(e.target.value);
  };
  return (
    <div className={styles.ToolBar}>
      <div className={"layout-align-y gap-2"}>
        <label htmlFor={"search"}>Search</label>
        <TextField
          id={"search"}
          size={"small"}
          type={"search"}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
          value={displayValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
