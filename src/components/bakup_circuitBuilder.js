import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./CircuitBuilder.css";
import axios from "axios"; // Make sure this is imported

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
    drop: (item) => onDrop(lineIndex, item.name),
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
  setAppliedGates,
  c1,
  c2,
  shots,
  setProbabilities,
}) => {
  console.log("Circuit builder component called?");
  console.log("c1:", c1, "c2:", c2, "shots:", shots);
  const [circuitLines, setCircuitLines] = useState([[]]);
  const [appliedGates, setAppliedGatesLocal] = useState([]); // Local gate storage

  // Send applied gates to backend
  const updateBackendGates = (c1, c2, shots, updatedGates) => {
    console.log("🟡 CircuitBuilder.js: updateBackendGates called");
    console.log("c1:", c1);
    console.log("c2:", c2);
    console.log("shots:", shots);
    console.log("Gates list:", updatedGates);

    if (!c1 || !c2 || !shots) {
      console.error("❌ ERROR: c1, c2, or shots is undefined!");
      return;
    }

    const data = {
      a: parseFloat(c1.a),
      b: parseFloat(c1.b),
      c: parseFloat(c2.c),
      d: parseFloat(c2.d),
      s: parseInt(shots, 10),
      gates: updatedGates,
    };

    console.log("📡 Sending data to backend:", data);

    axios
      .post("http://localhost:8080/data", data)
      .then((response) => {
        console.log(
          "✅ Backend updated with new probabilities:",
          response.data
        );
        setProbabilities(response.data); // ✅ Update probability graph
      })
      .catch((err) => console.error("❌ Error updating gates:", err));
  };

  // Handle dropping a gate onto a circuit line
  const handleDrop = (lineIndex, gate, c1, c2, shots) => {
    console.log("🟢 Gate dropped:", gate, "on line:", lineIndex);
    console.log("🔍 Using c1:", c1, "c2:", c2, "shots:", shots);

    const newCircuitLines = [...circuitLines];
    newCircuitLines[lineIndex].push(gate);
    setCircuitLines(newCircuitLines);

    const newGates = [...appliedGates, gate];
    setAppliedGatesLocal(newGates);
    if (setAppliedGates) setAppliedGates(newGates);

    console.log("🔵 Updated gates list:", newGates);

    // ✅ Call backend to recalculate probabilities
    updateBackendGates(c1, c2, shots, newGates);
  };

  const handleUndo = (lineIndex, c1, c2, shots) => {
    console.log("🟠 Undo button clicked on line:", lineIndex);

    if (buttonsDisabled) return;

    const newCircuitLines = [...circuitLines];
    newCircuitLines[lineIndex].pop(); // Remove the last gate
    setCircuitLines(newCircuitLines);

    const updatedGates = appliedGates.slice(0, -1);
    setAppliedGatesLocal(updatedGates);
    if (setAppliedGates) setAppliedGates(updatedGates);

    console.log("🟠 Gate removed, updated gates list:", updatedGates);

    // ✅ Call backend again to recalculate probabilities
    updateBackendGates(c1, c2, shots, updatedGates);
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
              onDrop={(lineIndex, gate) =>
                handleDrop(lineIndex, gate, c1, c2, shots)
              }
              gates={line}
              onUndo={(lineIndex) => handleUndo(lineIndex, c1, c2, shots)}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default CircuitBuilder;
