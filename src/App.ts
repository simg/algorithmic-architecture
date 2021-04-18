import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
  Mesh,
  PointLight,
  DirectionalLight,
  AmbientLight,
  AxesHelper,
  Raycaster,
  Clock,
  Vector3
} from 'three';

//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import Stats from 'stats.js';

import { rotate, translate, saveCamera, loadCamera } from './lib/utils';

import { buildingScene } from './scenes/building';

export default class App {

  wWidth:number;
  wHeight:number;

  scene:Scene;
  objects:Mesh[] = []; 
  camera:PerspectiveCamera;
  renderer:WebGLRenderer;
  //controls:OrbitControls;
  //controls:FirstPersonControls;
  controls:PointerLockControls;
  moveForward  : boolean = false;
  moveBackward : boolean = false;
  moveLeft     : boolean = false;
  moveRight    : boolean = false;
  moveUp       : boolean = false;
  moveDown     : boolean = false;
  canJump      : boolean = false;

  prevTime : any = performance.now();
  velocity : Vector3  = new Vector3();
  direction : Vector3 = new Vector3();

  raycaster : Raycaster;

  light:DirectionalLight;
  ambience:AmbientLight;
  clock:Clock;
  stats:any;

  cube:Mesh;
  axesHelper: AxesHelper;

  get aspect (){
    return this.wWidth / this.wHeight;
  }

  constructor() {

    this.wWidth  = window.innerWidth;
    this.wHeight = window.innerHeight;

    // create Scene
    this.scene = new Scene();

    // set clock
    this.clock = new Clock();

    // let there be light!
    //this.light = new PointLight( 0xffffff, 1, 0 );
    this.light = new DirectionalLight( 0xffffff, 0.5 );
    this.light.target.position.set(0,0, 0);
    this.light.position.set( 50000, 50000, 50000 );
    this.light.castShadow = true;
    this.scene.add( this.light );
    
    this.ambience = new AmbientLight( 0xFFFFFF, 0.3);
    this.scene.add(this.ambience);

    // create Camera
    this.camera = new PerspectiveCamera(75, this.aspect, 0.1, 100000);
    loadCamera(this.camera, 1);
    // this.camera.position.x = 5000;
    // this.camera.position.y = 400;
    // this.camera.position.z = 10000;
    // this.camera.lookAt(new Vector3(0,1000,0));

    // add Stats panel
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild( this.stats.dom );

    this.axesHelper = new AxesHelper(50000);
    this.scene.add( this.axesHelper );

    const things = buildingScene();
    things.forEach(thing => this.add(thing));
 
    this.renderer = new WebGLRenderer({antialias:true});
    this.renderer.setSize( this.wWidth, this.wHeight );
    document.body.appendChild( this.renderer.domElement );

    //create controls


    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);    
    this.controls = new PointerLockControls(this.camera, document.body);

    // this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);
    // this.controls.movementSpeed = 100;
    // this.controls.lookSpeed = 0.2;
    const blocker      = document.getElementById( 'blocker' ),
          instructions = document.getElementById( 'instructions' );

    blocker.addEventListener( 'click', () => {
       this.controls.lock();
    }, false );

    this.controls.addEventListener( 'lock', () =>  {
      instructions.style.display = 'none';
      blocker.style.display = 'none';
    });

    this.controls.addEventListener( 'unlock', () =>  {
      blocker.style.display = 'block';
      instructions.style.display = '';
    });

    this.scene.add( this.controls.getObject() );

    document.addEventListener( 'keydown', ($event) => {
      this.onKeyDown($event);
    }, false );
    document.addEventListener( 'keyup', ($event) => {
      this.onKeyUp($event);
    }, false );

    this.raycaster = new Raycaster( new Vector3(), new Vector3( 0, - 1, 0 ), 0, 10 );

    // add Events Global
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false);

    this.animate();
  }

  onKeyDown(event) {
//console.log("keyDown", event.keyCode)
    const _keymap = this.keymap(event);
    switch ( _keymap ) {
      case '38': // up
      case '87': // w
        this.moveForward = true;
        break;

      case '37': // left
      case '65': // a
        this.moveLeft = true;
        break;

      case '40': // down
      case '83': // s
        this.moveBackward = true;
        break;

      case '39': // right
      case '68': // d
        this.moveRight = true;
        break;

      case '33': //pg up
      case '69': // e
        this.moveUp = true;
        break;

      case '34': //pg up
      case '67': // c
        this.moveDown = true;
        break;

      case '32': // space
        if ( this.canJump === true ) this.velocity.y += 3500;
        this.canJump = false;
        break;
      case 'c49': // ctrl-1
        saveCamera(this.camera, 1);
        break;
      default:
        console.log("unrecognised keycode", _keymap);
    }

  }

  onKeyUp(event) {

    const _keymap = this.keymap(event);
    switch ( _keymap ) {

      case '38': // up
      case '87': // w
        this.moveForward = false;
        break;

      case '37': // left
      case '65': // a
        this.moveLeft = false;
        break;

      case '40': // down
      case '83': // s
        this.moveBackward = false;
        break;

      case '39': // right
      case '68': // d
        this.moveRight = false;
        break;

      case '33': //pg up
      case '69': // e
        this.moveUp = false;
        break;

      case '34': //pg up
      case '67': // c
        this.moveDown = false;
        break;        

    }

  }

  keymap(event) {
    return `${event.ctrlKey ? 'c':''}${event.shiftKey ? 's':''}${event.which}`;
  }

  add(thing : any) {
    this.scene.add(thing);
    this.objects.push(thing);
  }

  onWindowResize() {
    this.wWidth  = window.innerWidth;
    this.wHeight = window.innerHeight;

    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.wWidth, this.wHeight);
  }

  animate() {
    //this.cube.rotation.y += 0.01;
    //this.cube.rotation.x += 0.02;
    requestAnimationFrame(this.animate.bind(this));

    this.stats.begin();
//console.log("this.controls.isLocked", this.controls.isLocked);
    if (true || this.controls.isLocked) {

      this.raycaster.ray.origin.copy( this.controls.getObject().position );
      this.raycaster.ray.origin.y -= 10;

      const intersections = this.raycaster.intersectObjects( this.objects );

      const onObject = intersections.length > 0,
            time     = performance.now(),
            delta    = ( time - this.prevTime ) / 1000;

      this.velocity.x -= this.velocity.x * 10.0 * delta;
      this.velocity.y -= this.velocity.y * 10.0 * delta;
      this.velocity.z -= this.velocity.z * 10.0 * delta;

      //this.velocity.y -= (9.8 * 1000 * delta); // 100.0 = mass

      this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
      this.direction.y = Number( this.moveDown ) - Number( this.moveUp );
      this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
      this.direction.normalize(); // this ensures consistent movements in all directions

      
      if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 50000 * delta;
      if ( this.moveUp || this.moveDown ) this.velocity.y -= this.direction.y * 50000 * delta;
      if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 50000 * delta;

      // if ( onObject === true ) {
      //   this.velocity.y = Math.max( 0, this.velocity.y);
      //   this.canJump = true;
      // }

      this.controls.moveRight( - this.velocity.x * delta );
      this.controls.moveForward( - this.velocity.z * delta );

      this.controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior

      // if ( this.controls.getObject().position.y < 1200 ) {
      //   this.velocity.y = 0;
      //   this.controls.getObject().position.y = 1200;
      //   this.canJump = true;
      // }

      this.prevTime = time;
    }

    //this.controls.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
  }
}