import React, { useState } from "react";
import BarChartComponent from "./components/BarChartComponent";
import "./App.css";
import axios from "axios";
import BlochSphere from "./BlochSphere";
import CircuitBuilder from "./CircuitBuilder";
import InputSection from "./components/InputSection";

function App() {
  const [activeTab, setActiveTab] = useState("32-bit");
  const [c1, setC1] = useState({ a: "", b: "" });
  const [c2, setC2] = useState({ c: "", d: "" });
  const [shots, setShots] = useState(""); // New state for number of shots
  const [result, setResult] = useState("");
  const [error, setError] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false); // Tracks if validation is successful
  const [buttonsDisabled, setButtonsDisabled] = useState(false); // New state for button status

  const handleInputChange = (e, key, complex) => {
    const value = e.target.value;
    if (complex === "c1") {
      setC1({ ...c1, [key]: value });
    } else if (complex === "c2") {
      setC2({ ...c2, [key]: value });
    }
  };

  const handleShotsChange = (e) => {
    setShots(e.target.value);
  };

  const handleCalculate = () => {
    const url = "http://localhost:8080/data";

    const data = {
      a: parseFloat(c1.a),
      b: parseFloat(c1.b),
      c: parseFloat(c2.c),
      d: parseFloat(c2.d),
      s: parseInt(shots, 10), // Convert shots to an integer
    };

    axios
      .post(url, data)
      .then((response) => {
        const responseResult = response.data.result;
        setResult(responseResult);

        // Parse the result to enable/disable buttons
        if (responseResult.toLowerCase().includes("error")) {
          setButtonsDisabled(true); // Disable buttons if error found
        } else if (responseResult.toLowerCase().includes("ok")) {
          setButtonsDisabled(false); // Enable buttons if OK found
        }
      })
      .catch((err) => {
        console.error(err);
        setResult("Error fetching data");
        setButtonsDisabled(true); // Disable buttons on error
      });
  };

  return (
    <div className="app-container">
      <div className="tabs">
        <button
          className={activeTab === "32-bit" ? "tab active" : "tab"}
          onClick={() => setActiveTab("32-bit")}
        >
          32 bit
        </button>
        <button className="tab disabled">64 Bit</button>
      </div>

      {activeTab === "32-bit" && (
        <div className="tab-content">
          <div className="content-container">
            <InputSection
              c1={c1}
              c2={c2}
              shots={shots}
              handleInputChange={handleInputChange}
              handleShotsChange={handleShotsChange}
              handleCalculate={handleCalculate}
            />
            <div className={`result ${error ? "error" : ""}`}>{result}</div>
            <div className="circuit-builder-and-bloch">
              <CircuitBuilder buttonsDisabled={buttonsDisabled} />
            </div>
            {/* Add bottom section for diagrams */}
            <div className="bottom-section">
              <BarChartComponent title="Bar Chart 1" />
              <BarChartComponent title="Bar Chart 2" />
              <div className="bloch-container">
                <BlochSphere />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
