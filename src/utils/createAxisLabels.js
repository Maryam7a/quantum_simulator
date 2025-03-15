import * as THREE from "three";

// Function to create a text label
const createTextLabel = (scene, text, position) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 120; // Increase canvas size
  canvas.height = 60; // Adjust height for better text rendering
  context.fillStyle = "white";

  context.font = "45px Arial";
  context.fillText(text, 2, 50);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 1, 1);
  sprite.position.set(position.x, position.y, position.z);
  scene.add(sprite);
};

// Function to add all axis labels
export const addAxisLabels = (scene) => {
  createTextLabel(scene, "+X", { x: 0, y: 0, z: 7 });
  createTextLabel(scene, "+Y", { x: 7, y: 0, z: 0 });
  createTextLabel(scene, "+Z", { x: 0, y: 7, z: 0 });

  createTextLabel(scene, "|0⟩", { x: 1, y: 7, z: 0 });
  createTextLabel(scene, "|1⟩", { x: 0, y: -7, z: 0 });
};
