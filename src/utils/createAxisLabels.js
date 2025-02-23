import * as THREE from "three";

// Function to create a text label
const createTextLabel = (scene, text, position) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "30px Arial";
  context.fillStyle = "white";
  context.fillText(text, 10, 50);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5, 0.25, 1);
  sprite.position.set(position.x, position.y, position.z);
  scene.add(sprite);
};

// Function to add all axis labels
export const addAxisLabels = (scene) => {
  createTextLabel(scene, "+X", { x: 1.3, y: 0, z: 0 });
  createTextLabel(scene, "-X", { x: -1.3, y: 0, z: 0 });
  createTextLabel(scene, "+Y", { x: 0, y: 1.3, z: 0 });
  createTextLabel(scene, "-Y", { x: 0, y: -1.3, z: 0 });
  createTextLabel(scene, "+Z", { x: 0, y: 0, z: 1.3 });
  createTextLabel(scene, "-Z", { x: 0, y: 0, z: -1.3 });

  createTextLabel(scene, "|0⟩", { x: 0, y: 1.1, z: 0 });
  createTextLabel(scene, "|1⟩", { x: 0, y: -1.1, z: 0 });
};
