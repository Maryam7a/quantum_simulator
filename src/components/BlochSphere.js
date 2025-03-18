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
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereGroupRef = useRef(null);
  const arrowHelperRef = useRef(null);

  // Initialize Three.js scene only once
  useEffect(() => {
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

    // Create a group to hold the sphere and the arrow helper
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Create the wireframe sphere
    const geometry = new THREE.SphereGeometry(6.5, 15, 15);
    const material = new THREE.MeshBasicMaterial({
      color: 0x505050,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphereGroup.add(sphere);

    // Add axes helper and axis labels
    const axesHelper = new THREE.AxesHelper(6.8);
    scene.add(axesHelper);
    addAxisLabels(scene);

    // Setup OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    // Save references for later updates
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    sphereGroupRef.current = sphereGroup;

    // Start the render loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      scene.clear();
    };
  }, []);

  // Update transformation: animate rotation and update arrow direction
  useEffect(() => {
    if (!sphereGroupRef.current) return;
    const sphereGroup = sphereGroupRef.current;

    // If the arrow helper doesn't exist yet and we have a Bloch vector, create it.
    if (!arrowHelperRef.current && blochVector) {
      const direction = new THREE.Vector3(
        blochVector.y,
        blochVector.z,
        blochVector.x
      ).normalize();
      const origin = new THREE.Vector3(0, 0, 0);
      const length = 6;
      const color = 0xff0000;
      const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
      sphereGroup.add(arrowHelper);
      arrowHelperRef.current = arrowHelper;
    }

    // If a transformation is being applied, animate the rotation of the entire group.
    if (isGateApplied && appliedGates.length > 0) {
      const gate = appliedGates[appliedGates.length - 1];
      const targetRotation = { 
        x: sphereGroup.rotation.x, 
        y: sphereGroup.rotation.y, 
        z: sphereGroup.rotation.z 
      };
      switch (gate) {
        case "X":
          targetRotation.z += Math.PI;
          break;
        case "Y":
          targetRotation.x += Math.PI;
          break;
        case "Z":
          targetRotation.y += Math.PI;
          break;
        case "H":
          targetRotation.y += Math.PI / 2;
          targetRotation.z += Math.PI / 2;
          break;
        default:
          console.log("No rotation needed for this gate.");
          break;
      }
      let animationFrame;
      const animateTransformation = () => {
        const lerpFactor = 0.008;
        sphereGroup.rotation.x += (targetRotation.x - sphereGroup.rotation.x) * lerpFactor;
        sphereGroup.rotation.y += (targetRotation.y - sphereGroup.rotation.y) * lerpFactor;
        sphereGroup.rotation.z += (targetRotation.z - sphereGroup.rotation.z) * lerpFactor;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        if (
          Math.abs(sphereGroup.rotation.x - targetRotation.x) > 0.01 ||
          Math.abs(sphereGroup.rotation.y - targetRotation.y) > 0.01 ||
          Math.abs(sphereGroup.rotation.z - targetRotation.z) > 0.01
        ) {
          animationFrame = requestAnimationFrame(animateTransformation);
        } else {
          cancelAnimationFrame(animationFrame);
          console.log("✅ Animation Complete");
          setIsGateApplied(false);
          // After the rotation, update the arrow helper's direction (if needed)
          if (blochVector && arrowHelperRef.current) {
            const newDir = new THREE.Vector3(
              blochVector.y,
              blochVector.z,
              blochVector.x
            ).normalize();
            arrowHelperRef.current.setDirection(newDir);
          }
        }
      };
      animateTransformation();
    } else {
      // If not animating, simply update the arrow helper's direction.
      if (blochVector && arrowHelperRef.current) {
        const newDir = new THREE.Vector3(
          blochVector.y,
          blochVector.z,
          blochVector.x
        ).normalize();
        arrowHelperRef.current.setDirection(newDir);
      }
    }
  }, [appliedGates, blochVector, isGateApplied]);

  return <div ref={mountRef} />;
};

export default BlochSphere;
