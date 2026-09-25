import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface KnowledgeSphereProps {
  mousePos: { x: number; y: number };
  activeTopic?: string | null;
}

// Inner 3D scene that executes within the R3F Canvas context
const SceneContent: React.FC<KnowledgeSphereProps> = ({ mousePos, activeTopic }) => {
  const mainGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Connection Nodes Coordinates (Consultation Touchpoints)
  const nodeCoordinates = useMemo(
    () => [
      { pos: new THREE.Vector3(3.8, 1.4, 1.2), color: "#C96F42", label: "Software" },
      { pos: new THREE.Vector3(-3.6, 1.8, 1.6), color: "#77816C", label: "Architecture" },
      { pos: new THREE.Vector3(-3.2, -2.2, 1.4), color: "#B89152", label: "Design" },
      { pos: new THREE.Vector3(3.4, -1.8, 1.8), color: "#C96F42", label: "Career" },
      { pos: new THREE.Vector3(0.6, 3.8, -0.8), color: "#77816C", label: "AI & ML" },
      { pos: new THREE.Vector3(-1.2, -3.4, 0.8), color: "#B89152", label: "Strategy" },
    ],
    []
  );

  // Bezier curve connection arcs between nodes
  const { curveGeo1, curveGeo2 } = useMemo(() => {
    const c1 = new THREE.QuadraticBezierCurve3(
      nodeCoordinates[0].pos,
      new THREE.Vector3(1.6, 2.8, 2.4),
      nodeCoordinates[1].pos
    );
    const c2 = new THREE.QuadraticBezierCurve3(
      nodeCoordinates[2].pos,
      new THREE.Vector3(0.4, -3.0, 2.6),
      nodeCoordinates[3].pos
    );
    return {
      curveGeo1: new THREE.BufferGeometry().setFromPoints(c1.getPoints(40)),
      curveGeo2: new THREE.BufferGeometry().setFromPoints(c2.getPoints(40)),
    };
  }, [nodeCoordinates]);

  // Ambient Stardust Warm Particles
  const particlePositions = useMemo(() => {
    const count = 75;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 18;
      positions[i + 1] = (Math.random() - 0.5) * 18;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (mainGroupRef.current) {
      // Smooth mouse parallax lerping (target is calculated from normalized mouse pos)
      const targetRotX = -mousePos.y * 0.32;
      const targetRotY = mousePos.x * 0.42;

      mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        mainGroupRef.current.rotation.x,
        targetRotX + Math.sin(elapsed * 0.8) * 0.04,
        0.06
      );
      mainGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        mainGroupRef.current.rotation.y,
        targetRotY + elapsed * 0.08,
        0.06
      );

      // Gentle floating breathing bounce
      mainGroupRef.current.position.y = Math.sin(elapsed * 1.2) * 0.16;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -elapsed * 0.05;
      coreRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.03;
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x = elapsed * 0.1;
      innerMeshRef.current.rotation.y = elapsed * 0.14;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z = elapsed * 0.12;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -elapsed * 0.09;
    if (ring3Ref.current) ring3Ref.current.rotation.x = elapsed * 0.08;

    if (particlesRef.current) {
      particlesRef.current.rotation.y = elapsed * 0.02;
    }
  });

  return (
    <>
      {/* SOFT WARM LIGHTING RIG */}
      {/* Ambient warm off-white fill */}
      <ambientLight color="#FFF9F2" intensity={1.35} />

      {/* Burnt Orange Primary Key Light */}
      <directionalLight color="#C96F42" position={[10, 12, 10]} intensity={2.2} />

      {/* Muted Sage Fill Light */}
      <directionalLight color="#77816C" position={[-10, -8, -6]} intensity={1.2} />

      {/* Muted Gold Point Glow Light */}
      <pointLight color="#B89152" position={[0, 1.5, 6]} intensity={2.4} distance={30} decay={2} />

      {/* Subsurface Warm Terracotta Accent */}
      <pointLight color="#C96F42" position={[-3, 2.5, 2]} intensity={1.6} distance={18} decay={2} />

      {/* Ambient floating dust particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#B89152"
          size={0.075}
          transparent
          opacity={0.45}
        />
      </points>

      {/* MAIN KNOWLEDGE SPHERE & ORBIT GROUP */}
      <group ref={mainGroupRef}>
        {/* 1. Translucent Knowledge Sphere (Physical Glass / Warm Ivory Core) */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[2.7, 64, 64]} />
          <meshPhysicalMaterial
            color="#FFF9F2"
            transmission={0.7}
            opacity={0.88}
            transparent={true}
            roughness={0.16}
            metalness={0.06}
            ior={1.38}
            emissive="#C96F42"
            emissiveIntensity={activeTopic ? 0.28 : 0.14}
            clearcoat={0.35}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* 2. Inner Glowing Core (Burnt Orange) */}
        <mesh ref={innerMeshRef}>
          <icosahedronGeometry args={[1.75, 2]} />
          <meshStandardMaterial
            color="#C96F42"
            emissive="#C96F42"
            emissiveIntensity={activeTopic ? 0.65 : 0.45}
            roughness={0.3}
            metalness={0.2}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* 3. Inner Lattice Cage (Muted Gold) */}
        <mesh>
          <icosahedronGeometry args={[2.0, 1]} />
          <meshBasicMaterial
            color="#B89152"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* 4. Orbiting Meridian Rings / Ribbons */}
        {/* Ring 1: Muted Gold Meridian */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3.4, Math.PI / 6, 0]}>
          <torusGeometry args={[4.2, 0.032, 16, 100]} />
          <meshStandardMaterial
            color="#B89152"
            metalness={0.75}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Ring 2: Muted Sage Orbit */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, 0, Math.PI / 5]}>
          <torusGeometry args={[4.9, 0.028, 16, 100]} />
          <meshStandardMaterial
            color="#77816C"
            metalness={0.55}
            roughness={0.25}
            transparent
            opacity={0.55}
          />
        </mesh>

        {/* Ring 3: Burnt Orange Horizon */}
        <mesh ref={ring3Ref} rotation={[0, Math.PI / 2.2, Math.PI / 8]}>
          <torusGeometry args={[3.6, 0.024, 16, 80]} />
          <meshStandardMaterial
            color="#C96F42"
            metalness={0.65}
            roughness={0.25}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* 5. Connection Nodes & Curved Beams */}
        {nodeCoordinates.map((node, i) => (
          <mesh key={i} position={node.pos}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.6}
            />
          </mesh>
        ))}

        {/* Curved connection arcs */}
        {/* @ts-ignore - line basic material */}
        <line geometry={curveGeo1}>
          <lineBasicMaterial color="#C96F42" transparent opacity={0.4} />
        </line>
        {/* @ts-ignore - line basic material */}
        <line geometry={curveGeo2}>
          <lineBasicMaterial color="#B89152" transparent opacity={0.35} />
        </line>
      </group>
    </>
  );
};

export const KnowledgeSphereScene: React.FC<KnowledgeSphereProps> = ({ mousePos, activeTopic }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <SceneContent mousePos={mousePos} activeTopic={activeTopic} />
    </Canvas>
  );
};
