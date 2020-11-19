import { BufferAttribute, Geometry, Material, Object3D } from "three";
import { EditorObjectMesh } from "./editor";
import {
  createIndexList,
  createVertexList,
  getMaterial,
  isLine,
  isLineLoop,
  isLineSegments,
  isMesh,
  isPoints,
  isSprite,
} from "./utils";

interface ModelRecord {
  model: Model | null;
  shape: Shape | null;
}

export default class ModelRepository {
  models: Map<Object3D, ModelRecord> = new Map();

  get(object: Object3D): Model | null {
    let model = this.models.get(object);

    if (model === undefined) {
      model = createModel(object);

      this.models.set(object, model);
    }

    if (!model.model || !model.shape) {
      return null;
    }

    model.shape.texture =
      (object as EditorObjectMesh)?.material?.texture || null;

    return model.model;
  }
}

export function createModel(object: Object3D): ModelRecord {
  const material = getMaterial(object);
  const geometry = (object as Object3D & { geometry: Geometry }).geometry;
  let shapeType: ShapeType = ShapeType.Triangles;
  // let lineWidth: number = 0;

  if (isMesh(object)) {
    if ((material as Material & { wireframe: boolean }).wireframe === true) {
      // lineWidth = (material as Material & {wireframeLinewidth: number}).wireframeLinewidth; // * pixel ratio
      shapeType = ShapeType.Lines;
    }
  } else if (isLine(object)) {
    // lineWidth = (material as Material & {linewidth?: number}).linewidth || 1; // * pixel ratio

    if (isLineSegments(object)) {
      shapeType = ShapeType.Lines;
    } else if (isLineLoop(object)) {
      shapeType = ShapeType.LineLoop;
    } else {
      shapeType = ShapeType.LineStrip;
    }
  } else if (isPoints(object)) {
    shapeType = ShapeType.Points;
  } else if (isSprite(object)) {
    shapeType = ShapeType.Triangles;
  }

  const vertexList = createVertexList(object);

  if (!vertexList) {
    SSj.log("couldnt generaet vertex list foor " + object.id);
    SSj.log(geometry);
    return { model: null, shape: null };
  }

  const index = (geometry as Geometry & { index?: BufferAttribute }).index;
  const indexList = index ? createIndexList(index) : undefined;
  const shape = indexList
    ? new Shape(shapeType, null, vertexList, indexList)
    : new Shape(shapeType, null, vertexList);

  return {
    model: new Model(
      [shape],
      new Shader({
        fragmentFile: "@/shaders/basic.frag",
        vertexFile: "@/shaders/basic.vert",
      })
    ),
    shape,
  };
}
