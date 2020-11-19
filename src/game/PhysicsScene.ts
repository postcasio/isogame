import { Object3D, Scene } from "three";
import { Ammo, btDiscreteDynamicsWorld, btTransform } from 'ammo.js';
import { isRigidBody, RigidBody } from "./RigidBody";
const AmmoFactory = require('ammo.js');

let Ammo: Ammo;

export default class PhysicsScene extends Scene {
  physicsEnabled: boolean = false;
  rigidBodies: RigidBody<Object3D>[] = [];
  world?: btDiscreteDynamicsWorld;
  lastUpdate: number = 0;
  trans?: btTransform;

  constructor() {
    super();
  }

  updatePhysics() {
    if (!this.world) {
      return;
    }

    const now = Date.now();

    const deltaTime = this.lastUpdate ? now - this.lastUpdate : 0;

    let transform = this.trans!;

     // Step world
    this.world.stepSimulation( deltaTime, 1);

    // Update rigid bodies
    for ( let i = 0; i < this.rigidBodies.length; i++ ) {
        let objThree = this.rigidBodies[ i ];
        let objAmmo = objThree.body;

        let ms = objAmmo.getMotionState();
          // SSj.log(ms)
        if ( ms ) {
            ms.getWorldTransform( transform );
            let p = transform.getOrigin();
            let q = transform.getRotation();
            objThree.position.set( p.x(), p.y(), p.z() );
            // SSj.log(`Moved ${objThree.id} to ${objThree.position.toArray()}`);
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
        }
    }

    this.lastUpdate = now;
  }

  async initPhysics() {
    Ammo = await AmmoFactory();
    // SSj.log(Ammo.btDefaultCollisionConfiguration);
      let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
      dispatcher              = new Ammo.btCollisionDispatcher(collisionConfiguration),
      overlappingPairCache    = new Ammo.btDbvtBroadphase(),
      solver                  = new Ammo.btSequentialImpulseConstraintSolver();

    this.world           = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
    this.world.setGravity(new Ammo.btVector3(0, -10, 0));
    this.trans = new Ammo.btTransform();
    // SSj.log(physicsWorld);
  }

  add(...objects: Object3D[]): this {
    super.add(...objects);
    let transform = new Ammo.btTransform();

    for (let object of objects) {
      if (!isRigidBody(object)) {
        continue;
      }

      let {position, quaternion, mass, collision} = object;

      if (!object.collision) {
        continue;
      }
      if (!collision) {
        continue;
      }

      transform.setIdentity();
      transform.setOrigin( new Ammo.btVector3( position.x, position.y, position.z ) );
      transform.setRotation( new Ammo.btQuaternion( quaternion.x, quaternion.y, quaternion.z, quaternion.w ) );
      let motionState = new Ammo.btDefaultMotionState( transform );

      let colShape = collision;

      let localInertia = new Ammo.btVector3( 0, 0, 0 );
      colShape.calculateLocalInertia( mass, localInertia );

      let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
      let body = new Ammo.btRigidBody( rbInfo );


      this.world!.addRigidBody( body, 1, 255 );
      this.rigidBodies.push(object);

      object.body = body;
    }

    return this;
  }

  createCollisionBox(x: number, y: number, z: number) {
    const box = new Ammo.btBoxShape( new Ammo.btVector3( x, y, z ) );
    box.setMargin( 0.05 );

    return box;
  }

  createCollisionPlane(x: number, y: number) {
    return this.createCollisionBox(x, y, 0.2);
  }

  createCollisionSphere(r: number) {
    const box = new Ammo.btSphereShape(r);
    box.setMargin( 0.05 );

    return box;
  }

}
