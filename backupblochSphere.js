import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const BlochSphere = () => {
  const mountRef = useRef(null);
  let arrowHelper; // Declare globally for later updates

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

    renderer.setSize(window.innerWidth * 0.4, window.innerHeight * 0.4); // Limit size to 40% width/height
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Create the Bloch sphere
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xd3d3d3, // Slightly lighter grey
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add axes
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);

    // Add vector using ArrowHelper
    const direction = new THREE.Vector3(0, 0, 1).normalize(); // Vector pointing to +Z
    const origin = new THREE.Vector3(0, 0, 0); // Origin
    const length = 1; // Length of the vector
    const color = 0xff0000; // Red color
    arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
    scene.add(arrowHelper);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth movement

    // Camera position
    camera.position.z = 3;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default BlochSphere;
