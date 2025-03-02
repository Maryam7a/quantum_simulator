import React from "react";
import { Table } from "antd";
import "./quantummatrix.css"; // Reuse same styles for consistency

const MatrixDisplay = ({ matrixState }) => {
  // console.log("🔵 Received Matrix State in MatrixDisplay:", matrixState);
  // console.log("whyyyyyyy");
  // console.log("ajeeb, matrixState[0][0].re", matrixState._data[0][0].re);
  // console.log("ajeeb, matrixState[0][0].im", matrixState._data[0][0].im);

    // console.log(
    //   "wth, matrixState._data[1][0].re",
    //   matrixState._data[1][0].re
    // );
  // Ensure matrixState is valid before rendering
  if (!matrixState || !matrixState._data) {
    console.warn(
      "⚠️ MatrixDisplay received an invalid matrixState!",
      matrixState
    );
    return null; // Prevent rendering if data is invalid
  }

  const columns = [
    {
      dataIndex: "label",
      render: (text) => <span style={{ color: "grey" }}>{text}</span>,
    },
    {
      dataIndex: "real",
      width: "60px",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    {
      dataIndex: "plus",
      render: () => <span style={{ color: "grey" }}>+</span>,
    },
    {
      dataIndex: "imag",
      width: "60px",
      render: (text) => <span style={{ color: "white" }}>{text}</span>,
    },
    { dataIndex: "i", render: () => <span style={{ color: "grey" }}>i</span> },
  ];

  const data = [
    {
      key: "c0",
      label: "C₀",
      real: matrixState._data[0][0].re,
      imag: matrixState._data[0][0].im,
    },
    {
      key: "c1",
      label: "C₁",
      real: matrixState._data[1][0].re,
      imag: matrixState._data[1][0].im,
    },
  ];

  return (
    <div className="matrix-wrapper">
      <div className="matrix-bracket left">
        ⎡<br />⎣
      </div>
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
      <div className="matrix-bracket right">
        ⎤<br />⎦
      </div>
    </div>
  );
};

export default MatrixDisplay;
