import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addAxisLabels } from "../utils/createAxisLabels";
import "./BlochSphere.css";

const BlochSphere = ({
  appliedGates,
  blochVector,
  prevBlochVector, // Not used explicitly in this version
  isGateApplied,
  setIsGateApplied,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const rendererRef = useRef(new THREE.WebGLRenderer({ alpha: true }));
  const sphereGroupRef = useRef(new THREE.Group());
  const arrowHelperRef = useRef(null);
  // Transformation history (only for non-identity gates)
  const groupHistoryRef = useRef([]);
  // Track previous appliedGates length to determine new transformation or undo
  const prevGatesLengthRef = useRef(appliedGates.length);
  // Track the last gate that caused a transformation (skip if it was "I")
  const lastAppliedGateRef = useRef(null);

  // INITIALIZATION: Scene, Camera, Renderer, Sphere & Axes (runs only once)
  useEffect(() => {
    rendererRef.current.setSize(
      window.innerWidth * 0.75,
      window.innerHeight * 0.75
    );
    rendererRef.current.setClearColor(0x000000, 0);
    if (mountRef.current) {
      mountRef.current.appendChild(rendererRef.current.domElement);
    }
    cameraRef.current.position.set(6, 6, 6);
    cameraRef.current.lookAt(0, 0, 0);

    // Create Bloch sphere mesh and add it to the sphere group
    const geometry = new THREE.SphereGeometry(6.5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 0x505050,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereGroupRef.current.add(sphere);
    sceneRef.current.add(sphereGroupRef.current);

    // Add Axes Helper and Axis Labels
    const axesHelper = new THREE.AxesHelper(6.8);
    sceneRef.current.add(axesHelper);
    addAxisLabels(sceneRef.current);

    // Setup OrbitControls
    const controls = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controls.enableDamping = true;

    // Initialize transformation history with the starting (identity) rotation
    groupHistoryRef.current = [sphereGroupRef.current.rotation.clone()];

    // Start the render loop
    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();
  }, []);

  // FUNCTION: Animate a new gate transformation and update the history stack
  const animateGateTransformation = (gate) => {
    let rotationAxis = new THREE.Vector3();
    let remainingAngle = Math.PI; // Default rotation of 180°
    switch (gate) {
      case "X":
        rotationAxis.set(0, 0, 1); // Rotate about Z-axis
        break;
      case "Y":
        rotationAxis.set(1, 0, 0); // Rotate about X-axis
        break;
      case "Z":
        rotationAxis.set(0, -1, 0); // Rotate about Y-axis
        break;
      case "H":
        rotationAxis.set(1, 0, 1).normalize(); // Diagonal rotation (X+Z)
        break;
      default:
        console.log("No rotation defined for gate:", gate);
        return;
    }

    const animate = () => {
      const step = 0.01; // Small rotation step for smooth animation
      sphereGroupRef.current.rotateOnAxis(rotationAxis, step);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      remainingAngle -= step;
      if (remainingAngle > 0.01) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete—update transformation history with final rotation state
        setIsGateApplied(false);
        groupHistoryRef.current.push(sphereGroupRef.current.rotation.clone());
      }
    };
    animate();
  };

  // EFFECT: Monitor changes to appliedGates and apply new transformation or undo as needed
  useEffect(() => {
    const prevLength = prevGatesLengthRef.current;
    const lastGate = appliedGates[appliedGates.length - 1] || null;

    // If the last applied gate is the identity, update tracking and do nothing further
    if (lastGate === "I") {
      prevGatesLengthRef.current = appliedGates.length;
      lastAppliedGateRef.current = "I";
    }
    // New transformation: non-identity gate added and transformation flag is true
    else if (appliedGates.length > prevLength && isGateApplied) {
      animateGateTransformation(lastGate);
      lastAppliedGateRef.current = lastGate;
      prevGatesLengthRef.current = appliedGates.length;
    }
    // Undo: appliedGates length decreased; revert to previous transformation state if the undone gate was non‑identity
    else if (appliedGates.length < prevLength) {
      if (lastAppliedGateRef.current !== "I") {
        if (groupHistoryRef.current.length > 1) {
          groupHistoryRef.current.pop(); // Remove current state
          const previousRotation =
            groupHistoryRef.current[groupHistoryRef.current.length - 1];
          sphereGroupRef.current.rotation.copy(previousRotation);
        } else {
          sphereGroupRef.current.rotation.set(0, 0, 0);
          groupHistoryRef.current = [sphereGroupRef.current.rotation.clone()];
        }
      }
      // Update tracking with the new last gate (could be "I" or a non‑identity gate)
      const newLastGate = appliedGates[appliedGates.length - 1] || null;
      lastAppliedGateRef.current = newLastGate;
      prevGatesLengthRef.current = appliedGates.length;
    }
    // On initial render, if no arrow helper exists, create it from blochVector
    else if (!arrowHelperRef.current && blochVector) {
      const direction = new THREE.Vector3(
        blochVector.y,
        blochVector.z,
        blochVector.x
      ).normalize();
      arrowHelperRef.current = new THREE.ArrowHelper(
        direction,
        new THREE.Vector3(0, 0, 0),
        6,
        0xff0000
      );
      sphereGroupRef.current.add(arrowHelperRef.current);
    }
  }, [appliedGates, blochVector, isGateApplied, setIsGateApplied]);

  return <div ref={mountRef} />;
};

export default BlochSphere;
