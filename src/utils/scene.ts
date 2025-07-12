import { Group, LOD, Mesh, Object3D } from 'three';

export function toModelScale(number: number) {
  return number / 200_000;
}

export function getActiveLOD<T extends Object3D>(target: T): T {
  if (target.children.length > 0) {
    const isLOD = target.children[0] instanceof LOD;

    if (isLOD) {
      const lod = target.children[0] as LOD;
      const activeLevel = lod.getCurrentLevel();
      return lod.children[activeLevel] as T;
    }
  }

  if (target.parent) {
    const isLOD = target.parent instanceof LOD;

    if (isLOD) {
      const lod = target.parent as LOD;
      const activeLevel = lod.getCurrentLevel();
      return lod.children[activeLevel] as T;
    }
  }

  return target;
}

export function getBodyMeshFromGroup(body: Group): Mesh | undefined {
  let mesh: Mesh | undefined = undefined;

  body.traverse((child: Object3D) => {
    if (mesh) return;

    if (child instanceof Mesh) {
      if (child.parent instanceof LOD) {
        mesh = getActiveLOD(child);
      } else {
        mesh = child;
      }
    }
  });

  return mesh;
}
