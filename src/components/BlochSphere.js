import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addAxisLabels } from "../utils/createAxisLabels"; // ✅ Import the function
import "./BlochSphere.css";

const BlochSphere = ({ appliedGates, blochVector }) => {
  
  const mountRef = useRef(null);
  let sphereGroup; // Group for Bloch sphere + vector
  let targetRotation = { x: 0, y: 0, z: 0 }; // Store the target rotation values
  let arrowHelper = null; // Declare globally

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // ✅ Create a group for the Bloch sphere & vector
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // ✅ Create the Bloch sphere inside the group
    const geometry = new THREE.SphereGeometry(5, 20, 20);
    const material = new THREE.MeshBasicMaterial({
      color: 0x505050,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereGroup.add(sphere); // Add sphere to the group

    // ✅ Shortened Axes
    const axesHelper = new THREE.AxesHelper(6);
    scene.add(axesHelper);

    // ✅ Add Axis Labels (Single function call!)
    addAxisLabels(scene); // 🎯 Modularized!

    const updateVector = () => {
      if (blochVector) {
        const direction = new THREE.Vector3(
          blochVector.x,
          blochVector.y,
          blochVector.z
        ).normalize();
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 5.5;
        const color = 0xff0000;

        arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
        sphereGroup.add(arrowHelper);
      }
    };

    updateVector();

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Camera position
    camera.position.z = 3;
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    if (appliedGates.length > 0) {
      const lastGate = appliedGates[appliedGates.length - 1]; // Get the last gate applied
      console.log("🔵 Bloch Sphere Last applied gate:", lastGate);
      applyGateTransformation(lastGate);
    }

    // Animation loop (we will handle rotation smoothly later)
    const animate = () => {
      requestAnimationFrame(animate);

      // Smoothly interpolate rotation toward target values
      const lerpFactor = 0.01; // Adjust this for slower or faster transitions
      sphereGroup.rotation.x +=
        (targetRotation.x - sphereGroup.rotation.x) * lerpFactor;
      sphereGroup.rotation.y +=
        (targetRotation.y - sphereGroup.rotation.y) * lerpFactor;
      sphereGroup.rotation.z +=
        (targetRotation.z - sphereGroup.rotation.z) * lerpFactor;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [appliedGates, blochVector]); // Now updates whenever `blochVector` changes

  const applyGateTransformation = (gate) => {
    if (!sphereGroup) return; // Ensure the sphere is defined
    console.log("🔵 ---> Target rotation before:", targetRotation.x);
    switch (gate) {
      case "X":
        targetRotation.x += Math.PI; // Set target rotation for X gate
        console.log(
          "🔄 X Gate Applied: Target X rotation set to",
          targetRotation.x
        );
        break;
      case "Y":
        targetRotation.y += Math.PI; // Set target rotation for Y gate
        console.log(
          "🔄 Y Gate Applied: Target Y rotation set to",
          targetRotation.y
        );
        break;
      case "Z":
        targetRotation.z += Math.PI; // Set target rotation for Z gate
        console.log(
          "🔄 Z Gate Applied: Target Z rotation set to",
          targetRotation.z
        );
        break;
      default:
        console.log("⚠️ No transformation defined for this gate.");
    }
  };

  return <div ref={mountRef} />;
};

export default BlochSphere;
