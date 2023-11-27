import { Column, GroupBy } from "../types";
import classNames from "classnames";
import styles from "../Table.module.scss";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";

interface GroupByRowProps {
  row: GroupBy;
  rowOpen: boolean;
  onCollapseToggle: (row: GroupBy) => void;
  groupedColumn: Column;
}
export default function GroupByHeader({
  row,
  rowOpen,
  onCollapseToggle,
  groupedColumn,
}: GroupByRowProps) {
  return (
    <div className={classNames(styles.TableRow, styles.GroupByHeader)}>
      <div className={styles.ToggleRowOpen}>
        <IconButton onClick={() => onCollapseToggle(row)}>
          {rowOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>

      <div>
        <span>{groupedColumn.title}</span>
        :&nbsp;
        <span>{row.groupValue}</span>
      </div>
    </div>
  );
}
