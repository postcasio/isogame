import { Color as ThreeColor, BoxBufferGeometry, PlaneBufferGeometry, Mesh, MeshBasicMaterial, OrthographicCamera, PerspectiveCamera, Camera, DirectionalLight, SphereBufferGeometry } from 'three';
import PhysicsScene from './PhysicsScene';
import { rigidBody } from './RigidBody';
import Renderer from './SphereRenderer';

// const SHADOWMAP_DEBUG = true;

let shadowMapSizes = [128, 256, 512, 1024, 2048];
let shadowMapSizeIndex = 3;

export default async function test() {
  Surface.Screen.depthOp = DepthOp.LessOrEqual;

  const scene = new PhysicsScene();
  await scene.initPhysics();
  scene.background = new ThreeColor('black');

  // Create a camera
  const fov = 35; // AKA Field of View
  const aspect = Surface.Screen.width / Surface.Screen.height;
  const near = 0.1; // the near clipping plane
  const far = 100; // the far clipping plane

  const d = 20;
  const perspectiveCamera = new PerspectiveCamera(fov, aspect, near, far);
  const orthoCamera = new OrthographicCamera(-d * aspect, d * aspect, d, -d, near, far);

  let camera: Camera = orthoCamera;
  // camera.position.set(20, 20, 20);
  perspectiveCamera.position.set(20, 20, 20);
  perspectiveCamera.lookAt(0, 0, 0);
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);


  const planeGeometry = new PlaneBufferGeometry(50, 50, 50, 50);
  const planeMat = new MeshBasicMaterial({ color: 0xeeeeee, reflectivity: 0.5 });
  const plane = new Mesh(planeGeometry, planeMat);
  plane.rotateX(-Math.PI / 2);
  // plane.rotateZ(Math.PI / 2);
  plane.position.set(0, -0.02, 0);

  scene.add(rigidBody(plane, { mass: 0, collision: scene.createCollisionPlane(25, 25) }));

  // create a geometry
  // const rotatingCube = rigidBody(makeCube(1.8, 3.8, 1.8, true, 0xff55ff), { mass: 1, collision: scene.createCollisionBox(1.8, 3.8, 1.8) })
  // rotatingCube.position.set(1, 5.9, 1);
  const staticCube = rigidBody(makeCube(8, 2, 4, 0.1, 0xffcccc), { mass: 0, collision: scene.createCollisionBox(4, 1, 2)});
  staticCube.position.set(10, 1, 0);
  const staticCubeBig = rigidBody(makeCube(16, 4, 16, 0.1, 0xccffcc), { mass: 0, collision: scene.createCollisionBox(8, 2, 8)});
  staticCubeBig.position.set(14, 2, -10);
  const staticCubeBigger = rigidBody(makeCube(10, 4, 26, 0.1, 0xff4444), { mass: 0, collision: scene.createCollisionBox(5, 2, 13)});
  staticCubeBigger.position.set(-10, 2, -10);


  scene.add( staticCube, staticCubeBig, staticCubeBigger);


  // for (let i = 0; i < 8; i++) {
  //  let cube = rigidBody(makeCube(2, 2, 2, true, 0xffffff), { mass: 1, collision: scene.createCollisionBox(1, 1, 1)});
  //  cube.position.set(Math.random() * 20 - 10, Math.random() * 5 + 20, Math.random() * 20 - 10);
  //  cube.rotation.set(Math.random(), Math.random(), Math.random());
  //  scene.add(cube);
  // }

  // scene.add(...makeLight(0xff0000, -10, 10, 0));
  // scene.add(...makeLight(0x00ff00, 5, 10, 0));
  // scene.add(...makeLight(0x0000ff, 17.5, 10, 7.5));

  // scene.add(...makePointLight(0xffffff, 40, 8, 48, 1));
  // scene.add(...makeDirectionalLight(0xff0000, 20, 12, -50, 0.8));
  // scene.add(...makeDirectionalLight(0x00ff00, 30, 8, 48, 0.5));
  scene.add(...makeDirectionalLight(0x5555ff, 50, 5, 0, 0.8));
  // scene.add(...makeDirectionalLight(0x0000ff, -40, 8, 48, 0.8));
  scene.add(...makeDirectionalLight(0xff5555, 0, 5, 50, 0.8));
  scene.add(...makeDirectionalLight(0x55ff55, 50, 5, 50, 0.8));
  scene.add(...makeDirectionalLight(0xff00ff, 10, 40, 2, 0.2));


  const renderer = new Renderer();


  Dispatch.onUpdate(() => {
    // if (Keyboard.Default.isPressed(Key.Up) || Keyboard.Default.isPressed(Key.W)) {
    //   rotatingCube.position.x -= 0.2;
    //   rotatingCube.position.z -= 0.2;
    // }
    // if (Keyboard.Default.isPressed(Key.Right) || Keyboard.Default.isPressed(Key.D)) {
    //   rotatingCube.position.x += 0.2;
    //   rotatingCube.position.z -= 0.2;
    // }
    // if (Keyboard.Default.isPressed(Key.Down) || Keyboard.Default.isPressed(Key.S)) {
    //   rotatingCube.position.x += 0.2;
    //   rotatingCube.position.z += 0.2;
    // }
    // if (Keyboard.Default.isPressed(Key.Left) || Keyboard.Default.isPressed(Key.A)) {
    //   rotatingCube.position.x -= 0.2;
    //   rotatingCube.position.z += 0.2;
    // }

    // rotatingCube.updatePhysicsPosition();

    let key: Key | null;

    while (key = Keyboard.Default.getKey()) {
      switch (key) {
        case Key.Space:
          if (camera === orthoCamera) {
            camera = perspectiveCamera;
          }
          else if (camera === perspectiveCamera) {
            camera = orthoCamera;
          }
          break;
        case Key.T:
          shadowMapSizeIndex = Math.min(shadowMapSizes.length - 1, shadowMapSizeIndex + 1);
          renderer.setShadowMapSize(shadowMapSizes[shadowMapSizeIndex]);
          break;
        case Key.G:
          shadowMapSizeIndex = Math.max(0, shadowMapSizeIndex - 1);
          renderer.setShadowMapSize(shadowMapSizes[shadowMapSizeIndex]);
          break;
        case Key.C:
          for (let i = 0; i < 5; i++) {
            let cube;
            if (Math.random() < 0.5) {
               cube = rigidBody(makeSphere(1, 1.0, 0xffffff), { mass: 1, collision: scene.createCollisionSphere(1)});
            } else {
               cube = rigidBody(makeCube(2, 2, 2, 1.0, 0xffffff), { mass: 1, collision: scene.createCollisionBox(1, 1, 1)});
            }
            cube.position.set(Math.random() * 20 - 10, Math.random() * 5 + 20, Math.random() * 20 - 10);
            cube.rotation.set(Math.random(), Math.random(), Math.random());
            scene.add(cube);
          }
      }
    }

    // rotatingCube.position.x = 1.5 - Math.sin(Sphere.now() / 100) * 3;
    // rotatingCube.position.z = 1.5 - Math.cos(Sphere.now() / 100) * 3;
    // camera.position.set(20, 20, 20).add(rotatingCube.position);
    // camera.lookAt(rotatingCube.position);

    // rotatingCube.rotateY(0.01);
  });

  Dispatch.onUpdate(async () => {
    scene.updatePhysics();
  }, { priority: -1 });

  Dispatch.onRender(() => {
    renderer.render(scene, camera);

    const otherCamera = camera === orthoCamera ? 'perspective camera' : 'orthographic camera';
    Font.Default.drawText(Surface.Screen, 5, 5, `SPACE: Change to ${otherCamera}`);
    Font.Default.drawText(Surface.Screen, 5, 15, 'W/A/S/D or arrows: Move');
    // Font.Default.drawText(Surface.Screen, 5, 25, `T/G: Increase/decrease shadow map size (${shadowMapSizes[shadowMapSizeIndex]})`);
    Font.Default.drawText(Surface.Screen, 5, 25, `C: Spawn cubes`);
  });
}

