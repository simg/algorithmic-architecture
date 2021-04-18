import * as _ from 'lodash';

import * as THREE from 'three';
import { rotate, translate, group } from '../lib/utils';

import { wall } from '../parts/wall';
import { surface } from '../parts/surface';

export const buildingScene = () : (THREE.Mesh | THREE.Group | THREE.LineSegments)[] => {

  const wallDef1 = {
    dimensions: { x: 7000, y:2400, z:200 },
    color : 0x666666,
    edgeColor: 0x666666,
    texture: {
      url : 'textures/marble1.png',
      imageDimensions : {
        x   : 1024,
        y   : 1024
      },
      realDimensions : {
        x : 1600,
        y : 1600
      }
    },
    holes : [
      { dimensions: { x:762, y:1981, z:200 }, position:{ x:-2000, y:-210, z:0 }},
      { dimensions: { x:3000, y:1200, z:200 }, position:{ x:1500, y:210, z:0 }},
    ]
  };

  const ground = surface({
    dimensions: { x : 50000, y: 1, z: 50000},
    position  : { x: 0, y: 0, z: 0},
    color: 0x115511,
    edgeColor : 0x666666,
    texture:undefined
  });  
  
  const floor = surface({
    dimensions: { x : 20000, y: 100, z: 10000},
    position  : { x: 0, y: 50, z: 0},
    color: 0x666666,
    edgeColor : 0x666666,
    texture: {
      url:"textures/concrete1.png",
      imageDimensions: {x:200, y:200},
      realDimensions: {x:20000, y:10000}
    }
  });

  const level = 
    translate(
      group([
          translate(
            rotate(wall(wallDef1),{x:0, y:0, z:0}),
            { x:-1000, y:1200, z:-3400}
          ),
          translate(
            rotate(wall(wallDef1), {x:0, y:90, z:0}),
            { x:2400, y:1200, z:0}
          ),
          translate(
            rotate(wall(wallDef1), {x:0, y:180, z:0}),
            { x:-1000, y:1200, z:3400}
          ),
          translate(
             rotate(wall(wallDef1), {x:0, y:270, z:0}),
             { x:-4400, y:1200, z:0}
          ),
          translate(
            rotate(wall(wallDef1),{x:0, y:0, z:0}),
            { x:-8000, y:1200, z:3400}
          ),
          translate(
            rotate(wall(wallDef1),{x:0, y:0, z:0}),
            { x:-8000, y:1200, z:-3400}
          ),
          translate(
            rotate(wall(wallDef1),{x:0, y:90, z:0}),
            { x:-11600, y:1200, z:-0}
          ),
          translate(floor.clone(), {x:-4500, y:2600, z:0})
        ]),
        { x: 4500, y: 0, z: -0}
      );

  const building = _.times(5, i => translate(level.clone(), {x:0, y:i*2600, z:0}));

  return [
    ground,
    floor,
    ...building
  ]
}