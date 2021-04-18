import * as THREE from "three";

import { Vector3, Vector2, Texture } from '../types';

export const fromDegrees = (degrees : number) : number => {
  return degrees * Math.PI / 180;
}

export const rotate = <T extends THREE.Mesh | THREE.Group>(mesh : T, rotation : Vector3) : T => {
  mesh.rotation.set(fromDegrees(rotation.x), fromDegrees(rotation.y), fromDegrees(rotation.z));
  return mesh;
}

export const translate = <T extends THREE.Mesh | THREE.Group>(mesh : T, vector : Vector3) : T => {
  mesh.position.x += vector.x;
  mesh.position.y += vector.y;
  mesh.position.z += vector.z;
  return mesh;
}

export const group = (meshes : THREE.Mesh[]) : THREE.Group => {
  const group = new THREE.Group();
  meshes.forEach(mesh => group.add(mesh));
  return group;
}

export const cameraLook = (camera : THREE.Camera) : Vector3 => {
  const {x, y, z} = new THREE.Vector3( 0, 0, -1 ).applyQuaternion( camera.quaternion ).add( camera.position );
  return {x, y, z};
}

export const saveCamera = (camera : THREE.Camera, id: number): void => {
  const _lookAt = cameraLook(camera);
  localStorage.setItem(`camera-${id}`, JSON.stringify({
    position: camera.position,
    lookAt : _lookAt
  }));
}

export const loadCamera = (camera : THREE.Camera, id: number) : void => {
  let _camera;
  try {
    const saved = localStorage.getItem(`camera-${id}`);
    _camera = saved ? JSON.parse(saved) : defaultCamera();
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


export const loadTexture = (textureDef : Texture) : THREE.Texture => {
  let _texture = new THREE.TextureLoader().load(textureDef.url);
  
  _texture.wrapS = THREE.MirroredRepeatWrapping;
  _texture.wrapT = THREE.MirroredRepeatWrapping;
  const _textureScale = textureScale(textureDef.imageDimensions, textureDef.realDimensions);
  _texture.repeat.set(_textureScale.x, _textureScale.y);
  _texture.rotation = 0;
  return _texture;
}

export const textureScale = (imageDimensions : Vector2, realDimensions : Vector2) : Vector2 => {
  return { 
    x : (realDimensions.x / imageDimensions.x),
    y : (realDimensions.y / imageDimensions.y),
  }
}
