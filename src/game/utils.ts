import { ArrayCamera, BufferAttribute, BufferGeometry, Color as ThreeColor, DirectionalLight, Geometry, Group, ImmediateRenderObject, InstancedMesh, Light, Line, LineLoop, LineSegments, LOD, Material, Mesh, MeshBasicMaterial, Object3D, PointLight, Points, SkinnedMesh, Sprite, Vector3 } from "three";

export function isGroup(object: Object3D): object is Group {
  return (object as any).isGroup ? true : false;
}


export function isLOD(object: Object3D): object is LOD {
  return (object as any).isLOD ? true : false;
}

export function isLight(object: Object3D): object is Light {
  return (object as any).isLight ? true : false;
}

export function isPointLight(object: Object3D): object is PointLight {
  return (object as any).isPointLight ? true : false;
}

export function isDirectionalLight(object: Object3D): object is DirectionalLight {
  return (object as any).isDirectionalLight ? true : false;
}

export function isSprite(object: Object3D): object is Sprite {
  return (object as any).isSprite ? true : false;
}

export function isImmediateRenderObject(object: Object3D): object is ImmediateRenderObject {
  return (object as any).isImmediateRenderObject ? true : false;
}

export function isBufferGeometry(geometry: any): geometry is BufferGeometry {
  return (geometry as any).isBufferGeometry ? true : false;
}

export function isMesh(object: Object3D): object is Mesh {
  return (object as any).isMesh ? true : false;
}

export function isMeshBasicMaterial(material: Material): material is MeshBasicMaterial {
  return (material as any).isMeshBasicMaterial ? true : false;
}

export function isLine(object: Object3D): object is Line {
  return (object as any).isLine ? true : false;
}

export function isLineSegments(object: Object3D): object is LineSegments {
  return (object as any).isLineSegments ? true : false;
}

export function isLineLoop(object: Object3D): object is LineLoop {
  return (object as any).isLineLoop ? true : false;
}

export function isInstancedMesh(object: Object3D): object is InstancedMesh {
  return (object as any).isInstancedMesh ? true : false;
}

export function isPoints(object: Object3D): object is Points {
  return (object as any).isPoints ? true : false;
}

export function isSkinnedMesh(object: Object3D): object is SkinnedMesh {
  return (object as any).isSkinnedMesh ? true : false;
}

export function isArrayCamera(object: Object3D): object is ArrayCamera {
  return (object as any).isArrayCamera ? true : false;
}

export function hasPositions<T extends Object3D>(object: T): object is T & { positionArray: Float32Array } {
  return (object as T & { hasPositions: boolean }).hasPositions ? true : false;
}

export function hasNormals<T extends Object3D>(object: T): object is T & { normalArray: Float32Array } {
  return (object as T & { hasNormals: boolean }).hasNormals ? true : false;
}

export function hasUvs<T extends Object3D>(object: T): object is T & { uvArray: Float32Array } {
  return (object as T & { hasUvs: boolean }).hasUvs ? true : false;
}

export function hasColors<T extends Object3D>(object: T): object is T & { colorArray: Float32Array } {
  return (object as T & { hasColors: boolean }).hasColors ? true : false;
}

const transparent = new Color(0, 0, 0, 0);

export function createVertexArray(length: number): Vertex[] {
  return new Array(length).fill(0).map(() => ({ x: 0, y: 0, z: 0, u: 0, v: 1, color: transparent }))
}

export function createIndexList(index: BufferAttribute): IndexList {
  return new IndexList(Array.from(index.array));
}


export function copyPositionsToVertexArray(vertexArray: Vertex[], positions: Float32Array) {
   for (let i = 0; i < vertexArray.length; i += 1) {
      vertexArray[i].x = positions[i * 3];
      vertexArray[i].y = positions[i * 3 + 1];
      vertexArray[i].z = positions[i * 3 + 2];
   }
}

export function copyVerticesToVertexArray(vertexArray: Vertex[], vertices: Vector3[]) {
   for (let i = 0; i < vertexArray.length; i += 1) {
      vertexArray[i].x = vertices[i].x;
      vertexArray[i].y = vertices[i].y;
      vertexArray[i].z = vertices[i].z;
   }
}

function smuggleNormalComponent(component: number) {
  return component / 2 + 0.5;
}

export function copyNormalsToVertexArray(vertexArray: Vertex[], normals: Float32Array) {
   for (let i = 0; i < vertexArray.length; i += 1) {
      vertexArray[i].color = new Color(
        smuggleNormalComponent(normals[i * 3]),
        smuggleNormalComponent(normals[i * 3 + 1]),
        smuggleNormalComponent(normals[i * 3 + 2]),
        1.0
      );
   }
}

