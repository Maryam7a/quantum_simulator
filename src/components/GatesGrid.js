import React from "react";
import "./GatesGrid.css"; // Styling for gates
import { applyGate } from "../utils/quantumGates"; // Import function to apply gates

const GatesGrid = ({
  buttonsDisabled,
  initialQuantumState,
  onMatrixUpdate,
}) => {
  const gateNames = ["X", "Y", "Z", "H", "I", "M"];

  const handleGateClick = (gate) => {
    console.log("handle Gate click in gatesgrid.js");
    console.log("what does it receive from app.js ", initialQuantumState);
    if (buttonsDisabled) return; // Prevent clicking if gates are disabled
    console.log(`🟢 Gate ${gate} clicked in GatesGrid`);
    console.log("what does it send to applyGate lol ", initialQuantumState);

    // Apply the matrix transformation
    const newMatrix = applyGate(initialQuantumState, gate);
    console.log(`🔵 Transformed Quantum Matrix after ${gate}:`, newMatrix);

    // Send transformed matrix & gate name back to App.js
    onMatrixUpdate(newMatrix, gate);
  };

  return (
    <div className="gates-grid">
      {gateNames.map((gate) => (
        <button
          key={gate}
          className={`gate-button ${buttonsDisabled ? "disabled" : ""}`}
          onClick={() => handleGateClick(gate)}
          disabled={buttonsDisabled}
        >
          {gate}
        </button>
      ))}
    </div>
  );
};

export default GatesGrid;
