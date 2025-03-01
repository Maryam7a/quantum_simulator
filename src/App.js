import React, { useState } from "react";
import BarChartComponent from "./components/BarChartComponent";
import "./App.css";
import BlochSphere from "./components/BlochSphere";
import QuantumMatrix from "./components/quantummatrix";
import { createInitialQuantumState } from "./utils/quantumGates"; // Import function to generate state
import { Button } from "antd";
import GatesGrid from "./components/GatesGrid";
import CircuitLine from "./components/CircuitLine"; // Import the separate circuit line component
import { applyGateToVector, convertInputToVector } from "./utils/convertInputToVector";


function App() {
  const [c1, setC1] = useState({ a: "", b: "" });
  const [c2, setC2] = useState({ c: "", d: "" });
  const [shots, setShots] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [initialQuantumState, setInitialQuantumState] = useState(null); // Stores validated state
  const [appliedGates, setAppliedGates] = useState([]); // Store applied gates
  const [matrixStates, setMatrixStates] = useState([]); // Store transformed matrices
  const [blochVector, setBlochVector] = useState(null);
  const [vectorStates, setVectorStates] = useState([]); // Store transformed vectors

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

      // Compute Bloch Sphere Vector
      const initialVector = convertInputToVector(a, b, c, d);
      console.log("🔵 Initial Vector for Bloch Sphere:", initialVector);
      setVectorStates([initialVector]); // Store as first vector state

      // Store the initial quantum state
      const initialState = createInitialQuantumState(a, b, c, d);
      console.log("Initial Quantum State:", initialState);
      setInitialQuantumState(initialState);
      setMatrixStates([initialState]); // Store as first matrix state
    } else {
      setButtonsDisabled(true); // Disable gates
      console.log("❌ Invalid input. Gates disabled. Sum:", sum);
      setBlochVector(null); // Remove the vector if input is invalid
      setVectorStates(null);
    }
  };

  // **🟢 Step 2: Receive transformed matrix from GatesGrid**
  const handleMatrixUpdate = (newMatrix, gate) => {
    console.log(
      "🔵 heree -- Updated Quantum Matrix received in App.js:",
      newMatrix
    );
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
    // Apply gate transformation to the last vector in vectorStates
    setVectorStates((prevVectors) => {
      if (prevVectors.length === 0) {
        console.warn("⚠️ No initial vector found. Skipping transformation.");
        return prevVectors; // If no vector exists, do nothing
      }

      const lastVector = prevVectors[prevVectors.length - 1]; // Get last known vector
      const newVector = applyGateToVector(lastVector, gate); // Apply gate transformation
      console.log("✅ New Vector after gate:", newVector);

      return [...prevVectors, newVector]; // Store the updated vector
    });
  };

  return (
    <div className="app-container">
      <div className="content-container">
        <CircuitLine
          appliedGates={appliedGates}
          matrixStates={matrixStates}
          c1={c1}
          c2={c2}
          handleInputChange={handleInputChange}
          handleValidateInput={handleValidateInput}
        />

        {/* Bottom Section: Gates, Bloch Sphere & Probability Graph */}
        <div className="bottom-section">
          {/* Gates Grid (Left) */}
          <div className="gates-grid-container">
            <GatesGrid
              buttonsDisabled={buttonsDisabled}
              initialQuantumState={matrixStates[matrixStates.length - 1]}
              onMatrixUpdate={handleMatrixUpdate}
            />
          </div>

          {/* Bloch Sphere (Center) */}
          <div className="bloch-container">
            <BlochSphere
              appliedGates={appliedGates}
              blochVector={vectorStates[vectorStates.length - 1]}
            />
          </div>

          {/* Probability Graph (Right) */}
          <div className="bar-chart-container">
            <BarChartComponent title="Probabilities" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
