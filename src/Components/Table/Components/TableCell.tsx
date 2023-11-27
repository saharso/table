import {
  CellEditPayload,
  Column,
  OptionsColumn,
  RowUpdatePayload,
} from "../types";
import { v4 as uuId } from "uuid";
import { useState } from "react";
import { getCellWidth } from "../utils";
import styles from "../Table.module.scss";

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
  onEdit,
  editable,
  cellId,
}: {
  data: string;
  onSaveCell: (value: string) => void;
  type?: "string" | "number";
  onEdit: (editMode: boolean) => void;
  editable: CellEditPayload;
  cellId: CellEditPayload;
}) {
  const [value, setValue] = useState(data);
  const isEditable =
    editable &&
    Object.values(editable).join("") === Object.values(cellId).join("");

  return (
    <div data-test={"editable-string-cell"}>
      {!isEditable && (
        <div
          onClick={() => {
            onEdit(true);
          }}
        >
          {data}
        </div>
      )}
      {isEditable && (
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
              onEdit(false);
            }}
          >
            cancel
          </button>
          <button
            onClick={() => {
              onSaveCell(value);
              onEdit(false);
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
  index?: number;
  onEdit: ({ columnId, index }: CellEditPayload) => void;
  editable: CellEditPayload;
}

export default function TableCell<Row = unknown>({
  row,
  column,
  onCellUpdate,
  index,
  onEdit,
  editable,
}: TableCellProps<Row>) {
  const onUpdate = (value: string | boolean) => {
    onCellUpdate({ row, columnId: column.id, value });
  };
  const onCellEdit = (editMode: boolean) => {
    if (editMode) {
      onEdit({ columnId: column.id as string, index: index });
    } else {
      onEdit(null);
    }
  };
  return (
    <div className={styles.TableCell} style={getCellWidth(column as Column)}>
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
          onEdit={onCellEdit}
          editable={editable}
          cellId={{ columnId: column.id as string, index: index }}
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
          onEdit={onCellEdit}
          editable={editable}
          cellId={{ columnId: column.id as string, index: index }}
        />
      )}
    </div>
  );
}
