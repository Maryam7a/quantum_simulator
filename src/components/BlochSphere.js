import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { addAxisLabels } from "../utils/createAxisLabels";
import "./BlochSphere.css";

const BlochSphere = ({ appliedGates, blochVector, vectorStates }) => {
  const mountRef = useRef(null);
  let sphereGroup; // Group for Bloch sphere + vector
  let targetRotation = { x: 0, y: 0, z: 0 }; // Store the target rotation values
  let arrowHelper = null; // Declare globally

  useEffect(() => {
    console.log("✅ Current Applied Gates:", appliedGates);
    console.log("✅ Current Bloch Vector:", blochVector);
    console.log("✅ Current Sphere Rotation: ", targetRotation);

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      100, // Field of view (FOV) - controls height
      window.innerWidth / window.innerHeight, // Aspect ratio - controls width
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // ✅ Create a group for the Bloch sphere & vector
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // ✅ Create the Bloch sphere inside the group
    const geometry = new THREE.SphereGeometry(6.5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 0x505050,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereGroup.add(sphere); // Add sphere to the group

    // ✅ Shortened Axes
    const axesHelper = new THREE.AxesHelper(6.8);
    scene.add(axesHelper);

    // ✅ Add Axis Labels (Single function call!)
    addAxisLabels(scene); // 🎯 Modularized!

    const updateVector = () => {
      console.log("---->> when is this called <<----- ", blochVector);
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

    updateVector();

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Camera position
    camera.position.z = 3;
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    // Animation loop (we will handle rotation smoothly later)
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [appliedGates, blochVector, vectorStates]); // Now updates whenever `blochVector` changes

  return <div ref={mountRef} />;
};

export default BlochSphere;
