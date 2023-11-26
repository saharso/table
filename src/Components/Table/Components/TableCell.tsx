import { Column, RowUpdatePayload } from "../types";
import { v4 as uuId } from "uuid";
import { useState } from "react";
import { getCellWidth } from "../utils";

function OptionsCell({ options }: { options: string[] }) {
  return (
    <select>
      <option value="">Select</option>
      {options.map((option) => (
        <option key={uuId()}>{option}</option>
      ))}
    </select>
  );
}
function EditableStringCell({
  data,
  onSaveCell,
}: {
  data: string;
  onSaveCell: (value: string) => void;
}) {
  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState(data);

  return (
    <div data-test={"editable-string-cell"}>
      <button
        onClick={(prev) => {
          setEditable((prev) => !prev);
        }}
      >
        Edit
      </button>
      {!editable && <div>{data}</div>}
      {editable && (
        <div>
          <input
            type="text"
            defaultValue={data}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button
            onClick={() => {
              onSaveCell(value);
              setEditable(false);
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
function BooleanCell({ data }: { data: boolean }) {
  return (
    <div>
      <input type="checkbox" checked={data} onChange={() => {}} />
    </div>
  );
}
interface TableCellProps<Row = unknown> {
  row: Row;
  column: Column<Row>;
  onRowUpdate: ({ row, columnId, value }: RowUpdatePayload<Row>) => void;
  className?: string;
}

export default function TableCell<Row = unknown>({
  row,
  column,
  onRowUpdate,
  className,
}: TableCellProps<Row>) {
  return (
    <div className={className} style={getCellWidth(column as Column)}>
      {column.type === "options" && (
        <OptionsCell options={row[column.id] as string[]} />
      )}
      {column.type === "string" && (
        <EditableStringCell
          onSaveCell={(value) => {
            onRowUpdate({ row, columnId: column.id, value });
          }}
          data={row[column.id] as string}
        />
      )}
      {column.type === "boolean" && (
        <BooleanCell data={row[column.id] as boolean} />
      )}
    </div>
  );
}
