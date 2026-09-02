"use client";

import {Canvas,useFrame} from "@react-three/fiber";
import {Float,Environment} from "@react-three/drei";
import {motion} from "framer-motion";
import {ArrowRight,BarChart3,Check,ChevronRight,ShieldCheck,Sparkles,TrendingUp,Users,Zap} from "lucide-react";
import * as THREE from "three";
import {useMemo,useRef} from "react";

const AFFILIATE_URL="https://reffpa.com/L?tag=d_6033507m_18609c_&site=6033507&ad=18609";

function Ball({children,position,scale=1,speed=2}:{children:React.ReactNode;position:[number,number,number];scale?:number;speed?:number}){
  const ref=useRef<THREE.Group>(null);
  useFrame((state,delta)=>{
    if(!ref.current)return;
    ref.current.rotation.y+=delta*.35;
    ref.current.rotation.x+=delta*.1;
    ref.current.rotation.x=THREE.MathUtils.lerp(ref.current.rotation.x,state.pointer.y*.15,.025);
    ref.current.rotation.y+=state.pointer.x*.12*delta;
  });
  return <Float speed={speed} rotationIntensity={.7} floatIntensity={.7}><group ref={ref} position={position} scale={scale}>{children}</group></Float>;
}

function Football({position}:{position:[number,number,number]}){
  const patches=useMemo(()=>{
    const a:THREE.Vector3[]=[];
    for(let i=0;i<18;i++){const p=Math.acos(1-2*(i+.5)/18),t=Math.PI*(1+Math.sqrt(5))*i;a.push(new THREE.Vector3(1.035*Math.sin(p)*Math.cos(t),1.035*Math.cos(p),1.035*Math.sin(p)*Math.sin(t)))}return a;
  },[]);
  return <Ball position={position} speed={2.2}>
    <mesh><sphereGeometry args={[1,64,64]}/><meshStandardMaterial color="#f4f4f4" roughness={.35}/></mesh>
    {patches.map((p,i)=>{const q=new THREE.Quaternion();q.setFromUnitVectors(new THREE.Vector3(0,0,1),p.clone().normalize());return <mesh key={i} position={p} quaternion={q}><circleGeometry args={[.16,6]}/><meshStandardMaterial color="#090909"/></mesh>})}
  </Ball>;
}

function Basketball({position}:{position:[number,number,number]}){
  const rings=[[Math.PI/2,0,0],[0,Math.PI/2,0],[0,0,Math.PI/2],[Math.PI/4,0,Math.PI/4]];
  return <Ball position={position} speed={1.7}><mesh><sphereGeometry args={[1,64,64]}/><meshStandardMaterial color="#f46a16" roughness={.65}/></mesh>{rings.map((r,i)=><mesh key={i} rotation={r as [number,number,number]}><torusGeometry args={[1.002,i===3?.014:.018,8,96]}/><meshStandardMaterial color="#111"/></mesh>)}</Ball>;
}

function Tennis({position}:{position:[number,number,number]}){
  return <Ball position={position} scale={.84} speed={2.5}><mesh><sphereGeometry args={[1,64,64]}/><meshStandardMaterial color="#c8ff16" emissive="#6aff00" emissiveIntensity={.13} roughness={.72}/></mesh><mesh rotation={[Math.PI/2,.52,0]} scale={[1,.68,1]}><torusGeometry args={[1.005,.026,10,128]}/><meshStandardMaterial color="#f7ffe6"/></mesh><mesh rotation={[Math.PI/2,-.52,0]} scale={[1,.68,1]}><torusGeometry args={[1.005,.026,10,128]}/><meshStandardMaterial color="#f7ffe6"/></mesh></Ball>;
}

function Volleyball({position}:{position:[number,number,number]}){
  const bands=[[[Math.PI/2,0,0],"#0fd3ff"],[[0,Math.PI/2,0],"#b8ff21"],[[.7,.3,1.2],"#d7ff36"]] as const;
  return <Ball position={position} speed={1.9}><mesh><sphereGeometry args={[1,64,64]}/><meshStandardMaterial color="#eee" roughness={.4}/></mesh>{bands.map(([r,c],i)=><mesh key={i} rotation={r as [number,number,number]}><torusGeometry args={[1.003,.055,12,128]}/><meshStandardMaterial color={c} emissive={c} emissiveIntensity={.08}/></mesh>)}</Ball>;
}

function SportsScene(){
  return <Canvas camera={{position:[0,0,8.5],fov:38}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}}>
    <ambientLight intensity={.5}/>
    <pointLight position={[4,5,5]} intensity={35} color="#00eaff" distance={14}/>
    <pointLight position={[-5,-2,5]} intensity={30} color="#8cff00" distance={14}/>
    <directionalLight position={[0,6,4]} intensity={2.3} color="#fff"/>
    <Football position={[-2.2,1.25,0]}/><Basketball position={[1.95,1.25,-.3]}/><Tennis position={[-1.65,-1.55,.7]}/><Volleyball position={[2.1,-1.4,.3]}/>
    <Environment preset="night"/>
  </Canvas>;
}

