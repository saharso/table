import EnhancedTable from "./EnhancedTable/EnhancedTable";
import React from "react";
import mock1columns from "./const/mock1columns";
import Mock1Model from "./type/Mock1Model";
import mock1 from "./mocks/mock1.json";

export default function App() {
  return (
    <div className="App">
      <EnhancedTable<Mock1Model>
        columns={mock1columns}
        data={mock1 as Mock1Model[]}
        identifier={"id"}
        groupBy={"firstName"}
      />
    </div>
  );
}