function makeCube(width: number, height: number, depth: number, reflectivity: number = 0, color: number = 0xffffff) {
  var mat = new MeshBasicMaterial( { color, reflectivity } );
  const cubeGeometry = new BoxBufferGeometry(width, height, depth);

  return new Mesh(cubeGeometry, mat);
}

function makeSphere(radius: number, reflectivity: number = 0, color: number = 0xffffff) {
  var mat = new MeshBasicMaterial( { color, reflectivity } );
  const sphereGeometry = new SphereBufferGeometry(radius, 16, 16);

  return new Mesh(sphereGeometry, mat);
}

// function makePointLight(color: number, x: number, y: number, z: number, intensity = 1) {
//   const light = new PointLight(color, 1);
//   light.position.set(x, y, z);
//   const lightBox = makeCube(1, 1, 1, true, 0xffffff);
//   lightBox.position.set(x, y, z);
//   const offset = Math.random();
//   Dispatch.onUpdate(() => {
//     light.position.setY(y + Math.sin(Sphere.now() / 100 + offset) * 5 - 2.5);
//     lightBox.position.copy(light.position);
//   });

//   return [light, lightBox];
// }


function makeDirectionalLight(color: number, x: number, y: number, z: number, intensity = 1) {

  const aspect = Surface.Screen.width / Surface.Screen.height;
  const near = 0.005; // the near clipping plane
  const far = 300; // the far clipping plane

  const d = 20;
  const orthoCamera = new OrthographicCamera(-d * aspect, d * aspect, d, -d, near, far);

  const light = new DirectionalLight(color, intensity);
  light.shadow.camera.copy(orthoCamera);
  light.position.set(x, y, z);

  // const lightBox = makeCube(1, 1, 1, true, 0xffffff);
  // lightBox.position.set(x, y, z);
  // const offset = Math.random();
  // Dispatch.onUpdate(() => {
  //   light.position.setY(y + Math.sin(Sphere.now() / 100 + offset) * 5 - 2.5);
  //   lightBox.position.copy(light.position);
  // });

  return [light];
}
