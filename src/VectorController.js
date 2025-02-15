import * as THREE from "three";
import { useEffect } from "react";

const VectorController = ({ scene }) => {
  useEffect(() => {
    if (!scene) {
      console.error("Scene is not defined.");
      return;
    }
    console.log("VectorController mounted with scene:", scene);

    const direction = new THREE.Vector3(1, 0, 0); // Static vector pointing to +X-axis
    const arrowHelper = new THREE.ArrowHelper(
      direction.normalize(),
      new THREE.Vector3(0, 0, 0), // Origin
      1, // Length
      0xff0000 // Red color
    );

    scene.add(arrowHelper);
    console.log("ArrowHelper added:", arrowHelper);

    // Temporarily disable cleanup
    // return () => {
    //   scene.remove(arrowHelper);
    //   console.log("ArrowHelper removed");
    // };
  }, [scene]);

  return null;
};

export default VectorController;
