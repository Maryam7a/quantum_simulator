import React, { useState } from "react";
import BarChartComponent from "./components/BarChartComponent";
import "./App.css";
import BlochSphere from "./components/BlochSphere";
import QuantumMatrix from "./components/quantummatrix";
import { createInitialQuantumState } from "./utils/quantumGates"; // Import function to generate state
import { Button } from "antd";
import GatesGrid from "./components/GatesGrid";
import CircuitLine from "./components/CircuitLine"; // Import the separate circuit line component

function App() {
  const [c1, setC1] = useState({ a: "", b: "" });
  const [c2, setC2] = useState({ c: "", d: "" });
  const [shots, setShots] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [initialQuantumState, setInitialQuantumState] = useState(null); // Stores validated state
  const [appliedGates, setAppliedGates] = useState([]); // Store applied gates
  const [matrixStates, setMatrixStates] = useState([]); // Store transformed matrices

  // Handle input changes
  const handleInputChange = (e, key, field) => {
    const value = e.target.value;
    if (key === "c0") {
      setC1({ ...c1, [field === "real" ? "a" : "b"]: value });
    } else if (key === "c1") {
      setC2({ ...c2, [field === "real" ? "c" : "d"]: value });
    }
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
      setButtonsDisabled(false); // Enable gates
      console.log("✅ Input is valid. Gates enabled. Sum:", sum);

      // Store the initial quantum state
      const initialState = createInitialQuantumState(a, b, c, d);
      console.log("Initial Quantum State:", initialState);
      setInitialQuantumState(initialState);
      setMatrixStates([initialState]); // Store as first matrix state
    } else {
      setButtonsDisabled(true); // Disable gates
      console.log("❌ Invalid input. Gates disabled. Sum:", sum);
    }
  };

  // **🟢 Step 2: Receive transformed matrix from GatesGrid**
  const handleMatrixUpdate = (newMatrix, gate) => {
    console.log("🔵 heree -- Updated Quantum Matrix received in App.js:", newMatrix);
    console.log("🟢 Gate received in App.js:", gate);
    // Update matrix states list
    setMatrixStates((prevStates) => {
      const updatedStates = [...prevStates, newMatrix];
      console.log("✅ Updated Matrix States List:", updatedStates);
      return updatedStates;
    });
    setAppliedGates((prevGates) => {
      const updatedGates = [...prevGates, gate];
      console.log("✅ Updated Applied Gates List:", updatedGates);
      return updatedGates;
    });
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <CircuitLine appliedGates={appliedGates} matrixStates={matrixStates} />
        {/* Quantum Matrix Input Section */}
        <div className="quantum-matrix-container">
          <QuantumMatrix
            c1={c1}
            c2={c2}
            handleInputChange={handleInputChange}
          />
        </div>
        {/* Validate Button */}
        <div className="validate-button-container">
          <button className="validate-button" onClick={handleValidateInput}>
            ✔
          </button>
        </div>
        {/* Gates Grid */}
        <GatesGrid
          buttonsDisabled={buttonsDisabled}
          initialQuantumState={initialQuantumState}
          onMatrixUpdate={handleMatrixUpdate}
        />
        {/* Bottom Section: Graphs & Bloch Sphere */}
        <div className="bottom-section">
          <div className="bloch-container">
            <BlochSphere />
          </div>
          <BarChartComponent title="Probabilities" />
        </div>
      </div>
    </div>
  );
}

export default App;
