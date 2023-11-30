import { Column, GroupBy, Pojo } from "../../../types";
import classNames from "classnames";
import styles from "../Table.module.scss";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import { getCellWidth, RowSummary } from "../utils";

interface GroupByRowProps<Row = Pojo> {
  row: GroupBy;
  rowOpen: boolean;
  onCollapseToggle: (row: GroupBy) => void;
  groupedColumn: Column;
  items: Row[];
  columns: Column<Row>[];
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
              <div
                className={classNames(styles.DataCell, styles[column.overflow])}
              >
                {column.type === "number" && (
                  <div className={styles.GroupByNumber}>
                    {RowSummary.getNumberSummary<Row>(items, column)}
                  </div>
                )}
                {column.type === "boolean" && (
                  <div className={styles.GroupByNumber}>
                    {RowSummary.getBooleanSummary<Row>(items, column)} /{" "}
                    {items.length}
                  </div>
                )}
                {column.type === "options" && (
                  <div
                    className={classNames(
                      styles.GroupByNumber,
                      "layout-align-y flex-wrap gap-2",
                    )}
                  >
                    {RowSummary.getOptionsSummary<Row>(items, column).map(
                      (item) => {
                        return (
                          <div
                            key={item.value}
                            className={styles.OptionSummary}
                          >
                            <span
                              className={styles.Color}
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.amount}</span>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
