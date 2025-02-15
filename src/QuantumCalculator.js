import React, { useState } from "react";
import axios from "axios";

const QuantumCalculator = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchResult = () => {
    // URL of backend endpoint
    const url = "http://localhost:8080/data";

    const data = {
      a: 0.2, // 0.707 for correct result
      b: 0,
      c: 0.707,
      d: 0,
      s: 100,
    };

    console.log("Sending data:", data);

    axios
      .post(url, data)
      .then((response) => {
        setResult(response.data.result);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching data");
      });
  };

  return (
    <div>
      <h1>Quantum Calculator</h1>
      <button onClick={fetchResult}>Calculate</button>

      {result && (
        <div>
          <h2>Result:</h2>
          {result.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default QuantumCalculator;
