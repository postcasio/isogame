import { CylinderBufferGeometry, Group, Mesh, Scene } from "three";
import { BasicMaterial } from "../BasicMaterial";

interface AxisHelperParams {
  radius?: number;
  height?: number;
  scene: Scene;
}

export function createAxisHelper(params: AxisHelperParams) {
  params.radius = params.radius || 0.05;
  params.height = params.height || 2;

  const group = new Group();

  const arrowGeometry = new CylinderBufferGeometry(
    0,
    2 * params.radius,
    params.height / 5
  );

  const xAxisMaterial = new BasicMaterial({
    color: Color.Red,
    opacity: 0.3,
    transparent: true,
  });
  const xAxisGeometry = new CylinderBufferGeometry(
    params.radius,
    params.radius,
    params.height
  );
  const xAxisMesh = new Mesh(xAxisGeometry, xAxisMaterial);
  const xArrowMesh = new Mesh(arrowGeometry, xAxisMaterial);
  xAxisMesh.add(xArrowMesh);
  xArrowMesh.position.y += params.height / 2;
  xAxisMesh.rotation.z -= (90 * Math.PI) / 180;
  xAxisMesh.position.x += params.height / 2;
  group.add(xAxisMesh);

  const yAxisMaterial = new BasicMaterial({
    color: Color.Green,
    opacity: 0.3,
    transparent: true,
  });
  const yAxisGeometry = new CylinderBufferGeometry(
    params.radius,
    params.radius,
    params.height
  );
  const yAxisMesh = new Mesh(yAxisGeometry, yAxisMaterial);
  const yArrowMesh = new Mesh(arrowGeometry, yAxisMaterial);
  yAxisMesh.add(yArrowMesh);
  yArrowMesh.position.y += params.height / 2;
  yAxisMesh.position.y += params.height / 2;
  group.add(yAxisMesh);

  const zAxisMaterial = new BasicMaterial({
    color: Color.Blue,
    opacity: 0.3,
    transparent: true,
  });
  const zAxisGeometry = new CylinderBufferGeometry(
    params.radius,
    params.radius,
    params.height
  );
  const zAxisMesh = new Mesh(zAxisGeometry, zAxisMaterial);
  const zArrowMesh = new Mesh(arrowGeometry, zAxisMaterial);
  zAxisMesh.add(zArrowMesh);
  zAxisMesh.rotation.x += (90 * Math.PI) / 180;
  zArrowMesh.position.y += params.height / 2;
  zAxisMesh.position.z += params.height / 2;
  group.add(zAxisMesh);

  return group;
}
