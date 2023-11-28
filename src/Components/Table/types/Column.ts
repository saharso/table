import Pojo from "./Pojo";

interface DefaultColumn<Row = Pojo> {
  id: keyof Row;
  ordinalNo: number;
  title: string;
  type: "string" | "number" | "boolean" | "options";
  width?: number;
}

export interface OptionsColumn<Row = Pojo> extends DefaultColumn<Row> {
  type: "options";
  options: string[];
}

type Column<Row = Pojo> = DefaultColumn<Row> | OptionsColumn<Row>;

export default Column;
