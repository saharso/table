import {
  Button,
  Checkbox,
  ClickAwayListener,
  Fade,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import styles from "./ToolBar.module.scss";
import { debounce } from "lodash";
import { Column, Pojo } from "../../types";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
interface ColumnFilterDropDownProps<Row = Pojo> {
  columns: Column<Row>[];
  selectedColumns: Set<string>;
  onFilterColumnChange: (columnId: string) => void;
}
function ColumnFilterDropDown<Row = Pojo>({
  columns,
  selectedColumns,
  onFilterColumnChange,
}: ColumnFilterDropDownProps<Row>) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [open, setOpen] = React.useState(false);

  const handleClick = () => (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button onClick={handleClick()}>
        <FilterAltIcon />
        Filter Columns
      </Button>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={"bottom-end"}
        transition
        sx={{
          zIndex: 1500,
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                >
                  {columns.map((column) => {
                    return (
                      <ListItem key={column.id as string} sx={{ padding: 0 }}>
                        <ListItemButton
                          role={undefined}
                          onClick={(value) => {
                            onFilterColumnChange(column.id as string);
                          }}
                          dense
                        >
                          <Checkbox
                            edge="start"
                            checked={selectedColumns.has(column.id as string)}
                            tabIndex={-1}
                            disableRipple
                          />
                          {column.title}
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </div>
  );
}
interface ToolBarProps<Row = Pojo> {
  onSearch: (value: string) => void;
  columns: Column<Row>[];
  selectedColumns: Set<string>;
  onFilterColumnChange: (columnId: string) => void;
  groupBy?: keyof Row;
}

export default function ToolBar<Row = Pojo>({
  onSearch,
  columns,
  selectedColumns,
  onFilterColumnChange,
  groupBy,
}: ToolBarProps<Row>) {
  const [displayValue, setDisplayValue] = React.useState<string>("");
  const debouncedInputChange = debounce((value: string) => {
    onSearch(value);
  }, 100);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedInputChange(e.target.value);
    setDisplayValue(e.target.value);
  };
  const nonGroupedColumns = columns.filter(({ id }) => id !== groupBy);
  return (
    <div className={styles.ToolBar}>
      <div className={"layout-align-y gap-2"}>
        <ColumnFilterDropDown<Row>
          columns={nonGroupedColumns}
          selectedColumns={selectedColumns}
          onFilterColumnChange={onFilterColumnChange}
        />
        <label htmlFor={"search"}>Search</label>
        <TextField
          id={"search"}
          size={"small"}
          type={"search"}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
          value={displayValue}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
