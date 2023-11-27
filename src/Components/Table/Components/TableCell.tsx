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
import { IconButton, MenuItem, Select, Switch, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
const rowHeight = 50;

function SelectCell({
  options,
  data = "",
  onSaveCell,
}: {
  data: string;
  options: string[];
  onSaveCell: (value: string) => void;
}) {
  return (
    <Select
      sx={{
        width: "100%",
        height: rowHeight,
        borderRadius: 0,
        border: 0,
        "& .MuiOutlinedInput-notchedOutline": {
          border: 0,
        },
      }}
      value={data}
      placeholder="Select"
      onChange={(e) => {
        onSaveCell(e.target.value);
      }}
    >
      {options.map((option) => (
        <MenuItem key={uuId()} value={option}>
          {option}
        </MenuItem>
      ))}
    </Select>
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
        <div className={styles.EditableCell}>
          <div className={styles.EditableCellInput}>
            <TextField
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-notchedOutline": {},
              }}
              size="small"
              type={type}
              defaultValue={data}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  onSaveCell(value);
                  onEdit(false);
                }
                if (e.key === "Escape") {
                  onEdit(false);
                }
              }}
            />
          </div>
          <IconButton
            size={"small"}
            araia-label="save"
            onClick={() => {
              onEdit(false);
              onSaveCell(value);
            }}
          >
            <CheckIcon fontSize={"small"} color={"action"} />
          </IconButton>
          <IconButton
            size={"small"}
            onClick={() => {
              onEdit(false);
            }}
          >
            <DoNotDisturbAltIcon fontSize={"small"} />
          </IconButton>
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
      <Switch checked={data} onChange={(e) => onSaveCell(e.target.checked)} />
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
