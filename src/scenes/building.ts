import * as _ from 'lodash';

import { rotate, translate, group } from '../lib/utils';

import { wall } from '../parts/wall';
import { surface } from '../parts/surface';

export function buildingScene() : (THREE.Mesh | THREE.Group)[] {

  const wallDef1 = {
    dimensions: { x: 7000, y:2400, z:200 },
    color : 0x666666,
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

  const building = [
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
          )          
        ]),
        { x: 1500, y: 100, z: -500}
      )
    ];

  const floor = surface({
    dimensions: { x : 10000, y: 100, z: 10000},
    position  : { x: 0, y: 50, z: 0},
    color: 0x666666,
    texture:""    
  });

  const ground = surface({
    dimensions: { x : 50000, y: 1, z: 50000},
    position  : { x: 0, y: 0, z: 0},
    color: 0x115511,
    texture:""
  });

  return [
    ...building,
    floor,
    ground
  ]
}