import React from "react";
import "./InputSection.css";

const InputSection = ({
  c1,
  c2,
  shots,
  handleInputChange,
  handleShotsChange,
  handleCalculate,
}) => {
  return (
    <div className="input-row">
      <div className="input-group">
        <h3>C1 = a + bi</h3>
        <div className="complex-input-box">
          <input
            type="text"
            placeholder="Real"
            value={c1.a}
            onChange={(e) => handleInputChange(e, "a", "c1")}
          />
          <span className="plus-symbol">+</span>
          <input
            type="text"
            placeholder="Imaginary"
            value={c1.b}
            onChange={(e) => handleInputChange(e, "b", "c1")}
          />
          <span className="imaginary-symbol">i</span>
        </div>
      </div>

      <div className="input-group">
        <h3>C2 = c + di</h3>
        <div className="complex-input-box">
          <input
            type="text"
            placeholder="Real"
            value={c2.c}
            onChange={(e) => handleInputChange(e, "c", "c2")}
          />
          <span className="plus-symbol">+</span>
          <input
            type="text"
            placeholder="Imaginary"
            value={c2.d}
            onChange={(e) => handleInputChange(e, "d", "c2")}
          />
          <span className="imaginary-symbol">i</span>
        </div>
      </div>

      <div className="input-group">
        <h3>Number of Shots</h3>
        <input
          type="number"
          placeholder="Enter shots"
          value={shots}
          onChange={handleShotsChange}
        />
      </div>
      <button onClick={handleCalculate} className="validate-button">
        Validate
      </button>
    </div>
  );
};

export default InputSection;
