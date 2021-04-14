import * as THREE from 'three';

import { Measure } from '../types';

export type Surface = {
  dimensions : Measure ;
  position   : Measure ;
  color      : number | string ;
  texture    : string ;
}

export function surface(surface : Surface) : THREE.Mesh {
  return new THREE.Mesh(
		new THREE.BoxGeometry(surface.dimensions.x, surface.dimensions.y, surface.dimensions.z), 
		new THREE.MeshPhongMaterial( { color: surface.color } )
	);
}