const features=[
  [BarChart3,"01","Statistiques","Lecture des performances récentes, buts marqués, buts encaissés et tendances importantes."],
  [TrendingUp,"02","Dynamique","Comprendre rapidement la forme des équipes et les scénarios les plus intéressants avant le coup d’envoi."],
  [ShieldCheck,"03","Contexte","Une présentation claire des facteurs qui peuvent influencer une rencontre sans surcharge d’information."]
] as const;

function CTA({children,secondary=false}:{children:React.ReactNode;secondary?:boolean}){
  return <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className={`group inline-flex h-14 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold transition-all ${secondary?"border border-white/10 bg-white/[.04] text-white hover:bg-white/[.08]":"bg-[#c8ff16] text-black shadow-[0_0_40px_rgba(200,255,22,.22)] hover:shadow-[0_0_60px_rgba(200,255,22,.4)]"}`}>{children}<ArrowRight size={17} className="transition group-hover:translate-x-1"/></a>;
}

export default function Home(){
  return <main className="min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-[#c8ff16] selection:text-black">
    <div className="pointer-events-none fixed inset-0"><div className="absolute left-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-cyan-400/[.06] blur-[140px]"/><div className="absolute bottom-[5%] right-[10%] h-[500px] w-[500px] rounded-full bg-[#b7ff16]/[.05] blur-[150px]"/><div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:60px_60px]"/></div>

    <header className="fixed left-0 right-0 top-0 z-50"><div className="mx-auto max-w-[1440px] px-5 pt-5 lg:px-8"><div className="flex h-[70px] items-center justify-between rounded-full border border-white/[.08] bg-black/50 px-5 backdrop-blur-2xl lg:px-7">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c8ff16]/30 bg-[#c8ff16]/10"><Zap size={19} className="fill-[#c8ff16] text-[#c8ff16]"/></div><div><div className="text-base font-black tracking-tight">EDGE<span className="text-[#c8ff16]">SPORT</span></div><div className="hidden text-[9px] uppercase tracking-[.26em] text-white/30 sm:block">Sports Intelligence</div></div></div>
      <nav className="hidden items-center gap-8 text-sm font-medium text-white/50 lg:flex"><a href="#features" className="hover:text-white">Analyses</a><a href="#process" className="hover:text-white">Méthode</a><a href="#stats" className="hover:text-white">Avantages</a></nav>
      <a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-3 text-xs font-bold text-black transition hover:bg-[#c8ff16] sm:text-sm">Accéder à 1xBet</a>
    </div></div></header>

    <section className="relative min-h-screen"><div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] items-center px-5 pb-10 pt-32 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pt-20">
      <div className="relative z-20"><motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}} className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#c8ff16]/20 bg-[#c8ff16]/[.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#d7ff62]"><Sparkles size={13}/>Analyse sportive nouvelle génération</motion.div>
      <motion.h1 initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.85,delay:.08}} className="max-w-[760px] text-[3.5rem] font-black leading-[.91] tracking-[-.065em] sm:text-[4.6rem] lg:text-[5.2rem] xl:text-[6.2rem]">LE SPORT<br/><span className="text-white/25">SOUS UN</span><br/><span className="bg-gradient-to-r from-[#c8ff16] via-[#dfff74] to-cyan-300 bg-clip-text text-transparent">AUTRE ANGLE.</span></motion.h1>
      <motion.p initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.18}} className="mt-7 max-w-xl text-base leading-8 text-white/46 sm:text-lg">Statistiques, tendances, forme des équipes et lecture des rencontres avant match dans une expérience pensée pour aller droit à l’essentiel.</motion.p>
      <motion.div initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.28}} className="mt-9 flex flex-wrap gap-3"><CTA>Découvrir 1xBet</CTA><a href="#features" className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 px-7 text-sm font-semibold text-white/70 hover:bg-white/[.04] hover:text-white">Voir nos analyses</a></motion.div>
      <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/35"><span className="flex items-center gap-2"><Check size={14} className="text-[#c8ff16]"/>Avant-match</span><span className="flex items-center gap-2"><Check size={14} className="text-[#c8ff16]"/>Statistiques clés</span><span className="flex items-center gap-2"><Check size={14} className="text-[#c8ff16]"/>Lecture simplifiée</span></div></div>
      <motion.div initial={{opacity:0,scale:.86,x:40}} animate={{opacity:1,scale:1,x:0}} transition={{duration:1.3,ease:[.16,1,.3,1]}} className="relative mt-8 h-[480px] lg:mt-0 lg:h-[750px]"><div className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[.08] blur-[90px]"/><SportsScene/><div className="pointer-events-none absolute bottom-[5%] left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"/></motion.div>
    </div></section>

    <section id="stats" className="relative z-10 border-y border-white/[.07]"><div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-white/[.07] px-5 lg:grid-cols-4 lg:px-8">{[["01","Sélection","Matchs ciblés"],["02","Data","Données utiles"],["03","Analyse","Lecture claire"],["04","Décision","Plus de contexte"]].map(([n,t,l])=><div key={n} className="px-5 py-8 lg:px-10 lg:py-10"><div className="mb-5 text-xs font-black text-[#c8ff16]">{n}</div><div className="text-xl font-bold">{t}</div><div className="mt-1 text-xs text-white/30">{l}</div></div>)}</div></section>

    <section id="features" className="relative z-10 py-28"><div className="mx-auto max-w-[1440px] px-5 lg:px-8"><div className="mb-16 grid gap-7 lg:grid-cols-2"><div><div className="mb-5 text-xs font-black uppercase tracking-[.22em] text-[#c8ff16]">L’essentiel, pas le bruit.</div><h2 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-.04em] sm:text-5xl lg:text-6xl">Des données transformées en <span className="text-white/30">lecture claire.</span></h2></div><p className="max-w-xl self-end text-base leading-8 text-white/40 lg:justify-self-end">Nous organisons les informations essentielles autour du match afin de réduire le bruit : dynamique récente, statistiques offensives, tendances et contexte.</p></div>
      <div className="grid gap-4 lg:grid-cols-3">{features.map(([Icon,n,t,d],i)=><motion.article key={t} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} className="group relative min-h-[360px] overflow-hidden rounded-[32px] border border-white/[.08] bg-white/[.025] p-8 hover:border-[#c8ff16]/25"><div className="flex items-start justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[.04]"><Icon size={23} className="text-[#c8ff16]"/></div><span className="font-mono text-xs text-white/20">/ {n}</span></div><div className="absolute bottom-8 left-8 right-8"><h3 className="text-2xl font-bold">{t}</h3><p className="mt-4 max-w-sm leading-7 text-white/38">{d}</p></div></motion.article>)}</div>
    </div></section>

    <section id="process" className="relative z-10 pb-28"><div className="mx-auto max-w-[1440px] px-5 lg:px-8"><div className="overflow-hidden rounded-[38px] border border-white/[.08] bg-gradient-to-br from-white/[.055] to-transparent"><div className="grid lg:grid-cols-[.8fr_1.2fr]"><div className="border-b border-white/[.08] p-8 lg:border-b-0 lg:border-r lg:p-14"><span className="text-xs font-bold uppercase tracking-[.23em] text-[#c8ff16]">Notre méthode</span><h2 className="mt-6 text-4xl font-black tracking-[-.04em] lg:text-5xl">Comprendre<br/>avant d’agir.</h2><p className="mt-6 max-w-sm leading-7 text-white/38">Une expérience construite autour d’une idée simple : rendre les informations sportives plus faciles à interpréter.</p></div><div>{[["01","Identifier","Repérer les rencontres qui méritent réellement une analyse."],["02","Analyser","Comparer forme récente, statistiques et contexte."],["03","Synthétiser","Transformer plusieurs données en lecture concise."],["04","Décider","Utiliser les informations disponibles selon votre propre jugement."]].map(([n,t,d])=><div key={n} className="group grid gap-5 border-b border-white/[.07] p-7 last:border-0 sm:grid-cols-[60px_180px_1fr_30px] sm:items-center lg:px-10"><div className="font-mono text-xs text-[#c8ff16]">{n}</div><div className="font-bold">{t}</div><div className="text-sm leading-6 text-white/35">{d}</div><ChevronRight size={18} className="hidden text-white/20 transition group-hover:translate-x-1 group-hover:text-[#c8ff16] sm:block"/></div>)}</div></div></div></div></section>

    <section className="relative z-10 pb-12"><div className="mx-auto max-w-[1440px] px-5 lg:px-8"><div className="relative overflow-hidden rounded-[38px] border border-[#c8ff16]/15 bg-[#c8ff16] px-6 py-20 text-center text-black sm:px-10"><div className="relative z-10"><div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#c8ff16]"><Zap size={19} fill="currentColor"/></div><h2 className="mx-auto max-w-4xl text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl lg:text-7xl">PRÊT À PASSER<br/>À L’ACTION ?</h2><p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-black/60 sm:text-base">Accédez à la plateforme et découvrez les opportunités disponibles sur les événements sportifs.</p><a href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex h-14 items-center gap-2 rounded-full bg-black px-8 text-sm font-bold text-white transition hover:scale-[1.03]">Accéder à 1xBet<ArrowRight size={17}/></a></div></div></div></section>

    <footer className="relative z-10"><div className="mx-auto flex max-w-[1440px] flex-col gap-7 px-5 py-10 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between lg:px-8"><div>© {new Date().getFullYear()} EDGE SPORT</div><div className="max-w-2xl text-center leading-6">18+ · Jouez de manière responsable. Les paris sportifs comportent un risque de perte financière. Aucun résultat n’est garanti.</div><div className="flex items-center gap-2"><Users size={13}/>18+</div></div></footer>
  </main>;
}