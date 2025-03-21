import React from "react";
import "./CircuitLine.css"; // Styling
import MatrixDisplay from "./matrixDisplay";
import QuantumMatrix from "./quantummatrix"; // Import QuantumMatrix

const CircuitLine = ({ appliedGates, matrixStates, onUndo, c1, c2, handleInputChange, handleValidateInput }) => {
  // console.log("Circuit Line Props:", appliedGates, matrixStates);
  return (
    <div className="circuit-line-container">
      {/* Left Side: Qubit Label + Input Quantum Matrix */}
      <div className="qubit-matrix-container">
        <span className="qubit-label">|q₀⟩</span>
        <QuantumMatrix c1={c1} c2={c2} handleInputChange={handleInputChange} />

        <div className="validate-button-container">
          <button className="validate-button" onClick={handleValidateInput}>
            ✔
          </button>
        </div>
      </div>

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
      <div className="undo-button-container">
        <button
          className="undo-button"
          onClick={onUndo}
          disabled={appliedGates.length === 0}
        >
          Undo
        </button>
      </div>
    </div>
  );
};

export default CircuitLine;
