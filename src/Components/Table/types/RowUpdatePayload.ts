export default interface RowUpdatePayload<Row = unknown> {
  row: Row;
  columnId: string;
  value: string | number | boolean;
  index?: number;
}
