export default interface GroupBy<Row = unknown> {
  items: Row[];
  groupValue: string;
}
