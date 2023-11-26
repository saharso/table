export default interface RowUpdatePayload<Row = unknown> {
  row: Row;
  columnId: keyof Row;
  value: string;
  index?: number;
}
