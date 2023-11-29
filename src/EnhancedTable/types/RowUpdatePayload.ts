import Pojo from "./Pojo";

export default interface RowUpdatePayload<Row = Pojo> {
  row: Row;
  columnId: string;
  value: string | number | boolean;
  index?: number;
}
