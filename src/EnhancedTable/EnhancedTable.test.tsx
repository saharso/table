// TableComponent.test.jsx

import React, { PropsWithChildren } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EnhancedTable from "./EnhancedTable";
import { Column } from "./types";
import { VirtuosoMockContext } from "react-virtuoso";
import { wait } from "@testing-library/user-event/dist/utils";
function VirtuosoWrapper({ children }: PropsWithChildren) {
  return (
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 300, itemHeight: 100 }}
    >
      {children}
    </VirtuosoMockContext.Provider>
  );
}

describe("TableComponent", () => {
  it("should render table rows with correct data", async () => {
    // Arrange
    const data = [
      { name: "John Doe", age: 25, id: "1" },
      { name: "Jane Doe", age: 30, id: "2" },
    ];
    const columns: Column[] = [
      { id: "name", title: "Name", type: "string" },
      { id: "age", title: "Age", type: "number" },
    ];
    // Act
    render(<EnhancedTable data={data} columns={columns} identifier={"id"} />, {
      wrapper: VirtuosoWrapper,
    });

    // Assert
    await waitFor(() => {
      data.forEach((row) => {
        const rowContainer = screen.getByTestId(`table-row-${row.id}`);
        expect(rowContainer).toBeInTheDocument();
      });
    });
  });

  it("should support grouping", async () => {
    // Arrange
    const data = [
      { name: "John Doe", age: 25, id: "1" },
      { name: "Rubin Granulate", age: 30, id: "2" },
      { name: "Same Name", age: 31, id: "3" },
      { name: "Same Name", age: 31, id: "4" },
    ];
    const columns: Column[] = [
      { id: "name", title: "Name", type: "string" },
      { id: "age", title: "Age", type: "number" },
    ];

    // Act

    render(
      <EnhancedTable
        data={data}
        columns={columns}
        identifier={"id"}
        groupBy={"name"}
      />,
      {
        wrapper: VirtuosoWrapper,
      },
    );

    // Assert
    await waitFor(async () => {
      const rowContainer = screen.getByTestId(`table-group-row-${"Same Name"}`);
      expect(rowContainer).toBeInTheDocument();
    });
  });

  it("should filter the table by search", async () => {
    // Arrange
    const data = [
      { name: "John Doe", age: 25, id: "1" },
      { name: "Jane Doe", age: 30, id: "2" },
    ];
    const columns: Column[] = [
      { id: "name", title: "Name", type: "string" },
      { id: "age", title: "Age", type: "number" },
    ];
    // Act
    render(<EnhancedTable data={data} columns={columns} identifier={"id"} />, {
      wrapper: VirtuosoWrapper,
    });
    const searchInput = screen.getByLabelText("Search");
    fireEvent.change(searchInput, { target: { value: "John Doe" } });

    // Assert
    await waitFor(async () => {
      const idOfIncludedElement = screen.getByTestId(`table-row-${"1"}`);
      expect(idOfIncludedElement).toBeInTheDocument();
    });
    await waitFor(async () => {
      const idOfExcludedElement = screen.queryByText(/Jane Doe/i);
      expect(idOfExcludedElement).toBeNull();
    });
  });

  it("should filter the table by column", async () => {
    // Arrange
    const data = [
      { name: "John Doe", age: 25, id: "1" },
      { name: "Jane Doe", age: 30, id: "2" },
    ];
    const columns: Column[] = [
      { id: "name", title: "Name", type: "string" },
      { id: "age", title: "Age", type: "number" },
    ];
    // Act
    render(<EnhancedTable data={data} columns={columns} identifier={"id"} />, {
      wrapper: VirtuosoWrapper,
    });
    const filterButton = screen.getByTestId("filter-columns");
    fireEvent.click(filterButton);
    screen.getByTestId(`filter-column-name`);
    const filterItem = screen.getByTestId(`filter-column-name`);
    fireEvent.click(filterItem);
    const headerColumns = screen.getAllByTestId(/^table-column-/);

    // Assert
    expect(headerColumns.length).toBe(1);
    expect(headerColumns[0]).toHaveTextContent(/age/i);
  });

  it("should sort the table by column", async () => {
    // Arrange
    const data = [
      { name: "John Doe", age: 25, id: "1" },
      { name: "Jane Doe", age: 30, id: "2" },
    ];
    const columns: Column[] = [
      { id: "name", title: "Name", type: "string", ordinalNo: 50000 },
      { id: "age", title: "Age", type: "number" },
    ];
    // Act
    render(<EnhancedTable data={data} columns={columns} identifier={"id"} />, {
      wrapper: VirtuosoWrapper,
    });
    const headerColumns = screen.getAllByTestId(/^table-column-/);
    // Assert
    expect(headerColumns[headerColumns.length - 1]).toHaveTextContent(/name/i);
  });

  it("should update the table by cell", async () => {
    // Arrange
    const data = [
      { name: "John Doe", age: 25, id: "1" },
      { name: "Jane Doe", age: 30, id: "2" },
    ];
    const columns: Column[] = [
      { id: "name", title: "Name", type: "string" },
      { id: "age", title: "Age", type: "number" },
    ];
    // Act
    render(<EnhancedTable data={data} columns={columns} identifier={"id"} />, {
      wrapper: VirtuosoWrapper,
    });
    let cell = screen.getAllByTestId(/^table-cell-name/)[0];
    fireEvent.click(cell);
    await waitFor(() => {
      screen.getByDisplayValue(/John Doe/i);
    });
    const value = screen.getByDisplayValue(/John Doe/i);
    fireEvent.change(value, { target: { value: "foo" } });
    const approveButton = screen.getAllByTestId(
      /^table-cell-edit-approve-name/,
    )[0];
    fireEvent.click(approveButton);
    // reset the cell definition after value change
    cell = screen.getAllByTestId(/^table-cell-name/)[0];
    // Assert
    expect(cell).toHaveTextContent(/foo/i);
  });
});
