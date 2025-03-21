import React, { useState } from "react";
import BarChartComponent from "./components/BarChartComponent";
import "./App.css";
import BlochSphere from "./components/BlochSphere";
import { createInitialQuantumState, measureQuantumState } from "./utils/quantumGates";
import GatesGrid from "./components/GatesGrid";
import CircuitLine from "./components/CircuitLine";
import { convertInputToVector } from "./utils/convertInputToVector";
import nustLogo from "./images/Nust-logo.jpg";

function App() {
  const [c1, setC1] = useState({ a: "", b: "" });
  const [c2, setC2] = useState({ c: "", d: "" });
  const [shots, setShots] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [initialQuantumState, setInitialQuantumState] = useState(null);
  const [appliedGates, setAppliedGates] = useState([]);
  const [matrixStates, setMatrixStates] = useState([]);
  const [vectorStates, setVectorStates] = useState([]);
  const [isGateApplied, setIsGateApplied] = useState(false);
  const [probabilityData, setProbabilityData] = useState({ P0: 0, P1: 0 });

  // Handle input changes
  const handleInputChange = (e, key, field) => {
    const value = e.target.value;
    if (key === "c0") {
      setC1({ ...c1, [field === "real" ? "a" : "b"]: value });
    } else if (key === "c1") {
      setC2({ ...c2, [field === "real" ? "c" : "d"]: value });
    }
  };

  const handleMeasurement = () => {
    if (!matrixStates.length) {
      console.error("❌ No quantum state to measure.");
      return;
    }
    const latestState = matrixStates[matrixStates.length - 1];
    const { measuredState, probabilities } = measureQuantumState(latestState);

    console.log("🎯 Measurement Result:", measuredState);
    console.log("📊 Updating Probability Graph:", probabilities);
    setProbabilityData(probabilities);

    // Update Bloch vector based on measurement outcome
    const measuredVector =
      measuredState === "|0⟩"
        ? { x: 0, y: 0, z: 1 }
        : { x: 0, y: 0, z: -1 };
    setVectorStates([...vectorStates, measuredVector]);

    // Note: No gate disabling during measurement ("M")
  };

  const handleShotsChange = (e) => {
    setShots(e.target.value);
  };

  // Validate input and enable/disable gates
  const handleValidateInput = () => {
    const a = parseFloat(c1.a);
    const b = parseFloat(c1.b);
    const c = parseFloat(c2.c);
    const d = parseFloat(c2.d);

    // Compute |C0|² + |C1|²
    const magnitudeC0Squared = a * a + b * b;
    const magnitudeC1Squared = c * c + d * d;
    const sum = magnitudeC0Squared + magnitudeC1Squared;

    const tolerance = 0.01;
    if (Math.abs(sum - 1.0) <= tolerance) {
      setButtonsDisabled(false);
      console.log("✅ Input is valid. Gates enabled. Sum:", sum);
      const initialVector = convertInputToVector(a, b, c, d);
      console.log("🔵 Initial Vector for Bloch Sphere:", initialVector);
      setVectorStates([initialVector]);

      const initialState = createInitialQuantumState(a, b, c, d);
      console.log("Initial Quantum State:", initialState);
      setInitialQuantumState(initialState);
      setMatrixStates([initialState]);
    } else {
      setButtonsDisabled(true);
      console.log("❌ Invalid input. Gates disabled. Sum:", sum);
      setVectorStates([]);
    }
  };

  // Update matrix and vector state when a gate is applied
  const handleMatrixUpdate = (newMatrix, gate) => {
    console.log("🔵 Updated Quantum Matrix received in App.js:", newMatrix);
    console.log("🟢 Gate received in App.js:", gate);
    setMatrixStates((prevStates) => {
      const updatedStates = [...prevStates, newMatrix];
      console.log("✅ Updated Matrix States List:", updatedStates);
      return updatedStates;
    });
    setAppliedGates((prevGates) => [...prevGates, gate]);

    // For non-identity gates, trigger transformation animation.
    if (gate !== "I") {
      console.log("🔵 Gate Applied. Triggering Animation.");
      setIsGateApplied(true);
    }
  };

  // Undo handler: after undo, enable gates (set isGateApplied to false)
  const handleUndo = () => {
    if (appliedGates.length === 0) {
      console.warn("⚠️ No gate to undo.");
      return;
    }
    console.log("🔄 Undoing last gate:", appliedGates[appliedGates.length - 1]);
    setAppliedGates((prevGates) => prevGates.slice(0, -1));
    setMatrixStates((prevMatrices) => {
      if (prevMatrices.length > 1) {
        return prevMatrices.slice(0, -1);
      }
      return prevMatrices;
    });
    setVectorStates((prevVectors) => {
      if (prevVectors.length > 1) {
        return prevVectors.slice(0, -1);
      }
      return prevVectors;
    });
    console.log("🚀 Final State After Undo:");
    console.log("  - Applied Gates:", appliedGates);
    console.log("  - Matrix States:", matrixStates);
    console.log("  - Bloch Sphere Vectors:", vectorStates);
    // Enable gates after undo.
    setIsGateApplied(false);
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src={nustLogo} alt="NUST Logo" className="nust-logo" />
        <h1 className="project-title">Quantum Circuit Simulator</h1>
      </div>
      <div className="content-container">
        <CircuitLine
          appliedGates={appliedGates}
          matrixStates={matrixStates}
          onUndo={handleUndo}
          c1={c1}
          c2={c2}
          handleInputChange={handleInputChange}
          handleValidateInput={handleValidateInput}
        />
        <div className="bottom-section">
          <div className="gates-grid-container">
            <GatesGrid
              buttonsDisabled={buttonsDisabled || isGateApplied}
              initialQuantumState={matrixStates[matrixStates.length - 1]}
              onMatrixUpdate={handleMatrixUpdate}
              onUndo={handleUndo}
              appliedGates={appliedGates}
              onMeasure={handleMeasurement}
            />
          </div>
          <div className="bloch-container">
            <BlochSphere
              appliedGates={appliedGates}
              blochVector={vectorStates[vectorStates.length - 1]}
              prevBlochVector={vectorStates[vectorStates.length - 2]}
              isGateApplied={isGateApplied}
              setIsGateApplied={setIsGateApplied}
            />
          </div>
          <div className="bar-chart-container">
            <BarChartComponent
              title="Probability Distribution"
              data={probabilityData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
