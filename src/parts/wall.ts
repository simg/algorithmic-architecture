import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

import { Rotation, Translation, Vector2, Vector3 } from '../types';
import { TextureDataType } from 'three';


export enum Material {
	"steel",
	"wood", 
	"concrete",
	"brick",
	"polyeurothane",
	"polystyrene"
}

export type Hole = {
	dimensions : Vector3 ;
	position   : Vector3 ;
}

export type Light = {
	position : Vector3 ;
	
}

export type Wall = {
	dimensions : Vector3 ;
  // material   : Material ;
  texture    : {
    url             : string ;
    imageDimensions : Vector2 ;
    realDimensions  : Vector2 ;
  }
  color       : number ;
  edgeColor   : number ;
  holes       : Hole[] ;
}

export const textureScale = (imageDimensions : Vector2, realDimensions : Vector2) : Vector2 => {
  return { 
    x : (realDimensions.x / imageDimensions.x),
    y : (realDimensions.y / imageDimensions.y),
  }
}

export const wall = (wall : Wall) : THREE.Mesh => {

  let texture;
  if (wall.texture) {
    texture = new THREE.TextureLoader().load(wall.texture.url);
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    const _textureScale = textureScale(wall.texture.imageDimensions, wall.texture.realDimensions);
    // console.log("scalePixels", _scalePixels);
    texture.repeat.set(_textureScale.x, _textureScale.y);
    texture.rotation = 0;
  }

	const _wall = new THREE.Mesh(
		new THREE.BoxGeometry(wall.dimensions.x, wall.dimensions.y, wall.dimensions.z), 
    //new THREE.MeshPhongMaterial( { color: wall.color } )
    new THREE.MeshStandardMaterial(texture ? { map: texture } : { color : wall.color })
	);

	_wall.updateMatrix();
	let bspWall = CSG.fromMesh(_wall);
	
	wall.holes.forEach(hole => {
		// const meshB = new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
		const _hole = new THREE.Mesh(new THREE.BoxGeometry(hole.dimensions.x, hole.dimensions.y, hole.dimensions.z));
		_hole.position.add(new THREE.Vector3(hole.position.x, hole.position.y, hole.position.z))
		_hole.updateMatrix();
		const bspHole = CSG.fromMesh(_hole);
		bspWall = bspWall.subtract(bspHole);
	});

  let meshResult = CSG.toMesh(bspWall, _wall.matrix);

	// Set the results material to the material of the first cube.
  meshResult.material = _wall.material;
  
  const wireframe = new THREE.LineSegments( 
    new THREE.EdgesGeometry( meshResult.geometry ), 
    new THREE.LineBasicMaterial( { color: wall.edgeColor } )
  );
  meshResult.add(wireframe);

	return meshResult;
}

export type Component = {
	name : string ;
} 