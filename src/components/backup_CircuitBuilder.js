import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./CircuitBuilder.css";
import * as math from "mathjs";
import { applyGate } from "../utils/quantumGates"; // Import gate functions

const ItemType = { GATE: "gate" };

// Gate component (draggable)
const Gate = ({ name, buttonsDisabled }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemType.GATE,
    item: { name },
    canDrag: !buttonsDisabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={`gate ${buttonsDisabled ? "disabled" : ""}`}
      style={{
        opacity: buttonsDisabled ? 0.5 : isDragging ? 0.5 : 1,
        cursor: buttonsDisabled ? "not-allowed" : "grab",
      }}
    >
      {name}
    </div>
  );
};

// Circuit line component (droppable)
const CircuitLine = ({ lineIndex, onDrop, gates, onUndo }) => {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemType.GATE,
    drop: (item) => {
      console.log("🔵 Gate dropped:", item.name, "on line", lineIndex);
      onDrop(lineIndex, item.name);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="circuit-line-container">
      <div
        ref={dropRef}
        className="circuit-line"
        style={{ backgroundColor: isOver ? "#d3d3d3" : "transparent" }}
      >
        {gates.map((gate, index) => (
          <div key={index} className="dropped-gate">
            {gate}
          </div>
        ))}
      </div>
      <button
        className="undo-button"
        onClick={() => onUndo(lineIndex)}
        disabled={gates.length === 0}
      >
        Undo
      </button>
    </div>
  );
};

// Main CircuitBuilder component
const CircuitBuilder = ({
  buttonsDisabled,
  initialQuantumState,
  setProbabilities,
}) => {
  const [currentState, setCurrentState] = useState(initialQuantumState);
  const [appliedGates, setAppliedGates] = useState([]);
  const [circuitLines, setCircuitLines] = useState([[]]);

  // Handle dropping a gate
  const handleDrop = (lineIndex, gate) => {
    console.log(`🟢 Applying gate ${gate} on line ${lineIndex}`);

    // Apply the gate operation
    const newState = applyGate(currentState, gate);

    // Update circuit UI
    const newCircuitLines = [...circuitLines];
    newCircuitLines[lineIndex].push(gate);
    setCircuitLines(newCircuitLines);

    // Update state
    setAppliedGates([...appliedGates, gate]);
    setCurrentState(newState);

    console.log("✅ Updated Quantum State:", newState);

    // If it's a measurement gate, update probabilities
    if (gate === "M") {
      updateProbabilities(newState);
    }
  };

  // Handle undo (remove last applied gate)
  const handleUndo = (lineIndex) => {
    console.log(`🟠 Undoing last gate on line ${lineIndex}`);

    if (appliedGates.length === 0) return; // Nothing to undo

    // Remove the last gate
    const updatedGates = appliedGates.slice(0, -1);

    // Recalculate state from initial using remaining gates
    let newState = initialQuantumState;
    updatedGates.forEach((gate) => {
      newState = applyGate(newState, gate);
    });

    // Update circuit UI
    const newCircuitLines = [...circuitLines];
    newCircuitLines[lineIndex].pop();
    setCircuitLines(newCircuitLines);

    // Update state
    setAppliedGates(updatedGates);
    setCurrentState(newState);

    console.log("🔄 Reverted State:", newState);
  };

  // Compute probabilities when measurement is applied
  const updateProbabilities = (state) => {
    const prob0 = math.abs(math.square(state.get([0, 0])));
    const prob1 = math.abs(math.square(state.get([1, 0])));

    console.log("📊 Measurement Applied: Probabilities Updated");
    setProbabilities({ P0: prob0, P1: prob1 });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="circuit-builder-container">
        <div className="gates-grid">
          {["X", "Y", "Z", "H", "S", "T", "P", "M", "I"].map((gate) => (
            <Gate key={gate} name={gate} buttonsDisabled={buttonsDisabled} />
          ))}
        </div>

        <div className="circuit-lines">
          {circuitLines.map((line, index) => (
            <CircuitLine
              key={index}
              lineIndex={index}
              onDrop={(gate) => handleDrop(index, gate)} // ✅ Ensure gate is passed
              gates={line}
              onUndo={handleUndo}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default CircuitBuilder;
