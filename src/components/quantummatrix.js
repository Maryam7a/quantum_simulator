import React from "react";
import { Table, Input } from "antd";
import "./quantummatrix.css";


const QuantumMatrix = ({ c1, c2, handleInputChange }) => {
  const columns = [
    {
      dataIndex: "label",
      render: (text) => (
        <span style={{ fontWeight: "normal", color: "grey" }}>{text}</span>
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
            width: "50px",
            background: "transparent", // Make the field transparent
            border: "none", // Remove border
            color: "white", // Change text color to white
            textAlign: "center",
            margin: 0 /* Reduce left & right margin */,
            padding: 0 /* Reduce input field height */,
          }}
        />
      ),
    },
    {
      dataIndex: "plus",
      render: () => <span style={{ color: "grey", width: "0px" }}>+</span>, // Apply color here
      // width: 10, // Keep the width small
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
            width: "50px",
            background: "transparent", // Make the field transparent
            border: "grey", // Remove border
            color: "white", // Change text color to white
            textAlign: "center",
            margin: 0, // Remove margin
            padding: 0, // Remove padding
          }}
        />
      ),
    },
    {
      dataIndex: "i",
      render: () => <span style={{ color: "grey" }}>i</span>, // Apply color here
      width: 0,
    },
  ];

  const data = [
    { key: "c0", label: "C₀", real: c1.a, imag: c1.b },
    { key: "c1", label: "C₁", real: c2.c, imag: c2.d },
  ];

  return (
    <div className="matrix-wrapper">
      {/* Left Bracket */}
      <div className="matrix-bracket left">
        ⎡<br />⎣
      </div>

      {/* Table Content */}
      <div className="matrix-content">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered={false}
          size="small"
          style={{ width: "110px", textAlign: "center" }}
        />
      </div>

      {/* Right Bracket */}
      <div className="matrix-bracket right">
        ⎤<br />⎦
      </div>
    </div>
  );

};

export default QuantumMatrix;
