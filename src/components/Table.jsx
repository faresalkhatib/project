// src/components/Table.js
import React from "react";
import { Table as SemanticTable } from "semantic-ui-react";
import { COLORS, SPACING } from "../utils/designConstants";

const Table = ({ columns, data, actions }) => {
  const tableStyle = {
    direction: "rtl",
    fontSize: "14px",
  };

  const headerStyle = {
    backgroundColor: COLORS.primaryRed,
    color: COLORS.textWhite,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: "15px",
    padding: SPACING.md,
  };

  const cellStyle = {
    textAlign: "right",
    padding: SPACING.md,
  };

  const responsiveWrapperStyle = {
    overflowX: "auto",
    width: "100%",
  };

  return (
    <div style={responsiveWrapperStyle}>
      <SemanticTable celled striped selectable style={tableStyle}>
        <SemanticTable.Header>
          <SemanticTable.Row>
            {columns.map((col, index) => (
              <SemanticTable.HeaderCell key={index} style={headerStyle}>
                {col.header}
              </SemanticTable.HeaderCell>
            ))}
            {actions && (
              <SemanticTable.HeaderCell
                style={{ ...headerStyle, textAlign: "center" }}
              >
                الإجراءات
              </SemanticTable.HeaderCell>
            )}
          </SemanticTable.Row>
        </SemanticTable.Header>

        <SemanticTable.Body>
          {data.map((row, rowIndex) => (
            <SemanticTable.Row
              key={rowIndex}
              style={{ transition: "all 0.2s" }}
            >
              {columns.map((col, colIndex) => (
                <SemanticTable.Cell key={colIndex} style={cellStyle}>
                  {col.render ? col.render(row) : row[col.accessor] || "-"}
                </SemanticTable.Cell>
              ))}
              {actions && (
                <SemanticTable.Cell
                  style={{ ...cellStyle, textAlign: "center" }}
                >
                  {actions(row)}
                </SemanticTable.Cell>
              )}
            </SemanticTable.Row>
          ))}
        </SemanticTable.Body>
      </SemanticTable>
    </div>
  );
};

export default Table;
