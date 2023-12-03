import {
  CellEditPayload,
  Column,
  OptionsColumn,
  Pojo,
  RowUpdatePayload,
  SelectOption,
} from "../../../types";
import { v4 as uuId } from "uuid";
import { useCallback, useState } from "react";
import { getCellWidth, parsePrimitive } from "../utils";
import styles from "../Table.module.scss";
import {
  Checkbox,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import classNames from "classnames";
const rowHeight = 50;

function SelectCell({
  options,
  data = "",
  onSaveCell,
}: {
  data: string;
  options: SelectOption[];
  onSaveCell: (value: string) => void;
}) {
  const selected = options.find(({ value }) => value === data);
  return (
    <div className={styles.SelectCell}>
      <div
        className={styles.Color}
        style={{ backgroundColor: selected.color }}
      ></div>
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
          <MenuItem
            key={uuId()}
            value={option.value}
            className={styles.OptionLabel}
          >
            <div
              className={styles.Color}
              style={{ backgroundColor: option.color }}
            ></div>
            <span>{option.label}</span>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
function EditableDataCell({
  data,
  onSaveCell,
  type = "string",
  onEdit,
  editable,
  cellId,
  column,
}: {
  data: string;
  onSaveCell: (value: string) => void;
  type?: "string" | "number";
  onEdit: (editMode: boolean) => void;
  editable: CellEditPayload;
  cellId: CellEditPayload;
  column: Column;
}) {
  const [value, setValue] = useState(data);
  const isEditable =
    editable &&
    Object.values(editable).join("") === Object.values(cellId).join("");

  return (
    <div>
      {!isEditable && (
        <div
          data-testid={`table-cell-${Object.values(cellId).join(".")}`}
          className={classNames(styles.DataCell, styles[column.overflow])}
          onClick={() => {
            onEdit(true);
          }}
        >
          {parsePrimitive(data)}
        </div>
      )}
      {isEditable && (
        <div className={styles.EditableCell}>
          <div className={styles.EditableCellInput}>
            <TextField
              data-testid={`table-cell-edit-input-${Object.values(cellId).join(
                ".",
              )}`}
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
            data-testid={`table-cell-edit-approve-${Object.values(cellId).join(
              ".",
            )}`}
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
      <Checkbox
        sx={{ borderRadius: 5000 }}
        checked={data}
        onChange={(e) => onSaveCell(e.target.checked)}
      />
    </div>
  );
}
interface TableCellProps<Row = Pojo> {
  row: Row;
  column: Column<Row>;
  onCellUpdate: ({ row, columnId, value }: RowUpdatePayload<Row>) => void;
  rowId: string;
  onEdit: ({ columnId, rowId }: CellEditPayload) => void;
  editable: CellEditPayload;
  groupedColumn: Column<Row>;
}

export default function TableCell<Row = Pojo>({
  row,
  column,
  onCellUpdate,
  rowId,
  onEdit,
  editable,
  groupedColumn,
}: TableCellProps<Row>) {
  const onUpdate = useCallback(
    (value: string | boolean | number) => {
      onCellUpdate({ row, columnId: column.id as string, value });
    },
    [onCellUpdate, column, row],
  );
  const onCellEdit = (editMode: boolean) => {
    if (editMode) {
      onEdit({ columnId: column.id as string, rowId });
    } else {
      onEdit(null);
    }
  };

  return (
    <div
      className={styles.TableCell}
      style={getCellWidth(column as Column)}
      role={"cell"}
    >
      {column.id === groupedColumn?.id ? (
        <div />
      ) : (
        <>
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
              cellId={{ columnId: column.id as string, rowId }}
              column={column as Column}
            />
          )}
          {column.type === "boolean" && (
            <BooleanCell
              data={row[column.id] as boolean}
              onSaveCell={(value) => {
                onUpdate(value);
              }}
            />
          )}
          {column.type === "number" && (
            <EditableDataCell
              onSaveCell={onUpdate}
              data={row[column.id] as string}
              type="number"
              onEdit={onCellEdit}
              editable={editable}
              cellId={{ columnId: column.id as string, rowId }}
              column={column as Column}
            />
          )}
        </>
      )}
    </div>
  );
}
