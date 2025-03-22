import React from "react";
import { Table } from "antd";
import "./matrixDisplay.css";

const MatrixDisplay = ({ matrixState }) => {
  // Guard clause: if matrixState is invalid, do nothing
  if (!matrixState || !matrixState._data) {
    console.warn("⚠️ MatrixDisplay received invalid matrixState:", matrixState);
    return null;
  }

  // Same column structure but read-only
  const columns = [
    {
      dataIndex: "label",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "grey", marginRight: "6px" }}>
          {text}
        </span>
      ),
    },
    {
      dataIndex: "real",
      width: "60px",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      dataIndex: "plus",
      render: () => <span style={{ color: "grey", margin: "0 4px" }}>+</span>,
    },
    {
      dataIndex: "imag",
      width: "60px",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      dataIndex: "i",
      render: () => <span style={{ color: "grey", marginLeft: "2px" }}>i</span>,
    },
  ];

  // Rows for C₀ and C₁, read from matrixState
  const data = [
    {
      key: "c0",
      label: "C₀",
      parenLeft: "(",
      real: matrixState._data[0][0].re,
      plus: "+",
      imag: matrixState._data[0][0].im,
      i: "i",
    },
    {
      key: "c1",
      label: "C₁",
      real: matrixState._data[1][0].re,
      plus: "+",
      imag: matrixState._data[1][0].im,
      i: "i",
    },
  ];

  return (
    <div className="matrix-wrapper">
      {/* Left bracket */}
      <div className="matrix-bracket left">
        ⎡
        <br />
        ⎣
      </div>

      {/* Table content (read-only) */}
      <div className="matrix-content">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered={false}
          size="small"
          style={{ width: "170px", textAlign: "center" }}
        />
      </div>

      {/* Right bracket */}
      <div className="matrix-bracket right">
        ⎤
        <br />
        ⎦ 
      </div>
    </div>
  );
};

export default MatrixDisplay;
