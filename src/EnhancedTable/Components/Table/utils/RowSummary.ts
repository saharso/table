import { Column, OptionsColumn, Pojo } from "../../../types";
import parsePrimitive from "./parsePrimitive";

namespace RowSummary {
  type OptionColorPair = Record<
    string,
    { amount: number; color: string; value: string }
  >;
  export function getOptionsSummary<Row = Pojo>(
    items: Row[],
    column: Column<Row>,
  ) {
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

  export function getNumberSummary<Row = Pojo>(
    items: Row[],
    column: Column<Row>,
  ) {
    const summary = items.reduce((acc, curr) => {
      return acc + Number(curr[column.id]);
    }, 0);
    return parsePrimitive(summary);
  }

  export function getBooleanSummary<Row = Pojo>(
    items: Row[],
    column: Column<Row>,
  ) {
    return items.reduce((acc, curr) => {
      const augment = Boolean(curr[column.id]) ? 1 : 0;
      return acc + augment;
    }, 0);
  }
}

export default RowSummary;
