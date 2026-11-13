import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const BLUE = '#4da3ff'
const VIOLET = '#8b5cff'
const CYAN = '#3ef0ff'
const MAGENTA = '#ff4fd8'

/** Procedural studio lighting baked once into a cubemap — gives metals real reflections, no HDR download. */
function Studio() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <color attach="background" args={['#05060f']} />
      {/* long, soft horizontal strips read as liquid-chrome bands, not distinct shapes */}
      <Lightformer form="rect" intensity={2.2} color={BLUE} position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[30, 6, 1]} />
      <Lightformer form="rect" intensity={1.6} color={VIOLET} position={[0, 1.5, -9]} scale={[30, 1.2, 1]} />
      <Lightformer form="rect" intensity={1.4} color={CYAN} position={[0, -1.5, -9]} scale={[30, 0.8, 1]} />
      <Lightformer form="rect" intensity={1.2} color={MAGENTA} position={[0, -5, -2]} rotation-x={-Math.PI / 2} scale={[30, 6, 1]} />
      <Lightformer form="rect" intensity={0.8} color={VIOLET} position={[-9, 0, 0]} rotation-y={Math.PI / 2} scale={[30, 10, 1]} />
      <Lightformer form="rect" intensity={0.8} color={BLUE} position={[9, 0, 0]} rotation-y={-Math.PI / 2} scale={[30, 10, 1]} />
    </Environment>
  )
}

/** Liquid-chrome core that leans toward the pointer. */
function Core({ compact }) {
  const group = useRef()
  const mesh = useRef()

  useFrame((state, delta) => {
    const { pointer } = state
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.7, 3, delta)
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.45, 3, delta)
    }
    if (mesh.current) mesh.current.rotation.z += delta * 0.1
  })

  return (
    <group ref={group} scale={compact ? 0.72 : 1}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1.3, 32]} />
          <MeshDistortMaterial color="#3b5bff" roughness={0.22} metalness={0.95} distort={0.38} speed={1.7} envMapIntensity={1.5} />
        </mesh>
        {/* inner energy */}
        <mesh scale={0.55}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* wire lattice */}
        <mesh scale={1.75}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={BLUE} wireframe transparent opacity={0.14} />
        </mesh>
      </Float>
      <GlassHalo />
      <Rings />
    </group>
  )
}

/** Iridescent glass ring tilted around the core. */
function GlassHalo() {
  const ref = useRef()
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * 0.15
  })
  return (
    <mesh ref={ref} rotation={[1.15, 0.35, 0]}>
      <torusGeometry args={[2.05, 0.06, 32, 220]} />
      <meshPhysicalMaterial color="#cfe0ff" metalness={0.9} roughness={0.12} iridescence={1} iridescenceIOR={1.6} clearcoat={1} envMapIntensity={2} />
    </mesh>
  )
}

/** Thin orbital rings with satellites. */
function Rings() {
  const refs = [useRef(), useRef(), useRef()]
  const cfg = useMemo(
    () => [
      { r: 2.6, tilt: [0.4, 1.1, 0.3], speed: -0.2, color: CYAN, opacity: 0.4 },
      { r: 3.05, tilt: [1.7, -0.5, 0.6], speed: 0.13, color: VIOLET, opacity: 0.5 },
      { r: 3.5, tilt: [1.3, 0.6, -0.4], speed: 0.08, color: MAGENTA, opacity: 0.25 },
    ],
    []
  )
  useFrame((_, delta) => {
    refs.forEach((ref, i) => {
      if (ref.current) ref.current.rotation.z += delta * cfg[i].speed
    })
  })
  return cfg.map((c, i) => (
    <group key={i} rotation={c.tilt}>
      <mesh ref={refs[i]}>
        <torusGeometry args={[c.r, 0.006, 8, 200]} />
        <meshBasicMaterial color={c.color} transparent opacity={c.opacity} />
        <mesh position={[c.r, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={c.color} />
        </mesh>
      </mesh>
    </group>
  ))
}

/** Floating chrome / iridescent primitives for depth. */
function Debris() {
  const items = useMemo(
    () => [
      { pos: [-3.6, 1.7, -1], geo: 'oct', color: BLUE, s: 0.24 },
      { pos: [3.3, -1.8, -0.4], geo: 'box', color: CYAN, s: 0.2 },
      { pos: [3.0, 2.1, -1.8], geo: 'tet', color: VIOLET, s: 0.3 },
      { pos: [-2.9, -2.2, -1.2], geo: 'tor', color: MAGENTA, s: 0.2 },
      { pos: [-4.4, -0.1, -2.6], geo: 'ico', color: VIOLET, s: 0.18 },
      { pos: [4.6, 0.4, -2.8], geo: 'oct', color: CYAN, s: 0.2 },
    ],
    []
  )
  return items.map((it, i) => (
    <Float key={i} speed={1 + i * 0.25} rotationIntensity={2.2} floatIntensity={1.5} position={it.pos}>
      <mesh scale={it.s}>
        {it.geo === 'oct' && <octahedronGeometry args={[1, 0]} />}
        {it.geo === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
        {it.geo === 'tet' && <tetrahedronGeometry args={[1, 0]} />}
        {it.geo === 'tor' && <torusGeometry args={[0.8, 0.3, 16, 48]} />}
        {it.geo === 'ico' && <icosahedronGeometry args={[1, 0]} />}
        <meshPhysicalMaterial color={it.color} metalness={0.85} roughness={0.15} iridescence={1} clearcoat={1} flatShading envMapIntensity={1.6} />
      </mesh>
    </Float>
  ))
}

/** Deep starfield shell, slowly turning. */
function Starfield({ count }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 10
      const t = Math.random() * Math.PI * 2
      const p = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(p) * Math.cos(t)
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t)
      arr[i * 3 + 2] = r * Math.cos(p) - 4
    }
    return arr
  }, [count])
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.015
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} sizeAttenuation color="#a9c8ff" transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

/** Pointer parallax + scroll dolly for a cinematic push-in. */
function Rig() {
  useFrame((state, delta) => {
    const { camera, pointer } = state
    const s = Math.min(1, window.scrollY / window.innerHeight)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.7, 2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.45 - s * 0.8, 2, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 7.5 - s * 2.2, 3, delta)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function HeroScene({ active = true, compact = false }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
      frameloop={active ? 'always' : 'never'}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
    >
      <Studio />
      <ambientLight intensity={0.2} />
      <pointLight position={[4, 3, 4]} intensity={30} color={CYAN} />
      <pointLight position={[-4, -2, 3]} intensity={40} color={MAGENTA} />
      <Core compact={compact} />
      {!compact && <Debris />}
      <Starfield count={compact ? 500 : 1400} />
      <Sparkles count={compact ? 30 : 70} scale={[11, 7, 4]} size={2.4} speed={0.35} color={CYAN} opacity={0.7} />
      <Rig />
    </Canvas>
  )
}
