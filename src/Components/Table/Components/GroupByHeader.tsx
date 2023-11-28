import { Column, GroupBy, Pojo } from "../types";
import classNames from "classnames";
import styles from "../Table.module.scss";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";

interface GroupByRowProps<Row = Pojo> {
  row: GroupBy;
  rowOpen: boolean;
  onCollapseToggle: (row: GroupBy) => void;
  groupedColumn: Column;
  items: Row[];
}
export default function GroupByHeader<Row = Pojo>({
  row,
  rowOpen,
  onCollapseToggle,
  groupedColumn,
  items,
}: GroupByRowProps<Row>) {
  return (
    <div
      className={classNames(styles.TableRow, styles.GroupByHeader)}
      role="rowheader"
    >
      <div className={styles.ToggleRowOpen}>
        <IconButton onClick={() => onCollapseToggle(row)}>
          {rowOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>

      <div role={"cell"} className={"layout-align-y layout-spread"}>
        <div className={"layout-spread"}>
          <span>{groupedColumn.title}</span>
          :&nbsp;
          <span>{row.groupValue}</span>
        </div>
        <span className={styles.GroupByCount}>({items.length})</span>
      </div>
    </div>
  );
}
