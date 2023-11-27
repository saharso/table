interface DefaultColumn<Row = unknown> {
  id: keyof Row;
  ordinalNo: number;
  title: string;
  type: "string" | "number" | "boolean" | "options";
  width?: number;
}

interface OptionsColumn<Row = unknown> extends DefaultColumn<Row> {
  type: "options";
  options: string[];
}

type Column<Row = unknown> = DefaultColumn<Row> | OptionsColumn<Row>;

export default Column;
