export default interface RowUpdatePayload<Row = unknown> {
  row: Row;
  columnId: keyof Row;
  value: string | number | boolean;
  index?: number;
}
