import React from "react";
import "./CircuitLine.css"; // Circuit line styling

const CircuitLine = ({ appliedGates, onUndo }) => {
  return (
    <div className="circuit-line-container">
      <div className="circuit-line">
        {appliedGates.map((gate, index) => (
          <div key={index} className="dropped-gate">
            {gate}
          </div>
        ))}
      </div>
      <button
        className="undo-button"
        onClick={onUndo}
        disabled={appliedGates.length === 0}
      >
        Undohm
      </button>
    </div>
  );
};

export default CircuitLine;
