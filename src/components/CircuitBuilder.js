import React, { useState } from "react";
import "./CircuitBuilder.css"; // Styles for circuit only
import GatesGrid from "./GatesGrid"; // Import the separate gates component
import CircuitLine from "./CircuitLine"; // Import the separate circuit line component

const CircuitBuilder = ({ buttonsDisabled }) => {
  const [appliedGates, setAppliedGates] = useState([]); // Stores applied gates

  // Function to handle gate clicks and apply them to the circuit line
  const handleGateClick = (gate) => {
    if (buttonsDisabled) return; // Ignore clicks if disabled
    console.log(`🟢 Applying gate: ${gate}`);
    setAppliedGates([...appliedGates, gate]); // Add gate to the circuit line
  };

  // Function to handle undo (remove last applied gate)
  const handleUndo = () => {
    console.log("🟠 Undoing last applied gate");
    if (appliedGates.length === 0) return;
    setAppliedGates(appliedGates.slice(0, -1)); // Remove the last gate
  };

  return (
    <div className="circuit-builder-container">
      {/* Circuit Line - Displays applied gates */}
      <CircuitLine appliedGates={appliedGates} onUndo={handleUndo} />

      {/* Gates Grid - Allows clicking gates */}
      {/* <GatesGrid
        buttonsDisabled={buttonsDisabled}
        onGateClick={handleGateClick}
      /> */}
    </div>
  );
};

export default CircuitBuilder;
