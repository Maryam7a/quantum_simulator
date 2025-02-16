import React from "react";
import "./CircuitLine.css"; // Styling
import MatrixDisplay from "./matrixDisplay";

const CircuitLine = ({ appliedGates, matrixStates, onUndo }) => {
  console.log("Circuit Line Props:", appliedGates, matrixStates);
  return (
    <div className="circuit-line-container">
      {/* Qubit Label */}
      <span className="qubit-label">|q₀⟩</span>

      <div className="circuit-line">
        {appliedGates.map((gate, index) => (
          <div key={index} className="gate-matrix-container">
            {/* Gate Label */}
            <div className="dropped-gate">{gate}</div>
            <div className="transparent-container" />
            {/* Corresponding Matrix Display */}
            <MatrixDisplay matrixState={matrixStates[index + 1]} />
          </div>
        ))}
      </div>

      {/* Undo Button */}
      <button className="undo-button" onClick={onUndo} disabled={appliedGates.length === 0}>
        Undo
      </button>
    </div>
  );
};

export default CircuitLine;
