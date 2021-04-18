import * as THREE from 'three';

import { Measure, Vector2, Texture } from '../types';
import { loadTexture }  from '../lib/utils';



export type Surface = {
  dimensions : Measure ;
  position   : Measure ;
  color      : number | string ;
  edgeColor  : number | string ;
  texture    : Texture | undefined
}


export const surface = (surface : Surface) : THREE.Mesh => {

  const mesh = new THREE.Mesh(
		new THREE.BoxGeometry(surface.dimensions.x, surface.dimensions.y, surface.dimensions.z), 
		new THREE.MeshStandardMaterial(surface.texture ? { map: loadTexture(surface.texture) } : { color : surface.color })
  );
  
  const wireframe = new THREE.LineSegments( 
    new THREE.EdgesGeometry( mesh.geometry ), 
    new THREE.LineBasicMaterial( { color: surface.edgeColor } )
  );
  mesh.add(wireframe);  

  return mesh;
}