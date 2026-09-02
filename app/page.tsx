"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import * as THREE from "three";
import { useMemo, useRef } from "react";

const AFFILIATE_URL =
  "https://reffpa.com/L?tag=d_6033507m_18609c_&site=6033507&ad=18609";

/* =========================================================
   REALISTIC 3D FOOTBALL
   Native geometry only — no external textures/assets.
========================================================= */

function FootballMesh() {
  const group = useRef<THREE.Group>(null);
  const ball = useRef<THREE.Mesh>(null);

  const patches = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 32;
    const radius = 1.015;

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
      const ringCount = Math.max(1, Math.round(4 + ringRadius * 10));

      for (let j = 0; j < ringCount; j++) {
        const theta = (j / ringCount) * Math.PI * 2 + i * 0.37;

        points.push(
          new THREE.Vector3(
            radius * ringRadius * Math.cos(theta),
            radius * y,
            radius * ringRadius * Math.sin(theta)
          )
        );
      }
    }

    return points.filter((_, i) => i % 2 === 0);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !ball.current) return;

    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x += delta * 0.045;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointerY * 0.12,
      0.025
    );

    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -pointerX * 0.08,
      0.025
    );
  });

  return (
    <group ref={group}>
      {/* Soft leather shell */}
      <mesh ref={ball} castShadow receiveShadow>
        <sphereGeometry args={[1.72, 96, 96]} />
        <meshStandardMaterial
          color="#f1f0e9"
          roughness={0.68}
          metalness={0.02}
        />
      </mesh>

      {/* Pentagonal panels */}
      {patches.map((point, index) => {
        const normal = point.clone().normalize();
        const quaternion = new THREE.Quaternion();

        quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          normal
        );

        return (
          <mesh
            key={index}
            position={point.clone().multiplyScalar(1.006)}
            quaternion={quaternion}
            scale={0.78}
          >
            <circleGeometry args={[0.14, 5]} />
            <meshStandardMaterial
              color="#111111"
              roughness={0.8}
            />
          </mesh>
        );
      })}

      {/* Fine panel seams */}
      <mesh scale={1.008}>
        <sphereGeometry args={[1.72, 48, 48]} />
        <meshBasicMaterial
          color="#0a0a0a"
          wireframe
          transparent
          opacity={0.045}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   SCROLL PHYSICS
   The ball starts floating in the hero, then falls and
   performs a small damped bounce when the user scrolls.
========================================================= */

function FallingFootball({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const group = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const currentY = useRef(0.2);

  useFrame((_, delta) => {
    if (!group.current) return;

    const progress = THREE.MathUtils.clamp(scrollProgress, 0, 1);

    // Before scrolling: subtle floating position.
    // During scroll: target becomes lower, simulating gravity.
    const fallStart = 0.035;
    const fallProgress = THREE.MathUtils.smoothstep(
      progress,
      fallStart,
      0.34
    );

    const targetY = THREE.MathUtils.lerp(0.2, -4.5, fallProgress);

    // Follow the scroll-driven target with spring-like inertia.
    velocity.current +=
      (targetY - currentY.current) * 9 * delta;
    velocity.current *= Math.pow(0.78, delta * 60);

    currentY.current += velocity.current * delta;

    // Small rebound around the lower section.
    if (fallProgress > 0.72) {
      const bounceTime = (fallProgress - 0.72) / 0.28;
      const bounce =
        Math.sin(bounceTime * Math.PI * 3) *
        Math.exp(-bounceTime * 5) *
        0.42;

      currentY.current += bounce;
    }

    group.current.position.y = currentY.current;

    // Ball rolls as it lands.
    group.current.rotation.x +=
      delta * (0.5 + Math.abs(velocity.current) * 0.18);

    group.current.rotation.z +=
      delta * 0.12;

    // Subtle parallax.
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      -0.15 + progress * 0.9,
      0.035
    );
  });

  return (
    <group ref={group} position={[-0.15, 0.2, 0]}>
      <FootballMesh />
    </group>
  );
}

function SportsScene({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>;
}) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 10],
        fov: 34,
      }}
      dpr={[1, 1.5]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <ambientLight intensity={0.35} />

      <pointLight
        position={[4, 5, 6]}
        intensity={45}
        color="#d9ff8a"
        distance={16}
      />

      <pointLight
        position={[-5, 1, 4]}
        intensity={30}
        color="#00d9ff"
        distance={15}
      />

      <spotLight
        position={[0, 6, 5]}
        intensity={35}
        angle={0.45}
        penumbra={1}
        castShadow
        color="#ffffff"
      />

      <FallingFootball scrollProgress={scrollProgress.get()} />

      <Environment preset="night" />
    </Canvas>
  );
}

