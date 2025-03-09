import React from "react";
import "./GatesGrid.css"; // Styling for gates
import { applyGate } from "../utils/quantumGates"; // Import function to apply gates

const GatesGrid = ({
  buttonsDisabled,
  initialQuantumState,
  onMatrixUpdate,
  onUndo, // ✅ Added missing prop
  appliedGates, // ✅ Fixed Issue 2
}) => {
  const gateNames = ["X", "Y", "Z", "Undo", "I", "M"];

  const handleGateClick = (gate) => {
    if (buttonsDisabled) return; // Prevent clicking if gates are disabled

    if (gate === "Undo") {
      console.log("🟡 Undo button clicked!");
      onUndo(); // Call the undo function from App.js
      return;
    }
    console.log(`🟢 Gate ${gate} clicked in GatesGrid`);

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
          className={`gate-button ${
            (gate === "Undo" && appliedGates.length === 0) || buttonsDisabled
              ? "disabled"
              : ""
          }`}
          onClick={() => handleGateClick(gate)}
          disabled={
            gate === "Undo" ? appliedGates.length === 0 : buttonsDisabled
          }
        >
          {gate}
        </button>
      ))}
    </div>
  );
};

export default GatesGrid;
