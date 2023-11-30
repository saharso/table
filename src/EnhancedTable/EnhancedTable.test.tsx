// TableComponent.test.jsx

import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import EnhancedTable from "./EnhancedTable";
import { Column } from "./types";

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
});
