export default interface RowData {
  id: string;
  available: boolean;
  email: string;
  firstName: string;
  lastName: string;
  options: string[];
  phone: string;
  number: number;
  items: RowData[];
}
