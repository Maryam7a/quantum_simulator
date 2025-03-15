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

const BarChartComponent = ({ data, title }) => {
  // Ensure default values (prevent disappearance)
  const probabilities = data ? data : { P0: 0, P1: 0 };
  return (
    <div style={{ width: "80%", padding: "5px" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer width="80%" height={500}>
        <BarChart
          data={[
            { name: "|0⟩", value: probabilities.P0 },
            { name: "|1⟩", value: probabilities.P1 },
          ]}
          margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis/>
          <Tooltip />
          {/* <Legend /> */}
          <Bar dataKey="value" fill="#ccd" barSize={60} barGap={1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
