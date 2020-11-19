declare module "ammo.js" {
  export default function AmmoFactory(): Promise<typeof Ammo>;

  export enum PHY_ScalarType {
    PHY_FLOAT,
    PHY_DOUBLE,
    PHY_INTEGER,
    PHY_SHORT,
    PHY_FIXEDPOINT88,
    PHY_UCHAR
  }

  export type VoidPtr = number;

  export enum btConstraintParams {
    BT_CONSTRAINT_ERP,
    BT_CONSTRAINT_STOP_ERP,
    BT_CONSTRAINT_CFM,
    BT_CONSTRAINT_STOP_CFM
  }

  export type Type =
      | btIDebugDraw
      | DebugDrawer
      | btVector3
      | btVector4
      | btQuadWord
      | btQuaternion
      | btMatrix3x3
      | btTransform
      | btMotionState
      | btDefaultMotionState
      | btCollisionObject
      | btCollisionObjectWrapper
      | RayResultCallback
      | ClosestRayResultCallback
      | btConstCollisionObjectArray
      | btScalarArray
      | AllHitsRayResultCallback
      | btManifoldPoint
      | ContactResultCallback
      | ConcreteContactResultCallback
      | LocalShapeInfo
      | LocalConvexResult
      | ConvexResultCallback
      | ClosestConvexResultCallback
      | btCollisionShape
      | btConvexShape
      | btConvexTriangleMeshShape
      | btBoxShape
      | btCapsuleShape
      | btCapsuleShapeX
      | btCapsuleShapeZ
      | btCylinderShape
      | btCylinderShapeX
      | btCylinderShapeZ
      | btSphereShape
      | btMultiSphereShape
      | btConeShape
      | btConeShapeX
      | btConeShapeZ
      | btIntArray
      | btFace
      | btVector3Array
      | btFaceArray
      | btConvexPolyhedron
      | btConvexHullShape
      | btShapeHull
      | btCompoundShape
      | btStridingMeshInterface
      | btIndexedMesh
      | btIndexedMeshArray
      | btTriangleMesh
      | btConcaveShape
      | btEmptyShape
      | btStaticPlaneShape
      | btTriangleMeshShape
      | btBvhTriangleMeshShape
      | btHeightfieldTerrainShape
      | btDefaultCollisionConstructionInfo
      | btDefaultCollisionConfiguration
      | btPersistentManifold
      | btDispatcher
      | btCollisionDispatcher
      | btOverlappingPairCallback
      | btOverlappingPairCache
      | btAxisSweep3
      | btBroadphaseInterface
      | btCollisionConfiguration
      | btDbvtBroadphase
      | btBroadphaseProxy
      | btRigidBodyConstructionInfo
      | btRigidBody
      | btConstraintSetting
      | btTypedConstraint
      | btPoint2PointConstraint
      | btGeneric6DofConstraint
      | btGeneric6DofSpringConstraint
      | btSequentialImpulseConstraintSolver
      | btConeTwistConstraint
      | btHingeConstraint
      | btSliderConstraint
      | btFixedConstraint
      | btConstraintSolver
      | btDispatcherInfo
      | btCollisionWorld
      | btContactSolverInfo
      | btDynamicsWorld
      | btDiscreteDynamicsWorld
      | btVehicleTuning
      | btVehicleRaycasterResult
      | btVehicleRaycaster
      | btDefaultVehicleRaycaster
      | RaycastInfo
      | btWheelInfoConstructionInfo
      | btWheelInfo
      | btActionInterface
      | btKinematicCharacterController
      | btRaycastVehicle
      | btGhostObject
      | btPairCachingGhostObject
      | btGhostPairCallback
      | btSoftBodyWorldInfo
      | Node
      | tNodeArray
      | Material
      | tMaterialArray
      | Anchor
      | tAnchorArray
      | Config
      | btSoftBody
      | btSoftBodyRigidBodyCollisionConfiguration
      | btSoftBodySolver
      | btDefaultSoftBodySolver
      | btSoftBodyArray
      | btSoftRigidDynamicsWorld
      | btSoftBodyHelpers;

  export interface btIDebugDraw {
      drawLine(from: btVector3, to: btVector3, color: btVector3): void;
      drawContactPoint(
        pointOnB: btVector3,
        normalOnB: btVector3,
        distance: number,
        lifeTime: number,
        color: btVector3
      ): void;
      reportErrorWarning(warningString: string): void;
      draw3dText(location: btVector3, textString: string): void;
      setDebugMode(debugMode: number): void;
      getDebugMode(): number;
    }

  export class DebugDrawer implements btIDebugDraw {
      constructor();
      drawLine(from: btVector3, to: btVector3, color: btVector3): void;
      drawContactPoint(
        pointOnB: btVector3,
        normalOnB: btVector3,
        distance: number,
        lifeTime: number,
        color: btVector3
      ): void;
      reportErrorWarning(warningString: string): void;
      draw3dText(location: btVector3, textString: string): void;
      setDebugMode(debugMode: number): void;
      getDebugMode(): number;
    }

    export class btVector3 {
      constructor();
      constructor(x: number, y: number, z: number);
      length(): number;
      x(): number;
      y(): number;
      z(): number;
      setX(x: number): void;
      setY(y: number): void;
      setZ(z: number): void;
      setValue(x: number, y: number, z: number): void;
      normalize(): void;
      rotate(wAxis: btVector3, angle: number): btVector3;
      dot(v: btVector3): number;
      op_mul(x: number): btVector3;
      op_add(v: btVector3): btVector3;
      op_sub(v: btVector3): btVector3;
    }

    export class btVector4 extends btVector3 {
      constructor();
      constructor(x: number, y: number, z: number, w: number);
      w(): number;
      setValue(x: number, y: number, z: number): void;
      setValue(x: number, y: number, z: number, w: number): void;
    }

    export class btQuadWord {
      x(): number;
      y(): number;
      z(): number;
      w(): number;
      setX(x: number): void;
      setY(y: number): void;
      setZ(z: number): void;
      setW(w: number): void;
    }

    export class btQuaternion extends btQuadWord {
      constructor(x: number, y: number, z: number, w: number);
      setValue(x: number, y: number, z: number, w: number): void;
      setEulerZYX(z: number, y: number, x: number): void;
      setRotation(axis: btVector3, angle: number): void;
      normalize(): void;
      length2(): number;
      length(): number;
      dot(q: btQuaternion): number;
      normalized(): btQuaternion;
      getAxis(): btVector3;
      inverse(): btQuaternion;
      getAngle(): number;
      getAngleShortestPath(): number;
      angle(q: btQuaternion): number;
      angleShortestPath(q: btQuaternion): number;
      op_add(q: btQuaternion): btQuaternion;
      op_sub(q: btQuaternion): btQuaternion;
      op_mul(s: number): btQuaternion;
      op_mulq(q: btQuaternion): btQuaternion;
      op_div(s: number): btQuaternion;
    }

    export class btMatrix3x3 {
      setEulerZYX(ex: number, ey: number, ez: number): void;
      getRotation(q: btQuaternion): void;
      getRow(y: number): btVector3;
    }

    export class btTransform {
      constructor();
      constructor(q: btQuaternion, v: btVector3);
      setIdentity(): void;
      setOrigin(origin: btVector3): void;
      setRotation(rotation: btQuaternion): void;
      getOrigin(): btVector3;
      getRotation(): btQuaternion;
      getBasis(): btMatrix3x3;
      setFromOpenGLMatrix(m: number[]): void;
      inverse(): btTransform;
      op_mul(t: btTransform): btTransform;
    }

    export class btMotionState {
      getWorldTransform(worldTrans: btTransform): void;
      setWorldTransform(worldTrans: btTransform): void;
    }

    export class btDefaultMotionState extends btMotionState {
      constructor(startTrans?: btTransform, centerOfMassOffset?: btTransform);
      m_graphicsWorldTrans: btTransform;
    }

    export class btCollisionObject {
      setAnisotropicFriction(
        anisotropicFriction: btVector3,
        frictionMode: number
      ): void;
      getCollisionShape(): btCollisionShape;
      setContactProcessingThreshold(contactProcessingThreshold: number): void;
      setActivationState(newState: number): void;
      forceActivationState(newState: number): void;
      activate(forceActivation?: boolean): void;
      isActive(): boolean;
      isKinematicObject(): boolean;
      isStaticObject(): boolean;
      isStaticOrKinematicObject(): boolean;
      getRestitution(): number;
      getFriction(): number;
      getRollingFriction(): number;
      setRestitution(rest: number): void;
      setFriction(frict: number): void;
      setRollingFriction(frict: number): void;
      getWorldTransform(): btTransform;
      getCollisionFlags(): number;
      setCollisionFlags(flags: number): void;
      setWorldTransform(worldTrans: btTransform): void;
      setCollisionShape(collisionShape: btCollisionShape): void;
      setCcdMotionThreshold(ccdMotionThreshold: number): void;
      setCcdSweptSphereRadius(radius: number): void;
      getUserIndex(): number;
      setUserIndex(index: number): void;
      getUserPointer(): VoidPtr;
      setUserPointer(userPointer: VoidPtr): void;
      getBroadphaseHandle(): btBroadphaseProxy;
    }

    export class btCollisionObjectWrapper {
      getWorldTransform(): btTransform;
      getCollisionObject(): btCollisionObject;
      getCollisionShape(): btCollisionShape;
    }

    export class RayResultCallback {
      hasHit(): boolean;
      m_collisionFilterGroup: number;
      m_collisionFilterMask: number;
      m_closestHitFraction: number;
      m_collisionObject: btCollisionObject;
    }

    export class ClosestRayResultCallback extends RayResultCallback {
      constructor(from: btVector3, to: btVector3);
      m_rayFromWorld: btVector3;
      m_rayToWorld: btVector3;
      m_hitNormalWorld: btVector3;
      m_hitPointWorld: btVector3;
    }

    export class btConstCollisionObjectArray {
      size(): number;
      at(n: number): btCollisionObject;
    }

    export class btScalarArray {
      size(): number;
      at(n: number): number;
    }

    export class AllHitsRayResultCallback extends RayResultCallback {
      constructor(from: btVector3, to: btVector3);
      m_collisionObjects: btConstCollisionObjectArray;
      m_rayFromWorld: btVector3;
      m_rayToWorld: btVector3;
      m_hitNormalWorld: btVector3Array;
      m_hitPointWorld: btVector3Array;
      m_hitFractions: btScalarArray;
    }

    export class btManifoldPoint {
      getPositionWorldOnA(): btVector3;
      getPositionWorldOnB(): btVector3;
      getAppliedImpulse(): number;
      getDistance(): number;
      m_localPointA: btVector3;
      m_localPointB: btVector3;
      m_positionWorldOnB: btVector3;
      m_positionWorldOnA: btVector3;
      m_normalWorldOnB: btVector3;
      m_userPersistentData: any;
    }

    export class ContactResultCallback {
      addSingleResult(
        cp: btManifoldPoint,
        colObj0Wrap: btCollisionObjectWrapper,
        partId0: number,
        index0: number,
        colObj1Wrap: btCollisionObjectWrapper,
        partId1: number,
        index1: number
      ): number;
    }

    export class ConcreteContactResultCallback extends ContactResultCallback {
      constructor();
      addSingleResult(
        cp: btManifoldPoint,
        colObj0Wrap: btCollisionObjectWrapper,
        partId0: number,
        index0: number,
        colObj1Wrap: btCollisionObjectWrapper,
        partId1: number,
        index1: number
      ): number;
    }

    export class LocalShapeInfo {
      m_shapePart: number;
      m_triangleIndex: number;
    }

    export class LocalConvexResult {
      constructor(
        hitCollisionObject: btCollisionObject,
        localShapeInfo: LocalShapeInfo,
        hitNormalLocal: btVector3,
        hitPointLocal: btVector3,
        hitFraction: number
      );
      m_hitCollisionObject: btCollisionObject;
      m_localShapeInfo: LocalShapeInfo;
      m_hitNormalLocal: btVector3;
      m_hitPointLocal: btVector3;
      m_hitFraction: number;
    }

    export class ConvexResultCallback {
      hasHit(): boolean;
      m_collisionFilterGroup: number;
      m_collisionFilterMask: number;
      m_closestHitFraction: number;
    }

    export class ClosestConvexResultCallback extends ConvexResultCallback {
      constructor(convexFromWorld: btVector3, convexToWorld: btVector3);
      m_convexFromWorld: btVector3;
      m_convexToWorld: btVector3;
      m_hitNormalWorld: btVector3;
      m_hitPointWorld: btVector3;
    }

    export class btCollisionShape {
      setLocalScaling(scaling: btVector3): void;
      getLocalScaling(): btVector3;
      calculateLocalInertia(mass: number, inertia: btVector3): void;
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btConvexShape extends btCollisionShape {}

    export class btConvexTriangleMeshShape extends btConvexShape {
      constructor(meshInterface: btStridingMeshInterface, calcAabb?: boolean);
    }

    export class btBoxShape extends btCollisionShape {
      constructor(boxHalfExtents: btVector3);
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btCapsuleShape extends btCollisionShape {
      constructor(radius: number, height: number);
      setMargin(margin: number): void;
      getMargin(): number;
      getUpAxis(): number;
      getRadius(): number;
      getHalfHeight(): number;
    }

    export class btCapsuleShapeX extends btCapsuleShape {
      constructor(radius: number, height: number);
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btCapsuleShapeZ extends btCapsuleShape {
      constructor(radius: number, height: number);
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btCylinderShape extends btCollisionShape {
      constructor(halfExtents: btVector3);
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btCylinderShapeX extends btCylinderShape {
      constructor(halfExtents: btVector3);
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btCylinderShapeZ extends btCylinderShape {
      constructor(halfExtents: btVector3);
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btSphereShape extends btCollisionShape {
      constructor(radius: number);
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btMultiSphereShape extends btCollisionShape {
      constructor(positions: btVector3, radii: number[], numPoints: number);
    }

    export class btConeShape extends btCollisionShape {
      constructor(radius: number, height: number);
    }

    export class btConeShapeX extends btConeShape {
      constructor(radius: number, height: number);
    }

    export class btConeShapeZ extends btConeShape {
      constructor(radius: number, height: number);
    }

    export class btIntArray {
      size(): number;
      at(n: number): number;
    }

    export class btFace {
      m_indices: btIntArray;
      m_plane: number[];
    }

    export class btVector3Array {
      size(): number;
      at(n: number): btVector3;
    }

    export class btFaceArray {
      size(): number;
      at(n: number): btFace;
    }

    export class btConvexPolyhedron {
      m_vertices: btVector3Array;
      m_faces: btFaceArray;
    }

    export class btConvexHullShape extends btCollisionShape {
      constructor(points?: number[], numPoints?: number);
      addPoint(point: btVector3, recalculateLocalAABB?: boolean): void;
      setMargin(margin: number): void;
      getMargin(): number;
      getNumVertices(): number;
      initializePolyhedralFeatures(shiftVerticesByMargin: number): boolean;
      recalcLocalAabb(): void;
      getConvexPolyhedron(): btConvexPolyhedron;
    }

    export class btShapeHull {
      constructor(shape: btConvexShape);
      buildHull(margin: number): boolean;
      numVertices(): number;
      getVertexPointer(): btVector3;
    }

    export class btCompoundShape extends btCollisionShape {
      constructor(enableDynamicAabbTree?: boolean);
      addChildShape(localTransform: btTransform, shape: btCollisionShape): void;
      removeChildShape(shape: btCollisionShape): void;
      removeChildShapeByIndex(childShapeindex: number): void;
      getNumChildShapes(): number;
      getChildShape(index: number): btCollisionShape;
      updateChildTransform(
        childIndex: number,
        newChildTransform: btTransform,
        shouldRecalculateLocalAabb?: boolean
      ): void;
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btStridingMeshInterface {
      setScaling(scaling: btVector3): void;
    }

    export class btIndexedMesh {
      m_numTriangles: number;
    }

    export class btIndexedMeshArray {
      size(): number;
      at(n: number): btIndexedMesh;
    }

    export class btTriangleMesh extends btStridingMeshInterface {
      constructor(use32bitIndices?: boolean, use4componentVertices?: boolean);
      addTriangle(
        vertex0: btVector3,
        vertex1: btVector3,
        vertex2: btVector3,
        removeDuplicateVertices?: boolean
      ): void;
      findOrAddVertex(
        vertex: btVector3,
        removeDuplicateVertices: boolean
      ): number;
      addIndex(index: number): void;
      getIndexedMeshArray(): btIndexedMeshArray;
    }

    export class btConcaveShape extends btCollisionShape {}

    export class btEmptyShape extends btConcaveShape {
      constructor();
    }

    export class btStaticPlaneShape extends btConcaveShape {
      constructor(planeNormal: btVector3, planeConstant: number);
    }

    export class btTriangleMeshShape extends btConcaveShape {}

    export class btBvhTriangleMeshShape extends btTriangleMeshShape {
      constructor(
        meshInterface: btStridingMeshInterface,
        useQuantizedAabbCompression: boolean,
        buildBvh?: boolean
      );
    }

    export class btHeightfieldTerrainShape extends btConcaveShape {
      constructor(
        heightStickWidth: number,
        heightStickLength: number,
        heightfieldData: VoidPtr,
        heightScale: number,
        minHeight: number,
        maxHeight: number,
        upAxis: number,
        hdt: PHY_ScalarType,
        flipQuadEdges: boolean
      );
      setMargin(margin: number): void;
      getMargin(): number;
    }

    export class btDefaultCollisionConstructionInfo {
      constructor();
    }

    export class btDefaultCollisionConfiguration {
      constructor(info?: btDefaultCollisionConstructionInfo);
    }

    export class btPersistentManifold {
      constructor();
      getBody0(): btCollisionObject;
      getBody1(): btCollisionObject;
      getNumContacts(): number;
      getContactPoint(index: number): btManifoldPoint;
    }

    export class btDispatcher {
      getNumManifolds(): number;
      getManifoldByIndexInternal(index: number): btPersistentManifold;
    }

    export class btCollisionDispatcher extends btDispatcher {
      constructor(conf: btDefaultCollisionConfiguration);
    }

    export class btOverlappingPairCallback {}

    export class btOverlappingPairCache {
      setInternalGhostPairCallback(
        ghostPairCallback: btOverlappingPairCallback
      ): void;
      getNumOverlappingPairs(): number;
    }

    export class btAxisSweep3 {
      constructor(
        worldAabbMin: btVector3,
        worldAabbMax: btVector3,
        maxHandles?: number,
        pairCache?: btOverlappingPairCache,
        disableRaycastAccelerator?: boolean
      );
    }

    export class btBroadphaseInterface {
      getOverlappingPairCache(): btOverlappingPairCache;
    }

    export class btCollisionConfiguration {}

    export class btDbvtBroadphase {
      constructor();

      getOverlappingPairCache(): btOverlappingPairCache;
    }

    export class btBroadphaseProxy {
      m_collisionFilterGroup: number;
      m_collisionFilterMask: number;
    }

    export class btRigidBodyConstructionInfo {
      constructor(
        mass: number,
        motionState: btMotionState,
        collisionShape: btCollisionShape,
        localInertia?: btVector3
      );
      m_linearDamping: number;
      m_angularDamping: number;
      m_friction: number;
      m_rollingFriction: number;
      m_restitution: number;
      m_linearSleepingThreshold: number;
      m_angularSleepingThreshold: number;
      m_additionalDamping: boolean;
      m_additionalDampingFactor: number;
      m_additionalLinearDampingThresholdSqr: number;
      m_additionalAngularDampingThresholdSqr: number;
      m_additionalAngularDampingFactor: number;
    }

    export class btRigidBody extends btCollisionObject {
      constructor(constructionInfo: btRigidBodyConstructionInfo);
      getCenterOfMassTransform(): btTransform;
      setCenterOfMassTransform(xform: btTransform): void;
      setSleepingThresholds(linear: number, angular: number): void;
      getLinearDamping(): number;
      getAngularDamping(): number;
      setDamping(lin_damping: number, ang_damping: number): void;
      setMassProps(mass: number, inertia: btVector3): void;
      getLinearFactor(): btVector3;
      setLinearFactor(linearFactor: btVector3): void;
      applyTorque(torque: btVector3): void;
      applyLocalTorque(torque: btVector3): void;
      applyForce(force: btVector3, rel_pos: btVector3): void;
      applyCentralForce(force: btVector3): void;
      applyCentralLocalForce(force: btVector3): void;
      applyTorqueImpulse(torque: btVector3): void;
      applyImpulse(impulse: btVector3, rel_pos: btVector3): void;
      applyCentralImpulse(impulse: btVector3): void;
      updateInertiaTensor(): void;
      getLinearVelocity(): btVector3;
      getAngularVelocity(): btVector3;
      setLinearVelocity(lin_vel: btVector3): void;
      setAngularVelocity(ang_vel: btVector3): void;
      getMotionState(): btMotionState;
      setMotionState(motionState: btMotionState): void;
      getAngularFactor(): btVector3;
      setAngularFactor(angularFactor: btVector3): void;
      upcast(colObj: btCollisionObject): btRigidBody;
      getAabb(aabbMin: btVector3, aabbMax: btVector3): void;
      applyGravity(): void;
      getGravity(): btVector3;
      setGravity(acceleration: btVector3): void;
      getBroadphaseProxy(): btBroadphaseProxy;
    }

    export class btConstraintSetting {
      constructor();
      m_tau: number;
      m_damping: number;
      m_impulseClamp: number;
    }

    export class btTypedConstraint {
      enableFeedback(needsFeedback: boolean): void;
      getBreakingImpulseThreshold(): number;
      setBreakingImpulseThreshold(threshold: number): void;
      getParam(num: number, axis: number): number;
      setParam(num: number, value: number, axis: number): void;
    }

    export class btPoint2PointConstraint extends btTypedConstraint {
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        pivotInA: btVector3,
        pivotInB: btVector3
      );
      constructor(rbA: btRigidBody, pivotInA: btVector3);
      setPivotA(pivotA: btVector3): void;
      setPivotB(pivotB: btVector3): void;
      getPivotInA(): btVector3;
      getPivotInB(): btVector3;
      m_setting: btConstraintSetting;
    }

    export class btGeneric6DofConstraint extends btTypedConstraint {
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        frameInA: btTransform,
        frameInB: btTransform,
        useLinearFrameReferenceFrameA: boolean
      );
      constructor(
        rbB: btRigidBody,
        frameInB: btTransform,
        useLinearFrameReferenceFrameB: boolean
      );
      setLinearLowerLimit(linearLower: btVector3): void;
      setLinearUpperLimit(linearUpper: btVector3): void;
      setAngularLowerLimit(angularLower: btVector3): void;
      setAngularUpperLimit(angularUpper: btVector3): void;
      getFrameOffsetA(): btTransform;
    }

    export class btGeneric6DofSpringConstraint extends btGeneric6DofConstraint {
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        frameInA: btTransform,
        frameInB: btTransform,
        useLinearFrameReferenceFrameA: boolean
      );
      constructor(
        rbB: btRigidBody,
        frameInB: btTransform,
        useLinearFrameReferenceFrameB: boolean
      );
      enableSpring(index: number, onOff: boolean): void;
      setStiffness(index: number, stiffness: number): void;
      setDamping(index: number, damping: number): void;
      setEquilibriumPoint(index: number, val: number): void;
      setEquilibriumPoint(index: number): void;
      setEquilibriumPoint(): void;
    }

    export class btSequentialImpulseConstraintSolver {
      constructor();
    }

    export class btConeTwistConstraint extends btTypedConstraint {
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        rbAFrame: btTransform,
        rbBFrame: btTransform
      );
      constructor(rbA: btRigidBody, rbAFrame: btTransform);
      setLimit(limitIndex: number, limitValue: number): void;
      setAngularOnly(angularOnly: boolean): void;
      setDamping(damping: number): void;
      enableMotor(b: boolean): void;
      setMaxMotorImpulse(maxMotorImpulse: number): void;
      setMaxMotorImpulseNormalized(maxMotorImpulse: number): void;
      setMotorTarget(q: btQuaternion): void;
      setMotorTargetInConstraintSpace(q: btQuaternion): void;
    }

    export class btHingeConstraint extends btTypedConstraint {
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        pivotInA: btVector3,
        pivotInB: btVector3,
        axisInA: btVector3,
        axisInB: btVector3,
        useReferenceFrameA?: boolean
      );
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        rbAFrame: btTransform,
        rbBFrame: btTransform,
        useReferenceFrameA?: boolean
      );
      constructor(
        rbA: btRigidBody,
        rbAFrame: btTransform,
        useReferenceFrameA?: boolean
      );
      setLimit(
        low: number,
        high: number,
        softness: number,
        biasFactor: number,
        relaxationFactor?: number
      ): void;
      enableAngularMotor(
        enableMotor: boolean,
        targetVelocity: number,
        maxMotorImpulse: number
      ): void;
      setAngularOnly(angularOnly: boolean): void;
      enableMotor(enableMotor: boolean): void;
      setMaxMotorImpulse(maxMotorImpulse: number): void;
      setMotorTarget(targetAngle: number, dt: number): void;
    }

    export class btSliderConstraint extends btTypedConstraint {
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        frameInA: btTransform,
        frameInB: btTransform,
        useLinearReferenceFrameA: boolean
      );
      constructor(
        rbB: btRigidBody,
        frameInB: btTransform,
        useLinearReferenceFrameA: boolean
      );
      setLowerLinLimit(lowerLimit: number): void;
      setUpperLinLimit(upperLimit: number): void;
      setLowerAngLimit(lowerAngLimit: number): void;
      setUpperAngLimit(upperAngLimit: number): void;
    }

    export class btFixedConstraint extends btTypedConstraint {
      constructor(
        rbA: btRigidBody,
        rbB: btRigidBody,
        frameInA: btTransform,
        frameInB: btTransform
      );
    }

    export class btConstraintSolver {}

    export class btDispatcherInfo {
      m_timeStep: number;
      m_stepCount: number;
      m_dispatchFunc: number;
      m_timeOfImpact: number;
      m_useContinuous: boolean;
      m_enableSatConvex: boolean;
      m_enableSPU: boolean;
      m_useEpa: boolean;
      m_allowedCcdPenetration: number;
      m_useConvexConservativeDistanceUtil: boolean;
      m_convexConservativeDistanceThreshold: number;
    }

    export class btCollisionWorld {
      getDispatcher(): btDispatcher;
      rayTest(
        rayFromWorld: btVector3,
        rayToWorld: btVector3,
        resultCallback: RayResultCallback
      ): void;
      getPairCache(): btOverlappingPairCache;
      getDispatchInfo(): btDispatcherInfo;
      addCollisionObject(
        collisionObject: btCollisionObject,
        collisionFilterGroup?: number,
        collisionFilterMask?: number
      ): void;
      removeCollisionObject(collisionObject: btCollisionObject): void;
      getBroadphase(): btBroadphaseInterface;
      convexSweepTest(
        castShape: btConvexShape,
        from: btTransform,
        to: btTransform,
        resultCallback: ConvexResultCallback,
        allowedCcdPenetration: number
      ): void;
      contactPairTest(
        colObjA: btCollisionObject,
        colObjB: btCollisionObject,
        resultCallback: ContactResultCallback
      ): void;
      contactTest(
        colObj: btCollisionObject,
        resultCallback: ContactResultCallback
      ): void;
      updateSingleAabb(colObj: btCollisionObject): void;
      setDebugDrawer(debugDrawer: btIDebugDraw): void;
      getDebugDrawer(): btIDebugDraw;
      debugDrawWorld(): void;
      debugDrawObject(
        worldTransform: btTransform,
        shape: btCollisionShape,
        color: btVector3
      ): void;
    }

    export class btContactSolverInfo {
      m_splitImpulse: boolean;
      m_splitImpulsePenetrationThreshold: number;
      m_numIterations: number;
    }

    export class btDynamicsWorld extends btCollisionWorld {
      addAction(action: btActionInterface): void;
      removeAction(action: btActionInterface): void;
      getSolverInfo(): btContactSolverInfo;
    }

    export class btDiscreteDynamicsWorld extends btDynamicsWorld {
      constructor(
        dispatcher: btDispatcher,
        pairCache: btBroadphaseInterface,
        constraintSolver: btConstraintSolver,
        collisionConfiguration: btCollisionConfiguration
      );
      setGravity(gravity: btVector3): void;
      getGravity(): btVector3;
      addRigidBody(body: btRigidBody): void;
      addRigidBody(body: btRigidBody, group: number, mask: number): void;
      removeRigidBody(body: btRigidBody): void;
      addConstraint(
        constraint: btTypedConstraint,
        disableCollisionsBetweenLinkedBodies?: boolean
      ): void;
      removeConstraint(constraint: btTypedConstraint): void;
      stepSimulation(
        timeStep: number,
        maxSubSteps?: number,
        fixedTimeStep?: number
      ): number;
      setContactAddedCallback(funcpointer: number): void;
      setContactProcessedCallback(funcpointer: number): void;
      setContactDestroyedCallback(funcpointer: number): void;
    }

    export class btVehicleTuning {
      constructor();
      m_suspensionStiffness: number;
      m_suspensionCompression: number;
      m_suspensionDamping: number;
      m_maxSuspensionTravelCm: number;
      m_frictionSlip: number;
      m_maxSuspensionForce: number;
    }

    export class btVehicleRaycasterResult {
      m_hitPointInWorld: btVector3;
      m_hitNormalInWorld: btVector3;
      m_distFraction: number;
    }

    export class btVehicleRaycaster {
      castRay(
        from: btVector3,
        to: btVector3,
        result: btVehicleRaycasterResult
      ): void;
    }

    export class btDefaultVehicleRaycaster extends btVehicleRaycaster {
      constructor(world: btDynamicsWorld);
    }

    export class RaycastInfo {
      m_contactNormalWS: btVector3;
      m_contactPointWS: btVector3;
      m_suspensionLength: number;
      m_hardPointWS: btVector3;
      m_wheelDirectionWS: btVector3;
      m_wheelAxleWS: btVector3;
      m_isInContact: boolean;
      m_groundObject: any;
    }

    export class btWheelInfoConstructionInfo {
      m_chassisConnectionCS: btVector3;
      m_wheelDirectionCS: btVector3;
      m_wheelAxleCS: btVector3;
      m_suspensionRestLength: number;
      m_maxSuspensionTravelCm: number;
      m_wheelRadius: number;
      m_suspensionStiffness: number;
      m_wheelsDampingCompression: number;
      m_wheelsDampingRelaxation: number;
      m_frictionSlip: number;
      m_maxSuspensionForce: number;
      m_bIsFrontWheel: boolean;
    }

    export class btWheelInfo {
      m_suspensionStiffness: number;
      m_frictionSlip: number;
      m_engineForce: number;
      m_rollInfluence: number;
      m_suspensionRestLength1: number;
      m_wheelsRadius: number;
      m_wheelsDampingCompression: number;
      m_wheelsDampingRelaxation: number;
      m_steering: number;
      m_maxSuspensionForce: number;
      m_maxSuspensionTravelCm: number;
      m_wheelsSuspensionForce: number;
      m_bIsFrontWheel: boolean;
      m_raycastInfo: RaycastInfo;
      m_chassisConnectionPointCS: btVector3;
      constructor(ci: btWheelInfoConstructionInfo);
      getSuspensionRestLength(): number;
      updateWheel(chassis: btRigidBody, raycastInfo: RaycastInfo): void;
      m_worldTransform: btTransform;
      m_wheelDirectionCS: btVector3;
      m_wheelAxleCS: btVector3;
      m_rotation: number;
      m_deltaRotation: number;
      m_brake: number;
      m_clippedInvContactDotSuspension: number;
      m_suspensionRelativeVelocity: number;
      m_skidInfo: number;
    }

    export class btActionInterface {
      updateAction(collisionWorld: btCollisionWorld, deltaTimeStep: number): void;
    }

    export class btKinematicCharacterController extends btActionInterface {
      constructor(
        ghostObject: btPairCachingGhostObject,
        convexShape: btConvexShape,
        stepHeight: number,
        upAxis?: number
      );
      setUpAxis(axis: number): void;
      setWalkDirection(walkDirection: btVector3): void;
      setVelocityForTimeInterval(velocity: btVector3, timeInterval: number): void;
      warp(origin: btVector3): void;
      preStep(collisionWorld: btCollisionWorld): void;
      playerStep(collisionWorld: btCollisionWorld, dt: number): void;
      setFallSpeed(fallSpeed: number): void;
      setJumpSpeed(jumpSpeed: number): void;
      setMaxJumpHeight(maxJumpHeight: number): void;
      canJump(): boolean;
      jump(): void;
      setGravity(gravity: number): void;
      getGravity(): number;
      setMaxSlope(slopeRadians: number): void;
      getMaxSlope(): number;
      getGhostObject(): btPairCachingGhostObject;
      setUseGhostSweepTest(useGhostObjectSweepTest: boolean): void;
      onGround(): boolean;
      setUpInterpolate(value: boolean): void;
    }

    export class btRaycastVehicle extends btActionInterface {
      constructor(
        tuning: btVehicleTuning,
        chassis: btRigidBody,
        raycaster: btVehicleRaycaster
      );
      applyEngineForce(force: number, wheel: number): void;
      setSteeringValue(steering: number, wheel: number): void;
      getWheelTransformWS(wheelIndex: number): btTransform;
      updateWheelTransform(
        wheelIndex: number,
        interpolatedTransform: boolean
      ): void;
      addWheel(
        connectionPointCS0: btVector3,
        wheelDirectionCS0: btVector3,
        wheelAxleCS: btVector3,
        suspensionRestLength: number,
        wheelRadius: number,
        tuning: btVehicleTuning,
        isFrontWheel: boolean
      ): btWheelInfo;
      getNumWheels(): number;
      getRigidBody(): btRigidBody;
      getWheelInfo(index: number): btWheelInfo;
      setBrake(brake: number, wheelIndex: number): void;
      setCoordinateSystem(
        rightIndex: number,
        upIndex: number,
        forwardIndex: number
      ): void;
      getCurrentSpeedKmHour(): number;
      getChassisWorldTransform(): btTransform;
      rayCast(wheel: btWheelInfo): number;
      updateVehicle(step: number): void;
      resetSuspension(): void;
      getSteeringValue(wheel: number): number;
      updateWheelTransformsWS(
        wheel: btWheelInfo,
        interpolatedTransform?: boolean
      ): void;
      setPitchControl(pitch: number): void;
      updateSuspension(deltaTime: number): void;
      updateFriction(timeStep: number): void;
      getRightAxis(): number;
      getUpAxis(): number;
      getForwardAxis(): number;
      getForwardVector(): btVector3;
      getUserConstraintType(): number;
      setUserConstraintType(userConstraintType: number): void;
      setUserConstraintId(uid: number): void;
      getUserConstraintId(): number;
    }

    export class btGhostObject extends btCollisionObject {
      constructor();
      getNumOverlappingObjects(): number;
      getOverlappingObject(index: number): btCollisionObject;
    }

    export class btPairCachingGhostObject extends btGhostObject {
      constructor();
    }

    export class btGhostPairCallback {
      constructor();
    }

    export class btSoftBodyWorldInfo {
      constructor();
      air_density: number;
      water_density: number;
      water_offset: number;
      m_maxDisplacement: number;
      water_normal: btVector3;
      m_broadphase: btBroadphaseInterface;
      m_dispatcher: btDispatcher;
      m_gravity: btVector3;
    }

    export class Node {
      m_x: btVector3;
      m_q: btVector3;
      m_v: btVector3;
      m_f: btVector3;
      m_n: btVector3;
      m_im: number;
      m_area: number;
    }

    export class tNodeArray {
      size(): number;
      at(n: number): Node;
    }

    export class Material {
      m_kLST: number;
      m_kAST: number;
      m_kVST: number;
      m_flags: number;
    }

    export class tMaterialArray {
      size(): number;
      at(n: number): Material;
    }

    export class Anchor {
      m_node: Node;
      m_local: btVector3;
      m_body: btRigidBody;
      m_influence: number;
      m_c0: btMatrix3x3;
      m_c1: btVector3;
      m_c2: number;
    }

    export class tAnchorArray {
      size(): number;
      at(n: number): Anchor;
      clear(): void;
      push_back(val: Anchor): void;
      pop_back(): void;
    }

    export class Config {
      kVCF: number;
      kDP: number;
      kDG: number;
      kLF: number;
      kPR: number;
      kVC: number;
      kDF: number;
      kMT: number;
      kCHR: number;
      kKHR: number;
      kSHR: number;
      kAHR: number;
      kSRHR_CL: number;
      kSKHR_CL: number;
      kSSHR_CL: number;
      kSR_SPLT_CL: number;
      kSK_SPLT_CL: number;
      kSS_SPLT_CL: number;
      maxvolume: number;
      timescale: number;
      viterations: number;
      piterations: number;
      diterations: number;
      citerations: number;
      collisions: number;
    }

    export class btSoftBody extends btCollisionObject {
      constructor(
        worldInfo: btSoftBodyWorldInfo,
        node_count: number,
        x: btVector3,
        m: number[]
      );
      m_cfg: Config;
      m_nodes: tNodeArray;
      m_materials: tMaterialArray;
      m_anchors: tAnchorArray;
      checkLink(node0: number, node1: number): boolean;
      checkFace(node0: number, node1: number, node2: number): boolean;
      appendMaterial(): Material;
      appendNode(x: btVector3, m: number): void;
      appendLink(
        node0: number,
        node1: number,
        mat: Material,
        bcheckexist: boolean
      ): void;
      appendFace(
        node0: number,
        node1: number,
        node2: number,
        mat: Material
      ): void;
      appendTetra(
        node0: number,
        node1: number,
        node2: number,
        node3: number,
        mat: Material
      ): void;
      appendAnchor(
        node: number,
        body: btRigidBody,
        disableCollisionBetweenLinkedBodies: boolean,
        influence: number
      ): void;
      addForce(force: btVector3): void;
      addForce(force: btVector3, node: number): void;
      addAeroForceToNode(windVelocity: btVector3, nodeIndex: number): void;
      getTotalMass(): number;
      setTotalMass(mass: number, fromfaces: boolean): void;
      setMass(node: number, mass: number): void;
      transform(trs: btTransform): void;
      translate(trs: btVector3): void;
      rotate(rot: btQuaternion): void;
      scale(scl: btVector3): void;
      generateClusters(k: number, maxiterations?: number): number;
      generateBendingConstraints(distance: number, mat: Material): number;
      upcast(colObj: btCollisionObject): btSoftBody;
    }

    export class btSoftBodyRigidBodyCollisionConfiguration extends btDefaultCollisionConfiguration {
      constructor(info?: btDefaultCollisionConstructionInfo);
    }

    export class btSoftBodySolver {}

    export class btDefaultSoftBodySolver extends btSoftBodySolver {
      constructor();
    }

    export class btSoftBodyArray {
      size(): number;
      at(n: number): btSoftBody;
    }

    export class btSoftRigidDynamicsWorld extends btDiscreteDynamicsWorld {
      constructor(
        dispatcher: btDispatcher,
        pairCache: btBroadphaseInterface,
        constraintSolver: btConstraintSolver,
        collisionConfiguration: btCollisionConfiguration,
        softBodySolver: btSoftBodySolver
      );
      addSoftBody(
        body: btSoftBody,
        collisionFilterGroup: number,
        collisionFilterMask: number
      ): void;
      removeSoftBody(body: btSoftBody): void;
      removeCollisionObject(collisionObject: btCollisionObject): void;
      getWorldInfo(): btSoftBodyWorldInfo;
      getSoftBodyArray(): btSoftBodyArray;
    }

    export class btSoftBodyHelpers {
      constructor();
      CreateRope(
        worldInfo: btSoftBodyWorldInfo,
        from: btVector3,
        to: btVector3,
        res: number,
        fixeds: number
      ): btSoftBody;
      CreatePatch(
        worldInfo: btSoftBodyWorldInfo,
        corner00: btVector3,
        corner10: btVector3,
        corner01: btVector3,
        corner11: btVector3,
        resx: number,
        resy: number,
        fixeds: number,
        gendiags: boolean
      ): btSoftBody;
      CreatePatchUV(
        worldInfo: btSoftBodyWorldInfo,
        corner00: btVector3,
        corner10: btVector3,
        corner01: btVector3,
        corner11: btVector3,
        resx: number,
        resy: number,
        fixeds: number,
        gendiags: boolean,
        tex_coords: number[]
      ): btSoftBody;
      CreateEllipsoid(
        worldInfo: btSoftBodyWorldInfo,
        center: btVector3,
        radius: btVector3,
        res: number
      ): btSoftBody;
      CreateFromTriMesh(
        worldInfo: btSoftBodyWorldInfo,
        vertices: number[],
        triangles: number[],
        ntriangles: number,
        randomizeConstraints: boolean
      ): btSoftBody;
      CreateFromConvexHull(
        worldInfo: btSoftBodyWorldInfo,
        vertices: btVector3,
        nvertices: number,
        randomizeConstraints: boolean
      ): btSoftBody;
    }

    function destroy(obj: Type): void;

    export interface Ammo {
       DebugDrawer: typeof DebugDrawer,
    btVector3: typeof btVector3,
    btVector4: typeof btVector4,
    btQuadWord: typeof btQuadWord,
    btQuaternion: typeof btQuaternion,
    btMatrix3x3: typeof btMatrix3x3,
    btTransform: typeof btTransform,
    btMotionState: typeof btMotionState,
    btDefaultMotionState: typeof btDefaultMotionState,
    btCollisionObject: typeof btCollisionObject,
    btCollisionObjectWrapper: typeof btCollisionObjectWrapper,
    RayResultCallback: typeof RayResultCallback,
    ClosestRayResultCallback: typeof ClosestRayResultCallback,
    btConstCollisionObjectArray: typeof btConstCollisionObjectArray,
    btScalarArray: typeof btScalarArray,
    AllHitsRayResultCallback: typeof AllHitsRayResultCallback,
    btManifoldPoint: typeof btManifoldPoint,
    ContactResultCallback: typeof ContactResultCallback,
    ConcreteContactResultCallback: typeof ConcreteContactResultCallback,
    LocalShapeInfo: typeof LocalShapeInfo,
    LocalConvexResult: typeof LocalConvexResult,
    ConvexResultCallback: typeof ConvexResultCallback,
    ClosestConvexResultCallback: typeof ClosestConvexResultCallback,
    btCollisionShape: typeof btCollisionShape,
    btConvexShape: typeof btConvexShape,
    btConvexTriangleMeshShape: typeof btConvexTriangleMeshShape,
    btBoxShape: typeof btBoxShape,
    btCapsuleShape: typeof btCapsuleShape,
    btCapsuleShapeX: typeof btCapsuleShapeX,
    btCapsuleShapeZ: typeof btCapsuleShapeZ,
    btCylinderShape: typeof btCylinderShape,
    btCylinderShapeX: typeof btCylinderShapeX,
    btCylinderShapeZ: typeof btCylinderShapeZ,
    btSphereShape: typeof btSphereShape,
    btMultiSphereShape: typeof btMultiSphereShape,
    btConeShape: typeof btConeShape,
    btConeShapeX: typeof btConeShapeX,
    btConeShapeZ: typeof btConeShapeZ,
    btIntArray: typeof btIntArray,
    btFace: typeof btFace,
    btVector3Array: typeof btVector3Array,
    btFaceArray: typeof btFaceArray,
    btConvexPolyhedron: typeof btConvexPolyhedron,
    btConvexHullShape: typeof btConvexHullShape,
    btShapeHull: typeof btShapeHull,
    btCompoundShape: typeof btCompoundShape,
    btStridingMeshInterface: typeof btStridingMeshInterface,
    btIndexedMesh: typeof btIndexedMesh,
    btIndexedMeshArray: typeof btIndexedMeshArray,
    btTriangleMesh: typeof btTriangleMesh,
    btConcaveShape: typeof btConcaveShape,
    btEmptyShape: typeof btEmptyShape,
    btStaticPlaneShape: typeof btStaticPlaneShape,
    btTriangleMeshShape: typeof btTriangleMeshShape,
    btBvhTriangleMeshShape: typeof btBvhTriangleMeshShape,
    btHeightfieldTerrainShape: typeof btHeightfieldTerrainShape,
    btDefaultCollisionConstructionInfo: typeof btDefaultCollisionConstructionInfo,
    btDefaultCollisionConfiguration: typeof btDefaultCollisionConfiguration,
    btPersistentManifold: typeof btPersistentManifold,
    btDispatcher: typeof btDispatcher,
    btCollisionDispatcher: typeof btCollisionDispatcher,
    btOverlappingPairCallback: typeof btOverlappingPairCallback,
    btOverlappingPairCache: typeof btOverlappingPairCache,
    btAxisSweep3: typeof btAxisSweep3,
    btBroadphaseInterface: typeof btBroadphaseInterface,
    btCollisionConfiguration: typeof btCollisionConfiguration,
    btDbvtBroadphase: typeof btDbvtBroadphase,
    btBroadphaseProxy: typeof btBroadphaseProxy,
    btRigidBodyConstructionInfo: typeof btRigidBodyConstructionInfo,
    btRigidBody: typeof btRigidBody,
    btConstraintSetting: typeof btConstraintSetting,
    btTypedConstraint: typeof btTypedConstraint,
    btPoint2PointConstraint: typeof btPoint2PointConstraint,
    btGeneric6DofConstraint: typeof btGeneric6DofConstraint,
    btGeneric6DofSpringConstraint: typeof btGeneric6DofSpringConstraint,
    btSequentialImpulseConstraintSolver: typeof btSequentialImpulseConstraintSolver,
    btConeTwistConstraint: typeof btConeTwistConstraint,
    btHingeConstraint: typeof btHingeConstraint,
    btSliderConstraint: typeof btSliderConstraint,
    btFixedConstraint: typeof btFixedConstraint,
    btConstraintSolver: typeof btConstraintSolver,
    btDispatcherInfo: typeof btDispatcherInfo,
    btCollisionWorld: typeof btCollisionWorld,
    btContactSolverInfo: typeof btContactSolverInfo,
    btDynamicsWorld: typeof btDynamicsWorld,
    btDiscreteDynamicsWorld: typeof btDiscreteDynamicsWorld,
    btVehicleTuning: typeof btVehicleTuning,
    btVehicleRaycasterResult: typeof btVehicleRaycasterResult,
    btVehicleRaycaster: typeof btVehicleRaycaster,
    btDefaultVehicleRaycaster: typeof btDefaultVehicleRaycaster,
    RaycastInfo: typeof RaycastInfo,
    btWheelInfoConstructionInfo: typeof btWheelInfoConstructionInfo,
    btWheelInfo: typeof btWheelInfo,
    btActionInterface: typeof btActionInterface,
    btKinematicCharacterController: typeof btKinematicCharacterController,
    btRaycastVehicle: typeof btRaycastVehicle,
    btGhostObject: typeof btGhostObject,
    btPairCachingGhostObject: typeof btPairCachingGhostObject,
    btGhostPairCallback: typeof btGhostPairCallback,
    btSoftBodyWorldInfo: typeof btSoftBodyWorldInfo,
    Node: typeof Node,
    tNodeArray: typeof tNodeArray,
    Material: typeof Material,
    tMaterialArray: typeof tMaterialArray,
    Anchor: typeof Anchor,
    tAnchorArray: typeof tAnchorArray,
    Config: typeof Config,
    btSoftBody: typeof btSoftBody,
    btSoftBodyRigidBodyCollisionConfiguration: typeof btSoftBodyRigidBodyCollisionConfiguration,
    btSoftBodySolver: typeof btSoftBodySolver,
    btDefaultSoftBodySolver: typeof btDefaultSoftBodySolver,
    btSoftBodyArray: typeof btSoftBodyArray,
    btSoftRigidDynamicsWorld: typeof btSoftRigidDynamicsWorld,
    btSoftBodyHelpers: typeof btSoftBodyHelpers,

    }
}
