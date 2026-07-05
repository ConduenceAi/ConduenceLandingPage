"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PIECE_OUTLINES_GRID = [
  [
    [0, 0],
    [1, 0],
    [1, 2],
    [2, 2],
    [2, 3],
    [0, 3],
  ],
  [
    [0, 3],
    [2, 3],
    [2, 2],
    [3, 2],
    [3, 4],
    [0, 4],
  ],
  [
    [2, 1],
    [4, 1],
    [4, 4],
    [3, 4],
    [3, 2],
    [2, 2],
  ],
  [
    [1, 0],
    [4, 0],
    [4, 1],
    [2, 1],
    [2, 2],
    [1, 2],
  ],
] as const;

type LayerDef =
  | {
      type: "solid";
      targetY: number;
      hoverY: number;
      layerGroup: THREE.Group;
      pieces: [];
    }
  | {
      type: "split";
      targetY: number;
      hoverY: number;
      layerGroup: THREE.Group;
      pieces: { pieceGroup: THREE.Group; start: THREE.Vector2 }[];
    };

type TimelineEntry = {
  kind: "base-drop" | "converge" | "drop";
  start: number;
  end: number;
  layer: number;
};

function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}

export function CubeAssembly({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = containerRef.current;
    if (!wrap) return;
    const container = wrap;

    const scene = new THREE.Scene();
    scene.background = null;

    const FRUSTUM = 6.4;
    let aspect = wrap.clientWidth / Math.max(wrap.clientHeight, 1);
    const camera = new THREE.OrthographicCamera(
      -FRUSTUM * aspect,
      FRUSTUM * aspect,
      FRUSTUM,
      -FRUSTUM,
      0.1,
      100,
    );
    camera.position.set(8.6, 7.6, 8.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    wrap.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d8d8, 0.95));
    const dir = new THREE.DirectionalLight(0xffffff, 0.4);
    dir.position.set(6, 10, 4);
    scene.add(dir);

    const rig = new THREE.Group();
    scene.add(rig);

    const S = 4.2;
    const LAYERS = 3;
    const THICK = S / LAYERS;
    const CELL = S / 4;
    const HALF = S / 2;

    function gridToWorld(pt: readonly [number, number]) {
      return [-HALF + pt[0] * CELL, -HALF + pt[1] * CELL] as const;
    }

    function shapeFromOutline(outlineGrid: readonly (readonly [number, number])[]) {
      const shape = new THREE.Shape();
      const p0 = gridToWorld(outlineGrid[0]);
      shape.moveTo(p0[0], p0[1]);
      for (let i = 1; i < outlineGrid.length; i++) {
        const p = gridToWorld(outlineGrid[i]);
        shape.lineTo(p[0], p[1]);
      }
      shape.closePath();
      return shape;
    }

    function buildPieceMesh(
      outlineGrid: readonly (readonly [number, number])[],
      thickness: number,
      color: number,
    ) {
      const shape = shapeFromOutline(outlineGrid);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: thickness,
        bevelEnabled: false,
        curveSegments: 1,
      });
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, thickness / 2, 0);
      geo.computeVertexNormals();
      const mat = new THREE.MeshBasicMaterial({
        color,
      });
      return new THREE.Mesh(geo, mat);
    }

    function radialDirForMesh(mesh: THREE.Mesh) {
      mesh.geometry.computeBoundingBox();
      const c = mesh.geometry.boundingBox!.getCenter(new THREE.Vector3());
      const v = new THREE.Vector2(c.x, c.z);
      if (v.lengthSq() < 1e-6) v.set(1, 0);
      v.normalize();
      return v;
    }

    const glowMatCore = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.9,
    });
    const glowMatHalo = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const coreCyl = new THREE.CylinderGeometry(1, 1, 1, 5, 1, true);
    const haloCyl = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
    const UP = new THREE.Vector3(0, 1, 0);

    function addGlowSeams(mesh: THREE.Mesh, parentGroup: THREE.Group) {
      const edges = new THREE.EdgesGeometry(mesh.geometry, 1);
      const pos = edges.attributes.position.array;
      const group = new THREE.Group();
      for (let i = 0; i < pos.length; i += 6) {
        const a = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
        const b = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
        const len = a.distanceTo(b);
        if (len < 1e-4) continue;
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dirVec = b.clone().sub(a).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(UP, dirVec);

        const core = new THREE.Mesh(coreCyl, glowMatCore);
        core.scale.set(0.014, len, 0.014);
        core.position.copy(mid);
        core.quaternion.copy(quat);
        group.add(core);

        const halo = new THREE.Mesh(haloCyl, glowMatHalo);
        halo.scale.set(0.05, len, 0.05);
        halo.position.copy(mid);
        halo.quaternion.copy(quat);
        group.add(halo);
      }
      parentGroup.add(group);
    }

    const shades = [0xffffff, 0xffffff, 0xffffff];
    const TRAVEL = 9.5;
    const FLOAT_GAP = 1.6;

    const layerDefs: LayerDef[] = [];

    for (let li = 0; li < LAYERS; li++) {
      const targetY = -HALF + THICK / 2 + li * THICK;
      const layerGroup = new THREE.Group();
      layerGroup.position.set(0, targetY, 0);
      rig.add(layerGroup);

      if (li === 0) {
        const fullOutline = [
          [0, 0],
          [4, 0],
          [4, 4],
          [0, 4],
        ] as const;
        const mesh = buildPieceMesh(fullOutline, THICK, shades[li]);
        layerGroup.add(mesh);
        addGlowSeams(mesh, layerGroup);

        const dotGeo = new THREE.CircleGeometry(0.03, 10);
        dotGeo.rotateX(-Math.PI / 2);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x0a0a0a });
        const inst = new THREE.InstancedMesh(dotGeo, dotMat, 25);
        const m = new THREE.Matrix4();
        let idx = 0;
        for (let gx = 0; gx < 5; gx++) {
          for (let gz = 0; gz < 5; gz++) {
            const x = -HALF + S * 0.12 + gx * (S * 0.19);
            const z = -HALF + S * 0.12 + gz * (S * 0.19);
            m.makeTranslation(x, THICK / 2 + 0.002, z);
            inst.setMatrixAt(idx++, m);
          }
        }
        inst.instanceMatrix.needsUpdate = true;
        mesh.add(inst);

        layerDefs.push({ type: "solid", targetY, hoverY: targetY, layerGroup, pieces: [] });
      } else {
        const pieces: { pieceGroup: THREE.Group; start: THREE.Vector2 }[] = [];
        for (let pi = 0; pi < 4; pi++) {
          const mesh = buildPieceMesh(PIECE_OUTLINES_GRID[pi], THICK, shades[li]);
          const pieceGroup = new THREE.Group();
          pieceGroup.add(mesh);
          addGlowSeams(mesh, pieceGroup);
          layerGroup.add(pieceGroup);

          const dir2 = radialDirForMesh(mesh);
          const startPos = new THREE.Vector2(dir2.x * TRAVEL, dir2.y * TRAVEL);
          pieceGroup.position.set(startPos.x, 0, startPos.y);

          pieces.push({ pieceGroup, start: startPos });
        }
        layerGroup.position.y = targetY + FLOAT_GAP;
        layerGroup.visible = false;
        layerDefs.push({ type: "split", targetY, hoverY: targetY + FLOAT_GAP, layerGroup, pieces });
      }
    }

    const BASE_DROP = 1.0;
    const CONV = 1.0;
    const DROP = 0.7;
    const GAP_BETWEEN = 0.3;

    const timeline: TimelineEntry[] = [];
    let cursor = 0;
    timeline.push({ kind: "base-drop", start: cursor, end: cursor + BASE_DROP, layer: 0 });
    cursor += BASE_DROP + GAP_BETWEEN;
    for (let li = 1; li < LAYERS; li++) {
      const convStart = cursor;
      const convEnd = convStart + CONV;
      const dropStart = convEnd + 0.15;
      const dropEnd = dropStart + DROP;
      timeline.push({ kind: "converge", start: convStart, end: convEnd, layer: li });
      timeline.push({ kind: "drop", start: dropStart, end: dropEnd, layer: li });
      cursor = dropEnd + GAP_BETWEEN;
    }
    const TOTAL_END = cursor;

    let startTime: number | null = null;
    let assemblyStarted = false;
    let rotating = false;
    let rotAngle = 0;
    let finished = false;

    const BASE_START_OFFSET = 7.5;

    function resetScene() {
      layerDefs.forEach((ld) => {
        if (ld.type === "solid") {
          ld.layerGroup.position.y = ld.targetY + BASE_START_OFFSET;
        } else {
          ld.layerGroup.position.y = ld.hoverY;
          ld.layerGroup.visible = false;
          ld.pieces.forEach((p) => p.pieceGroup.position.set(p.start.x, 0, p.start.y));
        }
      });
      rig.rotation.y = 0;
      rotAngle = 0;
      rotating = false;
      finished = false;
      startTime = null;
    }

    resetScene();

    let frameId = 0;

    function animate(time: number) {
      frameId = requestAnimationFrame(animate);

      if (!assemblyStarted) {
        renderer.render(scene, camera);
        return;
      }

      if (startTime === null) startTime = time;
      const elapsed = (time - startTime) / 1000;

      if (!finished) {
        const baseEntry = timeline[0];
        const baseLD = layerDefs[0];
        if (elapsed <= baseEntry.end) {
          const p = easeOutQuint(Math.min(1, Math.max(0, elapsed / baseEntry.end)));
          const fromY = baseLD.targetY + BASE_START_OFFSET;
          baseLD.layerGroup.position.y = fromY + (baseLD.targetY - fromY) * p;
        } else {
          baseLD.layerGroup.position.y = baseLD.targetY;
        }

        for (let li = 1; li < LAYERS; li++) {
          const ld = layerDefs[li];
          const convEntry = timeline.find((e) => e.layer === li && e.kind === "converge")!;
          const dropEntry = timeline.find((e) => e.layer === li && e.kind === "drop")!;

          if (elapsed < convEntry.start) {
            ld.layerGroup.visible = false;
            if (ld.type === "split") {
              ld.pieces.forEach((p) => p.pieceGroup.position.set(p.start.x, 0, p.start.y));
            }
            ld.layerGroup.position.y = ld.hoverY;
          } else if (elapsed <= convEntry.end) {
            ld.layerGroup.visible = true;
            const t = easeOutQuint(
              Math.min(1, (elapsed - convEntry.start) / (convEntry.end - convEntry.start)),
            );
            if (ld.type === "split") {
              ld.pieces.forEach((p) => {
                const x = p.start.x + (0 - p.start.x) * t;
                const z = p.start.y + (0 - p.start.y) * t;
                p.pieceGroup.position.set(x, 0, z);
              });
            }
          } else if (elapsed < dropEntry.start) {
            if (ld.type === "split") {
              ld.pieces.forEach((p) => p.pieceGroup.position.set(0, 0, 0));
            }
            ld.layerGroup.position.y = ld.hoverY;
          } else if (elapsed <= dropEntry.end) {
            if (ld.type === "split") {
              ld.pieces.forEach((p) => p.pieceGroup.position.set(0, 0, 0));
            }
            const t = easeOutQuint(
              Math.min(1, (elapsed - dropEntry.start) / (dropEntry.end - dropEntry.start)),
            );
            ld.layerGroup.position.y = ld.hoverY + (ld.targetY - ld.hoverY) * t;
          } else {
            if (ld.type === "split") {
              ld.pieces.forEach((p) => p.pieceGroup.position.set(0, 0, 0));
            }
            ld.layerGroup.position.y = ld.targetY;
          }
        }

        if (elapsed >= TOTAL_END) {
          finished = true;
          rotating = true;
        }
      }

      if (rotating) {
        rotAngle += 0.0032;
        rig.rotation.y = rotAngle;
      }

      renderer.render(scene, camera);
    }

    frameId = requestAnimationFrame(animate);

    function onResize() {
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      aspect = w / h;
      camera.left = -FRUSTUM * aspect;
      camera.right = FRUSTUM * aspect;
      camera.top = FRUSTUM;
      camera.bottom = -FRUSTUM;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          assemblyStarted = true;
          intersectionObserver.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    intersectionObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      glowMatCore.dispose();
      glowMatHalo.dispose();
      coreCyl.dispose();
      haloCyl.dispose();
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