export function copyUvsToVertexArray(vertexArray: Vertex[], uvs: Float32Array) {
   for (let i = 0; i < vertexArray.length; i += 1) {
      vertexArray[i].u = uvs[i * 2];
      vertexArray[i].v = uvs[i * 2 + 1];
   }
}

export function copyColorsToVertexArray(vertexArray: Vertex[], colors: Float32Array) {
   for (let i = 0; i < vertexArray.length; i += 1) {
      vertexArray[i].color = new Color(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
   }
}

export function fillColorsInVertexArray(vertexArray: Vertex[], color: ThreeColor) {
   for (let i = 0; i < vertexArray.length; i += 1) {
      vertexArray[i].color = new Color(color.r, color.g, color.b, 1.0);
   }
}

export function getMaterial(object: Object3D): Material {
  return (object as Object3D & { material: Material | Material[] }).material as Material;
}

export function createVertexList(object: Object3D): VertexList | null {
  const geometry = (object as Object3D & {geometry?: Geometry}).geometry;
  // const material = (object as Object3D & {material: Material}).material as Material & {color?: ThreeColor};
  if ( hasPositions(object)) {
    const vertexArray = createVertexArray(object.positionArray.length / 3);

    copyPositionsToVertexArray(vertexArray, object.positionArray);

    if (hasNormals(object)) {
      copyNormalsToVertexArray(vertexArray, object.normalArray);
    }

    if (hasUvs(object)) {
      copyUvsToVertexArray(vertexArray, object.uvArray);
    }

    // if (hasColors(object)) {
    //   copyColorsToVertexArray(vertexArray, object.colorArray);
    // }

    return new VertexList(vertexArray);
  }
  else if (geometry && isBufferGeometry(geometry)) {
    let positions = geometry.attributes.position;
    const vertexArray = createVertexArray(positions.array.length / 3);

    copyPositionsToVertexArray(vertexArray, positions.array as Float32Array);

    if (geometry.attributes.normal) {
      copyNormalsToVertexArray(vertexArray, geometry.attributes.normal.array as Float32Array);
    }

    if (geometry.attributes.uv) {
      copyUvsToVertexArray(vertexArray, geometry.attributes.uv.array as Float32Array);
    }

    // if (!normalArray && geometry.attributes.color) {
    //   copyColorsToVertexArray(vertexArray, geometry.attributes.color.array as Float32Array);
    // }
    // else if (!normalArray && material && material.color) {
    //   fillColorsInVertexArray(vertexArray, material.color);
    // }

    return new VertexList(vertexArray);
  }
  // else if (geometry && geometry.vertices) {
  //   const vertexArray = createVertexArray(geometry.vertices.length);

  //   copyVerticesToVertexArray(vertexArray, geometry.vertices);

  //   if (geometry.attributes.normal) {
  //     copyNormalsToVertexArray(vertexArray, geometry.attributes.normal.array as Float32Array);
  //   }

  //   if (geometry.attributes.uv) {
  //     copyUvsToVertexArray(vertexArray, geometry.attributes.uv.array as Float32Array);
  //   }

  //   // if (!normalArray && geometry.attributes.color) {
  //   //   copyColorsToVertexArray(vertexArray, geometry.attributes.color.array as Float32Array);
  //   // }
  //   // else if (!normalArray && material && material.color) {
  //   //   fillColorsInVertexArray(vertexArray, material.color);
  //   // }

  //   return new VertexList(vertexArray);
  // }

  return null;
}

import { Matrix4 } from "three";

export default function setTransformFromMatrix(
  transform: Transform,
  source: Matrix4
) {
  transform.matrix[0][0] = source.elements[0];
  transform.matrix[0][1] = source.elements[4];
  transform.matrix[0][2] = source.elements[8];
  transform.matrix[0][3] = source.elements[12];

  transform.matrix[1][0] = source.elements[1];
  transform.matrix[1][1] = source.elements[5];
  transform.matrix[1][2] = source.elements[9];
  transform.matrix[1][3] = source.elements[13];

  transform.matrix[2][0] = source.elements[2];
  transform.matrix[2][1] = source.elements[6];
  transform.matrix[2][2] = source.elements[10];
  transform.matrix[2][3] = source.elements[14];

  transform.matrix[3][0] = source.elements[3];
  transform.matrix[3][1] = source.elements[7];
  transform.matrix[3][2] = source.elements[11];
  transform.matrix[3][3] = source.elements[15];

  return transform;
}
