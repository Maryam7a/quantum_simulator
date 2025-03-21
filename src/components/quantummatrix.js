import React from "react";
import { Table, Input } from "antd";
import "./quantummatrix.css";

const QuantumMatrix = ({ c1, c2, handleInputChange }) => {
  // Columns for the input matrix
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
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, record.key, "real")}
          placeholder="0.0"
          style={{
            width: "30px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid grey",
            color: "white",
            textAlign: "center",
            margin: 0,
            padding: "4px",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      dataIndex: "plus",
      render: () => <span style={{ color: "grey", margin: "0 4px" }}>+</span>,
    },
    {
      dataIndex: "imag",
      width: "60px",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(e, record.key, "imag")}
          placeholder="0.0"
          style={{
            width: "30px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid grey",
            color: "white",
            textAlign: "center",
            margin: 0,
            padding: "4px",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      dataIndex: "i",
      render: () => <span style={{ color: "grey", marginLeft: "3px" }}>i</span>,
    },
  ];

  // Two rows: C₀ and C₁
  const data = [
    {
      key: "c0",
      label: "C₀",
      real: c1.a,
      plus: "+",
      imag: c1.b,
      i: "i",
    },
    {
      key: "c1",
      label: "C₁",
      real: c2.c,
      plus: "+",
      imag: c2.d,
      i: "i",
    },
  ];

  return (
    <div className="matrix-wrapper">
      {/* Left bracket */}
      <div className="matrix-bracket left">
        
        ⎡
        <br />
        <br />
        ⎣
      </div>

      {/* Table for the input fields */}
      <div className="matrix-content">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered={false}
          size="small"
          style={{ width: "180px", textAlign: "center" }}
        />
      </div>

      {/* Right bracket */}
      <div className="matrix-bracket right">
        ⎤
        <br />
        <br />
        ⎦
      </div>
    </div>
  );
};

export default QuantumMatrix;