/* =========================================================
   UI
========================================================= */

function CTA({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <a
      href={AFFILIATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#c8ff16] px-8 text-sm font-black text-black shadow-[0_0_45px_rgba(200,255,22,.18)] transition-all duration-300 hover:scale-[1.025] hover:shadow-[0_0_70px_rgba(200,255,22,.32)]"
    >
      <span className="relative z-10">
        {children}
      </span>
      <ArrowRight
        size={17}
        className="relative z-10 transition-transform group-hover:translate-x-1"
      />
      <span className="absolute inset-0 -translate-x-full bg-white/50 transition-transform duration-700 group-hover:translate-x-full" />
    </a>
  );
}

const features = [
  {
    icon: BarChart3,
    n: "01",
    title: "Forme récente",
    text: "Les dernières performances réunies pour identifier rapidement la dynamique d’une équipe.",
  },
  {
    icon: TrendingUp,
    n: "02",
    title: "Tendances",
    text: "Buts, résultats et statistiques utiles présentés sans noyer l’essentiel.",
  },
  {
    icon: ShieldCheck,
    n: "03",
    title: "Contexte",
    text: "Un regard complémentaire sur les facteurs susceptibles d’influencer la rencontre.",
  },
];

export default function Home() {
  const { scrollYProgress } = useScroll();

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.7,
  });

  const heroOpacity = useTransform(
    smoothScroll,
    [0, 0.18],
    [1, 0]
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-[#c8ff16] selection:text-black">
      {/* =====================================================
          ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[20%] top-[5%] h-[600px] w-[600px] rounded-full bg-cyan-400/[0.045] blur-[160px]" />
        <div className="absolute bottom-[10%] right-[5%] h-[600px] w-[600px] rounded-full bg-[#c8ff16]/[0.035] blur-[160px]" />

        <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:70px_70px]" />
      </div>

      {/* =====================================================
          NAV
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-[1480px] px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex h-[68px] items-center justify-between rounded-2xl border border-white/[0.08] bg-[#050505]/75 px-4 backdrop-blur-2xl sm:px-6">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c8ff16] text-black">
                <Zap
                  size={18}
                  fill="currentColor"
                />
              </div>

              <div>
                <div className="text-[15px] font-black tracking-[-0.03em]">
                  EDGE<span className="text-[#c8ff16]">SPORT</span>
                </div>

                <div className="hidden text-[8px] uppercase tracking-[0.28em] text-white/30 sm:block">
                  Sports Intelligence
                </div>
              </div>
            </a>

            <nav className="hidden items-center gap-9 text-xs font-semibold text-white/40 lg:flex">
              <a
                href="#features"
                className="transition hover:text-white"
              >
                ANALYSE
              </a>
              <a
                href="#method"
                className="transition hover:text-white"
              >
                MÉTHODE
              </a>
              <a
                href="#why"
                className="transition hover:text-white"
              >
                POURQUOI NOUS
              </a>
            </nav>

            <a
              href={AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 bg-white px-5 py-3 text-[11px] font-black text-black transition hover:bg-[#c8ff16] sm:text-xs"
            >
              1xBET
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO + 3D FOOTBALL
      ====================================================== */}

      <section className="relative min-h-[125vh]">
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <SportsScene
            scrollProgress={smoothScroll}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1480px] items-center px-5 pb-24 pt-32 sm:px-8 lg:px-12">
          <motion.div
            style={{ opacity: heroOpacity }}
            className="relative max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-7 inline-flex items-center gap-2 border-l-2 border-[#c8ff16] pl-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/50"
            >
              <Sparkles
                size={13}
                className="text-[#c8ff16]"
              />
              Analyse sportive avant-match
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08 }}
              className="text-[4rem] font-black leading-[0.86] tracking-[-0.075em] sm:text-[5.7rem] lg:text-[7rem] xl:text-[8.2rem]"
            >
              VOYEZ
              <br />
              LE MATCH
              <br />
              <span className="text-white/20">
                AUTREMENT.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 max-w-lg text-sm leading-7 text-white/45 sm:text-base"
            >
              Forme récente, statistiques et tendances :
              une lecture simple des informations qui
              comptent avant le coup d’envoi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <CTA>Découvrir 1xBet</CTA>

              <a
                href="#features"
                className="inline-flex h-14 items-center gap-2 rounded-full border border-white/10 px-6 text-xs font-bold text-white/60 transition hover:border-white/20 hover:text-white"
              >
                Explorer
                <ArrowDown size={15} />
              </a>
            </motion.div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.16em] text-white/25">
              <span className="flex items-center gap-2">
                <Check
                  size={12}
                  className="text-[#c8ff16]"
                />
                Avant-match
              </span>

              <span className="flex items-center gap-2">
                <Check
                  size={12}
                  className="text-[#c8ff16]"
                />
                Data sportive
              </span>

              <span className="flex items-center gap-2">
                <Check
                  size={12}
                  className="text-[#c8ff16]"
                />
                Lecture claire
              </span>
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute bottom-16 left-1/2 z-20 hidden -translate-x-1/2 lg:block">
          <div className="flex flex-col items-center gap-3 text-[8px] uppercase tracking-[0.35em] text-white/20">
            Scroll

            <div className="h-12 w-px bg-gradient-to-b from-[#c8ff16] to-transparent" />
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section
        id="features"
        className="relative z-10 border-y border-white/[0.07] py-24"
      >
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff16]">
                01 / Intelligence
              </div>

              <h2 className="mt-6 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                Moins de bruit.
                <br />
                <span className="text-white/25">
                  Plus de signal.
                </span>
              </h2>
            </div>

            <p className="max-w-2xl self-end text-base leading-8 text-white/40">
              L’objectif n’est pas de vous donner des
              centaines de chiffres. C’est de mettre en
              évidence les informations pertinentes afin
              de mieux comprendre une rencontre avant son
              commencement.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="group relative min-h-[330px] bg-[#080808] p-8 transition hover:bg-[#0b0b0b] lg:p-10"
                >
                  <div className="flex justify-between">
                    <Icon
                      size={23}
                      className="text-[#c8ff16]"
                    />

                    <span className="font-mono text-[10px] text-white/20">
                      {feature.n}
                    </span>
                  </div>

                  <div className="absolute bottom-9 left-8 right-8 lg:left-10 lg:right-10">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {feature.title}
                    </h3>

                    <p className="mt-4 max-w-sm text-sm leading-7 text-white/35">
                      {feature.text}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          METHOD
      ====================================================== */}

      <section
        id="method"
        className="relative z-10 py-28"
      >
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c8ff16]">
                02 / Process
              </div>

              <h2 className="mt-6 text-4xl font-black leading-[0.94] tracking-[-0.05em] sm:text-5xl">
                Une méthode
                <br />
                <span className="text-white/25">
                  en quatre étapes.
                </span>
              </h2>
            </div>

            <div>
              {[
                [
                  "01",
                  "Identifier",
                  "Repérer les rencontres qui méritent une analyse.",
                ],
                [
                  "02",
                  "Comparer",
                  "Mettre en parallèle forme, résultats et statistiques.",
                ],
                [
                  "03",
                  "Contextualiser",
                  "Ajouter les éléments qui peuvent changer la lecture.",
                ],
                [
                  "04",
                  "Synthétiser",
                  "Conserver uniquement les informations vraiment utiles.",
                ],
              ].map(([n, title, text]) => (
                <div
                  key={n}
                  className="group grid gap-5 border-t border-white/[0.08] py-7 sm:grid-cols-[55px_180px_1fr] sm:items-center"
                >
                  <span className="font-mono text-xs text-[#c8ff16]">
                    {n}
                  </span>

                  <span className="text-lg font-bold">
                    {title}
                  </span>

                  <span className="text-sm leading-6 text-white/35">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section
        id="why"
        className="relative z-10 pb-10"
      >
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden bg-[#c8ff16] px-6 py-20 text-center text-black sm:px-12 lg:py-28">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-[130px]" />

            <div className="relative z-10">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#c8ff16]">
                <Zap
                  size={18}
                  fill="currentColor"
                />
              </div>

              <h2 className="mx-auto mt-7 max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                LE PROCHAIN
                <br />
                MATCH COMMENCE ICI.
              </h2>

              <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-black/55 sm:text-base">
                Explorez la plateforme 1xBet et prenez le
                temps d’analyser les informations disponibles
                avant chaque rencontre.
              </p>

              <a
                href={AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 inline-flex h-14 items-center gap-2 rounded-full bg-black px-8 text-sm font-black text-white transition hover:scale-[1.03]"
              >
                Accéder à 1xBet
                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-9 text-[10px] uppercase tracking-[0.08em] text-white/20 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div>© {new Date().getFullYear()} EDGESPORT</div>

          <div className="max-w-xl text-center normal-case leading-6 tracking-normal">
            18+ · Jouez de manière responsable. Les paris
            sportifs comportent un risque de perte financière.
            Aucun résultat n’est garanti.
          </div>

          <div className="flex items-center gap-2">
            <Users size={13} />
            18+
          </div>
        </div>
      </footer>
    </main>
  );
}
