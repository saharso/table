import Pojo from "./Pojo";

export default interface GroupBy<Row = Pojo> {
  items: Row[];
  groupValue: string;
}
