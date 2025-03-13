import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";

// Transparent cuboid with visible edges
function TransparentCuboid({ width, height, depth }) {
  return (
    <mesh>
      <boxGeometry args={[width, height, depth]} />
      <meshBasicMaterial color="lightblue" transparent opacity={0.2} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
        <lineBasicMaterial color="gray" />
      </lineSegments>
    </mesh>
  );
}

// The actual sphere+cone visual
function SphereWithCone({ meshRef, position, rotation }) {
  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <sphereGeometry args={[6, 32, 32]} />
      <meshStandardMaterial color="orange" />
      <mesh position={[0, 0, 1.5]}>
        <coneGeometry args={[1, 3, 32]} />
        <meshStandardMaterial color="orange" transparent opacity={0.4} />
      </mesh>
    </mesh>
  );
}

function DraggablePoint({
  cuboidDimensions,
  position,
  setPosition,
  rotation,
  setRotation,
  mode,
}) {
  // The TransformControls references this
  const transformRef = useRef(null);

  // We'll pass this ref to the actual mesh
  const meshRef = useRef(null);

  const { camera, gl } = useThree();
  const { width, height, depth } = cuboidDimensions;

  // Change mode on the TransformControls whenever mode state changes
  useEffect(() => {
    if (transformRef.current) {
      transformRef.current.setMode(mode);
    }
  }, [mode]);

  // Continuously clamp position in translate mode, sync rotation in rotate mode
  useFrame(() => {
    if (!meshRef.current) return;
    const obj = meshRef.current;

    if (mode === "translate") {
      // Clamp position inside cuboid
      obj.position.x = Math.max(
        -width / 2,
        Math.min(width / 2, obj.position.x)
      );
      obj.position.y = Math.max(
        -height / 2,
        Math.min(height / 2, obj.position.y)
      );
      obj.position.z = Math.max(
        -depth / 2,
        Math.min(depth / 2, obj.position.z)
      );
      // Sync to state
      setPosition([obj.position.x, obj.position.y, obj.position.z]);
    } else if (mode === "rotate") {
      // Update rotation in state
      setRotation([obj.rotation.x, obj.rotation.y, obj.rotation.z]);
    }
  });

  return (
    <>
      <TransformControls
        ref={transformRef}
        object={meshRef.current}
        camera={camera}
        gl={gl}
      />
      <SphereWithCone
        meshRef={meshRef}
        position={position}
        rotation={rotation}
      />
    </>
  );
}

export default function ThreeControls({ width, height, depth }) {
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [mode, setMode] = useState("translate"); // 'translate' or 'rotate'

  return (
    <>
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 999 }}>
        <button
          onClick={() => setMode("translate")}
          style={{ marginRight: 8, padding: "4px 8px" }}
        >
          Translate
        </button>
        <button
          onClick={() => setMode("rotate")}
          style={{ padding: "4px 8px" }}
        >
          Rotate
        </button>
      </div>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{
          position: [width, height, depth],
          fov: 90,
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0);
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <TransparentCuboid width={width} height={height} depth={depth} />
        <DraggablePoint
          cuboidDimensions={{ width, height, depth }}
          position={position}
          setPosition={setPosition}
          rotation={rotation}
          setRotation={setRotation}
          mode={mode}
        />
      </Canvas>
    </>
  );
}
