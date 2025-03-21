import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addAxisLabels } from "../utils/createAxisLabels";
import "./BlochSphere.css";

const BlochSphere = ({
  appliedGates,
  blochVector,
  prevBlochVector, // not used in this version
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

  // Maintain a history stack for the group's rotation state.
  // The initial state is at index 0.
  const groupHistoryRef = useRef([]);
  // Track previous appliedGates length.
  const prevGateCountRef = useRef(appliedGates.length);

  // INITIALIZATION: Setup scene, camera, renderer, sphere & axes
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

    // Create the Bloch sphere mesh and add it to the group
    const geometry = new THREE.SphereGeometry(6.5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 0x505050,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereGroupRef.current.add(sphere);
    sceneRef.current.add(sphereGroupRef.current);

    // Add axes helper and labels
    const axesHelper = new THREE.AxesHelper(6.8);
    sceneRef.current.add(axesHelper);
    addAxisLabels(sceneRef.current);

    // Setup OrbitControls
    const controls = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controls.enableDamping = true;

    // Initialize history with the initial (identity) rotation state.
    groupHistoryRef.current = [sphereGroupRef.current.rotation.clone()];

    // Start render loop
    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();
  }, []);

  // FUNCTION: Animate a non-identity gate transformation.
  const animateGateTransformation = (gate) => {
    let rotationAxis = new THREE.Vector3();
    let remainingAngle = Math.PI; // 180° default rotation
    switch (gate) {
      case "X":
        rotationAxis.set(0, 0, 1);
        break;
      case "Y":
        rotationAxis.set(1, 0, 0);
        break;
      case "Z":
        rotationAxis.set(0, -1, 0);
        break;
      case "H":
        rotationAxis.set(1, 0, 1).normalize();
        break;
      default:
        console.log("No transformation defined for gate:", gate);
        setIsGateApplied(false);
        return;
    }

    const step = 0.01; // rotation step for smooth animation
    const animateStep = () => {
      sphereGroupRef.current.rotateOnAxis(rotationAxis, step);
      remainingAngle -= step;
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      if (remainingAngle > 0.01) {
        requestAnimationFrame(animateStep);
      } else {
        // Animation complete; push the new state into history.
        setIsGateApplied(false);
        groupHistoryRef.current.push(sphereGroupRef.current.rotation.clone());
      }
    };
    animateStep();
  };

  // EFFECT: Respond to changes in appliedGates (new transformation or undo)
  useEffect(() => {
    const desiredHistoryLength = appliedGates.length + 1;
    const history = groupHistoryRef.current;
    const currentGateCount = appliedGates.length;
    const lastGate = appliedGates[appliedGates.length - 1] || null;

    if (currentGateCount < prevGateCountRef.current) {
      // Undo: Pop extra states and restore the previous rotation.
      while (history.length > desiredHistoryLength) {
        history.pop();
      }
      const previousState = history[history.length - 1];
      sphereGroupRef.current.rotation.copy(previousState);
      sphereGroupRef.current.updateMatrix();
      // Re-enable gates after undo.
      setIsGateApplied(false);
    } else if (currentGateCount > prevGateCountRef.current) {
      if (lastGate === "I") {
        // For identity, record the current state.
        history.push(sphereGroupRef.current.rotation.clone());
      } else if (lastGate) {
        // For non-identity gates (like H), always trigger the transformation.
        animateGateTransformation(lastGate);
      }
    }
    prevGateCountRef.current = currentGateCount;
  }, [appliedGates]);

  // EFFECT: Create arrow helper if not yet created.
  useEffect(() => {
    if (!arrowHelperRef.current && blochVector) {
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
  }, [blochVector]);

  return <div ref={mountRef} />;
};

export default BlochSphere;
