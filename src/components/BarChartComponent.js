// src/components/BarChartComponent.js

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const sampleData = [
  { name: "Qubit A", value: 30 },
  { name: "Qubit B", value: 50 },
  { name: "Qubit C", value: 80 },
];

const BarChartComponent = ({ data, title }) => {
  // Ensure default values (prevent disappearance)
  const probabilities = data || { P0: 0, P1: 0 };
  return (
    <div style={{ width: "80%", padding: "5px" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart
          data={[
            { name: "|0⟩", value: probabilities.P0 },
            { name: "|1⟩", value: probabilities.P1 },
          ]}
          margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0589E9" barSize={60} barGap={1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
