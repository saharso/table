import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import styles from "./ToolBar.module.scss";

interface ToolBarProps {
  onSearch: (value: string) => void;
  searchValue: string;
}
export default function ToolBar({ onSearch, searchValue }: ToolBarProps) {
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
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
