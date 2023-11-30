import {
  Column,
  GroupBy,
  OptionsColumn,
  Pojo,
  SelectOption,
} from "../../../types";
import classNames from "classnames";
import styles from "../Table.module.scss";
import { IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React from "react";
import { getCellWidth } from "../utils";
type OptionColorPair = Record<
  string,
  { amount: number; color: string; value: string }
>;
function getOptions<Row = Pojo>(items: Row[], column: Column<Row>) {
  const optionColorPair = items.reduce((acc, curr) => {
    const option = (column as OptionsColumn).options.find(
      ({ value }) => curr[column.id] === value,
    );
    if (!acc[option.value]) {
      acc[option.value] = {
        amount: 1,
        color: option.color,
        value: option.value,
      };
    } else {
      acc[option.value]["amount"] += 1;
    }

    return acc;
  }, {} as OptionColorPair);

  return Object.values(optionColorPair);
}
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
                  <div
                    className={classNames(
                      styles.GroupByNumber,
                      "layout-align-y flex-wrap gap-2",
                    )}
                  >
                    {getOptions<Row>(items, column).map((item) => {
                      return (
                        <div key={item.value} className={styles.OptionSummary}>
                          <span
                            className={styles.Color}
                            style={{ backgroundColor: item.color }}
                          />
                          <span>{item.amount}</span>
                        </div>
                      );
                    })}
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
