export default interface Column<Row = unknown> {
  id: keyof Row;
  ordinalNo: number;
  title: string;
  type: string;
  width?: number;
}
