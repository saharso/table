import { Column, OptionsColumn, RowUpdatePayload } from "../types";
import { v4 as uuId } from "uuid";
import { useState } from "react";
import { getCellWidth } from "../utils";

function SelectCell({
  options,
  data,
  onSaveCell,
}: {
  data: string;
  options: string[];
  onSaveCell: (value: string) => void;
}) {
  return (
    <select
      value={data}
      onChange={(e) => {
        onSaveCell(e.target.value);
      }}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={uuId()}>{option}</option>
      ))}
    </select>
  );
}
function EditableDataCell({
  data,
  onSaveCell,
  type = "string",
}: {
  data: string;
  onSaveCell: (value: string) => void;
  type?: "string" | "number";
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
            type={type}
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
function BooleanCell({
  data,
  onSaveCell,
}: {
  data: boolean;
  onSaveCell: (value: boolean) => void;
}) {
  return (
    <div>
      <input
        type="checkbox"
        checked={data}
        onChange={(e) => onSaveCell(e.target.checked)}
      />
    </div>
  );
}
interface TableCellProps<Row = unknown> {
  row: Row;
  column: Column<Row>;
  onCellUpdate: ({ row, columnId, value }: RowUpdatePayload<Row>) => void;
  className?: string;
}

export default function TableCell<Row = unknown>({
  row,
  column,
  onCellUpdate,
  className,
}: TableCellProps<Row>) {
  const onUpdate = (value: string | boolean) => {
    onCellUpdate({ row, columnId: column.id, value });
  };
  return (
    <div className={className} style={getCellWidth(column as Column)}>
      {column.type === "options" && (
        <SelectCell
          data={row[column.id] as string}
          options={(column as OptionsColumn).options}
          onSaveCell={onUpdate}
        />
      )}
      {column.type === "string" && (
        <EditableDataCell
          onSaveCell={onUpdate}
          data={row[column.id] as string}
        />
      )}
      {column.type === "boolean" && (
        <BooleanCell data={row[column.id] as boolean} onSaveCell={onUpdate} />
      )}
      {column.type === "number" && (
        <EditableDataCell
          onSaveCell={onUpdate}
          data={row[column.id] as string}
          type="number"
        />
      )}
    </div>
  );
}
