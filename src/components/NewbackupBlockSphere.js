import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addAxisLabels } from "../utils/createAxisLabels";
import "./BlochSphere.css";

const BlochSphere = ({
  appliedGates,
  blochVector,
  prevBlochVector,
  vectorStates,
  isGateApplied,
  setIsGateApplied,
}) => {
  const mountRef = useRef(null);
  let sphereGroup;
  let arrowHelper = null;
  let targetRotation = { x: 0, y: 0, z: 0 }; // Rotation tracker

  useEffect(() => {
    console.log("✅ Current Applied Gates:", appliedGates);
    console.log("✅ Current Bloch Vector:", blochVector);

    // ✅ Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // ✅ Create Bloch sphere & vector group
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const geometry = new THREE.SphereGeometry(6.5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 0x505050,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereGroup.add(sphere);

    // ✅ Shortened Axes
    const axesHelper = new THREE.AxesHelper(6.8);
    scene.add(axesHelper);

    // ✅ Add Axis Labels (Single function call!)
    addAxisLabels(scene); // 🎯 Modularized!

    // ✅ Function to update the vector (For initial placement & undo)
    const updateVector = () => {
      console.log("---->> non-animation update called <<----- ", blochVector);
      if (blochVector) {
        const direction = new THREE.Vector3(
          blochVector.y,
          blochVector.z,
          blochVector.x
        ).normalize();
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 6;
        const color = 0xff0000;

        arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
        sphereGroup.add(arrowHelper);
      }
    };

    // ✅ Function to animate gate transformations
    const animateGateTransformation = (gate) => {
      console.log("🟠 Animating Gate Transformation!");
      // see what previous existing vector was and just add that
      if (prevBlochVector) {
        const direction = new THREE.Vector3(
          prevBlochVector.y,
          prevBlochVector.z,
          prevBlochVector.x
        ).normalize();
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 6;
        const color = 0xff0000;

        arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
        sphereGroup.add(arrowHelper);
      }

      // Determine target rotation (180° rotation per gate)
      switch (gate) {
        case "X":
          targetRotation.z += Math.PI; // Rotate around X-axis
          break;
        case "Y":
          targetRotation.x += Math.PI; // Rotate around Y-axis
          break;
        case "Z":
          targetRotation.y += Math.PI; // Rotate around Z-axis
          break;
        default:
          console.log("⚠️ No rotation needed for this gate.");
          return;
      }

      let animationFrame;
      const animate = () => {
        // Smooth interpolation using lerp
        const lerpFactor = 0.005; // Adjust for smoother/faster rotation

        sphereGroup.rotation.x +=
          (targetRotation.x - sphereGroup.rotation.x) * lerpFactor;
        sphereGroup.rotation.y +=
          (targetRotation.y - sphereGroup.rotation.y) * lerpFactor;
        sphereGroup.rotation.z +=
          (targetRotation.z - sphereGroup.rotation.z) * lerpFactor;

        renderer.render(scene, camera);

        // Continue animation until close enough
        if (
          Math.abs(sphereGroup.rotation.x - targetRotation.x) > 0.01 ||
          Math.abs(sphereGroup.rotation.y - targetRotation.y) > 0.01 ||
          Math.abs(sphereGroup.rotation.z - targetRotation.z) > 0.01
        ) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(animationFrame);
          console.log("✅ Animation Complete");
          setIsGateApplied(false); // Reset gate applied state
        }
      };

      animate();
    };

    // ✅ UseEffect Logic
    if (isGateApplied && appliedGates.length > 0) {
      console.log("anime called? isGateApplied: ", isGateApplied);
      animateGateTransformation(appliedGates[appliedGates.length - 1]); // ✅ Animate last applied gate
    } else {
      if (blochVector) {
        console.log("non animate called? isGateApplied: ", isGateApplied);
        updateVector(); // ✅ Normal update for initial vector & undo
      }
    }

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    // Camera position
    camera.position.z = 3;
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [appliedGates, blochVector, vectorStates, isGateApplied]);

  return <div ref={mountRef} />;
};
export default BlochSphere;
