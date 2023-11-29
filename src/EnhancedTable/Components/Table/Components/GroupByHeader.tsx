import { Column, GroupBy, Pojo } from "../../../types";
import classNames from "classnames";
import styles from "../Table.module.scss";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import { getCellWidth } from "../utils";

interface GroupByRowProps<Row = Pojo> {
  row: GroupBy;
  rowOpen: boolean;
  onCollapseToggle: (row: GroupBy) => void;
  groupedColumn: Column;
  items: Row[];
  columns: Column<Row>[];
}

function getOptions<Row = Pojo>(items: Row[], column: Column<Row>) {
  return items.reduce(
    (acc, curr) => {
      const option = curr[column.id] as string;

      if (!acc[option]) {
        acc[option] = 1;
      } else {
        (acc[option] as number) += 1;
      }

      return acc;
    },
    {} as Record<string, number>,
  );
}
export default function GroupByHeader<Row = Pojo>({
  row,
  rowOpen,
  onCollapseToggle,
  groupedColumn,
  items,
  columns,
}: GroupByRowProps<Row>) {
  return (
    <div
      className={classNames(styles.TableRow, styles.GroupByHeader)}
      role="rowheader"
    >
      {columns.map((column) => {
        if (column.type === "options") {
          const aggregatedOptions = getOptions<Row>(items, column);

          console.log(aggregatedOptions);
        }
        return (
          <div
            key={column.id as string}
            className={styles.TableCell}
            style={getCellWidth(column as Column)}
            role={"cell"}
          >
            {column.id === groupedColumn?.id ? (
              <div className={"layout-align-y gap-1"}>
                <div className={styles.ToggleRowOpen}>
                  <IconButton onClick={() => onCollapseToggle(row)}>
                    {rowOpen ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                  </IconButton>
                </div>

                <div role={"cell"} className={"layout-align-y layout-spread"}>
                  <div className={"layout-spread"}>
                    <span>{row.groupValue}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {column.type === "number" && (
                  <div className={styles.GroupByNumber}>
                    {items.reduce((acc, curr) => {
                      return acc + Number(curr[column.id]);
                    }, 0)}
                  </div>
                )}
                {column.type === "boolean" && (
                  <div className={styles.GroupByNumber}>
                    {items.reduce((acc, curr) => {
                      const augment = Boolean(curr[column.id]) ? 1 : 0;
                      return acc + augment;
                    }, 0)}
                  </div>
                )}
                {column.type === "options" && (
                  <div className={styles.GroupByNumber}></div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
