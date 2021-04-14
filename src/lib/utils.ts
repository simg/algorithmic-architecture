import * as THREE from "three";

import { Vector3 } from '../types';

export function fromDegrees(degrees : number) : number {
  return degrees * Math.PI / 180;
}

// export function rotate(mesh : THREE.Mesh, axis : Vector3, angle : number) : THREE.Mesh {
//   // return mesh.rotation.set(new THREE.Vector3(axis.x, axis.y, axis.z), fromDegrees(angle));
//   mesh.rotateOnAxis(new THREE.Vector3(axis.x, axis.y, axis.z), fromDegrees(angle));
//   return mesh;
// }

export function rotate<T extends THREE.Mesh | THREE.Group>(mesh : T, rotation : Vector3) : T {
  // return mesh.rotation.set(new THREE.Vector3(axis.x, axis.y, axis.z), fromDegrees(angle));
  mesh.rotation.set(fromDegrees(rotation.x), fromDegrees(rotation.y), fromDegrees(rotation.z));
  return mesh;
}

// export function translate(mesh : THREE.Mesh, vector : Vector3) : THREE.Mesh {
//   mesh.position.x += vector.x;
//   mesh.position.y += vector.y;
//   mesh.position.z += vector.z;
//   return mesh;
// }

export function translate<T extends THREE.Mesh | THREE.Group>(mesh : T, vector : Vector3) : T {
  mesh.position.x += vector.x;
  mesh.position.y += vector.y;
  mesh.position.z += vector.z;
  return mesh;
}

export function group(meshes : THREE.Mesh[]) : THREE.Group {
  const group = new THREE.Group();
  meshes.forEach(mesh => group.add(mesh));
  return group;
}

export function cameraLook(camera : THREE.Camera) : Vector3 {
  const {x, y, z} = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( camera.quaternion ).add( camera.position );
  return {x, y, z};
}

export function saveCamera(camera : THREE.Camera, id: number): void {
  const _lookAt = cameraLook(camera);
  localStorage.setItem(`camera-${id}`, JSON.stringify({
    position: camera.position,
    lookAt : _lookAt}));
  console.log("camera position saved", camera.position, _lookAt);
}

export function loadCamera(camera : THREE.Camera, id: number) : void {
  let _camera
  try {
    _camera = JSON.parse(localStorage.getItem(`camera-${id}`));
  } catch (e) {
    _camera = defaultCamera();
  }
  camera.position.x = _camera.position.x;
  camera.position.y = _camera.position.y;
  camera.position.z = _camera.position.z;
  camera.lookAt(new THREE.Vector3(_camera.lookAt.x, _camera.lookAt.y, _camera.lookAt.z));
}

const defaultCamera = () => ({
  position : { x: 5000, y:400,  z:10000},
  lookAt   : { x: 0,    y:1000, z:0 }
})
