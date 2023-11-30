// TableComponent.test.jsx

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import EnhancedTable from "./EnhancedTable";
import { Column } from "./types";
import { VirtuosoMockContext } from "react-virtuoso";
import { wait } from "@testing-library/user-event/dist/utils";

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
    render(<EnhancedTable data={data} columns={columns} identifier={"id"} />);

    // Assert
    await waitFor(() => {
      data.forEach(async (row) => {
        const rowContainer = await screen.findByTestId(`table-row-${row.id}`);
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
    );

    // Assert
    await waitFor(() => {
      (async () => {
        const rowContainer = await screen.findByTestId(
          `table-group-row-${"Same Name"}`,
        );
        expect(rowContainer).toBeInTheDocument();
      })();
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
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 300, itemHeight: 100 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

    // Assert
    const searchInput = screen.getByLabelText("Search");
    fireEvent.change(searchInput, { target: { value: "John Doe" } });
    await wait(200);
    const idOfIncludedElement = screen.getByTestId(`table-row-${"1"}`);
    const idOfExcludedElement = screen.getByTestId(`table-row-${"2"}`);

    expect(idOfIncludedElement).toBeInTheDocument();
    expect(idOfExcludedElement).not.toBeInTheDocument();
  });
});
