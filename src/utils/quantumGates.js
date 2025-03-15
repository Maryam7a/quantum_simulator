import * as math from "mathjs";

export const createInitialQuantumState = (a, b, c, d) => {
  return math.matrix([
    [math.complex(a, b)], // Represents the first amplitude (c1)
    [math.complex(c, d)], // Represents the second amplitude (c2)
  ]);
};

// Pauli X Gate (NOT Gate)
export const pauliX = (state) => {
  const xGate = math.matrix([
    [0, 1],
    [1, 0],
  ]);
  return math.multiply(xGate, state);
};

// Pauli Y Gate
export const pauliY = (state) => {
  const yGate = math.matrix([
    [0, math.complex(0, -1)],
    [math.complex(0, 1), 0],
  ]);
  return math.multiply(yGate, state);
};

// Pauli Z Gate (Phase Flip)
export const pauliZ = (state) => {
  const zGate = math.matrix([
    [1, 0],
    [0, -1],
  ]);
  return math.multiply(zGate, state);
};

// Hadamard Gate (Superposition)
export const hadamard = (state) => {
  const hGate = math.multiply(
    1 / math.sqrt(2),
    math.matrix([
      [1, 1],
      [1, -1],
    ])
  );
  return math.multiply(hGate, state);
};

// S Gate (π/2 Phase Shift)
export const sGate = (state) => {
  const sMatrix = math.matrix([
    [1, 0],
    [0, math.complex(0, 1)],
  ]);
  return math.multiply(sMatrix, state);
};

// T Gate (π/4 Phase Shift)
export const tGate = (state) => {
  const tMatrix = math.matrix([
    [1, 0],
    [0, math.exp(math.complex(0, Math.PI / 4))],
  ]);
  return math.multiply(tMatrix, state);
};

// Identity Gate (Does nothing)
export const identity = (state) => {
  const iGate = math.identity(2);
  return math.multiply(iGate, state);
};

// Function to apply a gate based on user input
export const applyGate = (state, gateName) => {
  switch (gateName) {
    case "X":
      return pauliX(state);
    case "Y":
      return pauliY(state);
    case "Z":
      return pauliZ(state);
    case "H":
      return hadamard(state);
    case "S":
      return sGate(state);
    case "T":
      return tGate(state);
    case "I":
      return identity(state);
    default:
      console.error(`Unknown gate: ${gateName}`);
      return state;
  }
};

export const measureQuantumState = (state) => {
  if (!state || state.size()[0] !== 2) {
    console.error("❌ Invalid quantum state for measurement.");
    return { measuredState: null, probabilities: { P0: 0, P1: 0 } };
  }

  // Extract real & imaginary parts of C0 and C1
  const C0 = state.get([0, 0]); // First element
  const C1 = state.get([1, 0]); // Second element

  // Compute probabilities: P(|0⟩) = |C0|², P(|1⟩) = |C1|²
  const prob0 = Math.pow(C0.re, 2) + Math.pow(C0.im, 2);
  const prob1 = Math.pow(C1.re, 2) + Math.pow(C1.im, 2);

  // Generate a random number to decide the measurement outcome
  const randomValue = Math.random();
  const measuredState = randomValue < prob0 ? "|0⟩" : "|1⟩";

  console.log("🔬 Measurement performed!");
  console.log(
    `📊 Probabilities: P(|0⟩) = ${prob0.toFixed(2)}, P(|1⟩) = ${prob1.toFixed(
      2
    )}`
  );
  console.log(`🎯 Collapsed to state: ${measuredState}`);

  return {
    measuredState,
    probabilities: { P0: prob0, P1: prob1 },
  };
};

