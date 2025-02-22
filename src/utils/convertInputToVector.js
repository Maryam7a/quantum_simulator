/**
 * Converts user input (C₀ and C₁ complex numbers) into a Bloch sphere vector.
 * @param {number} a - Real part of C₀
 * @param {number} b - Imaginary part of C₀
 * @param {number} c - Real part of C₁
 * @param {number} d - Imaginary part of C₁
 * @returns {Object} { x, y, z } representing the vector position on Bloch sphere
 */
export const convertInputToVector = (a, b, c, d) => {
  // Step 1: Compute probabilities |C₀|² and |C₁|²
  const magnitudeC0Squared = a * a + b * b;
  const magnitudeC1Squared = c * c + d * d;

  // Step 2: Compute theta (colatitude angle)
  const theta = 2 * Math.acos(Math.sqrt(magnitudeC0Squared));

  // Step 3: Compute phi (longitude angle)
  const phaseC0 = Math.atan2(b, a); // Phase of C₀
  const phaseC1 = Math.atan2(d, c); // Phase of C₁
  const phi = phaseC1 - phaseC0;

  // Step 4: Convert (theta, phi) to Cartesian coordinates
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  console.log("📍 Converted Input to Bloch Sphere Vector:", { x, y, z });

  return { x, y, z };
};
