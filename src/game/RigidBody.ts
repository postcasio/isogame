import { btCollisionShape, btRigidBody } from "ammo.js";
import { Object3D } from "three";

export interface RigidBodyProps {
  isRigidBody: true;
  mass: number;
  collision?: btCollisionShape;
  body: btRigidBody;
  updatePhysicsPosition: () => void
}

export type RigidBody<T> = T & RigidBodyProps;

export function rigidBody<T extends Object3D>(object: T, props: Partial<RigidBodyProps>): RigidBody<T> {
  let body = object as RigidBody<T>;

  body.mass = 0;

  Object.assign(body, props);

  body.isRigidBody = true;

  body.updatePhysicsPosition = () => {
    body.body.getWorldTransform().getOrigin().setValue(body.position.x, body.position.y, body.position.z);
  }
  return body;
}

export function isRigidBody<T extends Object3D>(object: T): object is RigidBody<T> {
  return (object as any).isRigidBody ? true : false;
}
