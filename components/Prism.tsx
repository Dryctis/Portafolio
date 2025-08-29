// components/Prism.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";

type PrismProps = {
  height?: number;
  baseWidth?: number;
  animationType?: "rotate" | "hover" | "3drotate";
  glow?: number;
  offset?: { x?: number; y?: number };
  noise?: number;
  transparent?: boolean;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  hoverStrength?: number;
  inertia?: number;
  bloom?: number;
  suspendWhenOffscreen?: boolean;
  timeScale?: number;

  /** —— NUEVO: control visual/external —— */
  className?: string;
  style?: React.CSSProperties;
  /** Opacidad en light/dark (por defecto más suave en light) */
  opacityLight?: number; // 0–1
  opacityDark?: number;  // 0–1
  /** CSS para máscara opcional (radial/linear). Ej: 'radial-gradient(...)' */
  maskCss?: string;
  /** Límite de DPR para bajar carga en móviles */
  dprCap?: number; // default 1.5
  /** Escala extra en móviles (multiplicador) */
  mobileScale?: number; // default 0.85
};

const Prism: React.FC<PrismProps> = ({
  height = 3.5,
  baseWidth = 5.5,
  animationType = "rotate",
  glow = 1,
  offset = { x: 0, y: 0 },
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = true,
  timeScale = 0.5,

  className,
  style,
  opacityLight = 0.55,
  opacityDark = 0.75,
  maskCss,
  dprCap = 2,
  mobileScale = 0.85,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Opacidad y escala según tema/dispositivo
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsDark(
      document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    setPrefersReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const mqDark = window.matchMedia("(prefers-color-scheme: dark)");
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onDark = () => setIsDark(mqDark.matches);
    const onMob = () => setIsMobile(mqMobile.matches);
    const onRed = () => setPrefersReduced(mqReduce.matches);
    mqDark.addEventListener("change", onDark);
    mqMobile.addEventListener("change", onMob);
    mqReduce.addEventListener("change", onRed);
    return () => {
      mqDark.removeEventListener("change", onDark);
      mqMobile.removeEventListener("change", onMob);
      mqReduce.removeEventListener("change", onRed);
    };
  }, []);

  const containerOpacity = isDark ? opacityDark : opacityLight;
  const effectiveScale = useMemo(
    () => scale * (isMobile ? mobileScale : 1),
    [scale, isMobile, mobileScale]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const GLOW = Math.max(0.0, glow);
    const NOISE = Math.max(0.0, noise);
    const offX = offset?.x ?? 0;
    const offY = offset?.y ?? 0;
    const SAT = transparent ? 1.5 : 1;
    const SCALE = Math.max(0.001, effectiveScale);
    const HUE = hueShift || 0;
    const CFREQ = Math.max(0.0, colorFrequency || 1);
    const BLOOM = Math.max(0.0, bloom || 1);
    // Si el usuario prefiere menos movimiento, frenamos la animación
    const TS = Math.max(0, prefersReduced ? 0 : timeScale || 1);
    const HOVSTR = Math.max(0, hoverStrength || 1);
    const INERT = Math.max(0, Math.min(1, inertia || 0.12));

    const dpr = Math.min(dprCap, window.devicePixelRatio || 1);
    const renderer = new Renderer({ dpr, alpha: transparent, antialias: false });
    const gl = renderer.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);

    Object.assign(gl.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      display: "block",
      pointerEvents: "none",
    } as Partial<CSSStyleDeclaration>);
    container.appendChild(gl.canvas);

    const vertex = /* glsl */ `
      attribute vec2 position;
      void main(){ gl_Position = vec4(position, 0.0, 1.0); }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      uniform vec2  iResolution; uniform float iTime;
      uniform float uHeight; uniform float uBaseHalf; uniform mat3  uRot; uniform int uUseBaseWobble;
      uniform float uGlow; uniform vec2 uOffsetPx; uniform float uNoise; uniform float uSaturation;
      uniform float uScale; uniform float uHueShift; uniform float uColorFreq; uniform float uBloom;
      uniform float uCenterShift; uniform float uInvBaseHalf; uniform float uInvHeight;
      uniform float uMinAxis; uniform float uPxScale; uniform float uTimeScale;
      vec4 tanh4(vec4 x){ vec4 e2x = exp(2.0*x); return (e2x - 1.0) / (e2x + 1.0); }
      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453123); }
      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x)*uInvBaseHalf, abs(p.y)*uInvHeight, abs(p.z)*uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0; return m * uMinAxis * 0.5773502691896258;
      }
      float sdPyramidUpInv(vec3 p){ float oct = sdOctaAnisoInv(p); float halfSpace = -p.y; return max(oct, halfSpace); }
      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(0.299,0.587,0.114, 0.299,0.587,0.114, 0.299,0.587,0.114);
        mat3 U = mat3(0.701,-0.587,-0.114, -0.299,0.413,-0.114, -0.300,-0.588,0.886);
        mat3 V = mat3(0.168,-0.331,0.500, 0.328,0.035,-0.500, -0.497,0.296,0.201);
        return W + U*c + V*s;
      }
      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5*iResolution.xy - uOffsetPx) * uPxScale;
        float z = 5.0, d = 0.0; vec3 p; vec4 o = vec4(0.0);
        float centerShift = uCenterShift; float cf = uColorFreq;
        mat2 wob = mat2(1.0);
        if(uUseBaseWobble==1){
          float t=iTime*uTimeScale; float c0=cos(t+0.0); float c1=cos(t+33.0); float c2=cos(t+11.0);
          wob = mat2(c0,c1,c2,c0);
        }
        const int STEPS = 100;
        for(int i=0;i<STEPS;i++){
          p = vec3(f,z); p.xz = p.xz*wob; p = uRot*p; vec3 q = p; q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * cf + vec4(0.0,1.0,2.0,3.0)) + 1.0) / d;
        }
        o = tanh4(o * o * (uGlow * uBloom) / 1e5);
        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);
        float L = dot(col, vec3(0.2126,0.7152,0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);
        if(abs(uHueShift) > 0.0001){ col = clamp(hueRotation(uHueShift)*col, 0.0, 1.0); }
        gl_FragColor = vec4(col, o.a);
      }
    `;

    const geometry = new Triangle(gl);
    const iResBuf = new Float32Array(2);
    const offsetPxBuf = new Float32Array(2);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: iResBuf },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: 1 },
        uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
        uGlow: { value: GLOW },
        uOffsetPx: { value: offsetPxBuf },
        uNoise: { value: NOISE },
        uSaturation: { value: SAT },
        uScale: { value: SCALE },
        uHueShift: { value: HUE },
        uColorFreq: { value: CFREQ },
        uBloom: { value: BLOOM },
        uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: { value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE) },
        uTimeScale: { value: TS },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      renderer.setSize(w, h);
      iResBuf[0] = gl.drawingBufferWidth;
      iResBuf[1] = gl.drawingBufferHeight;
      const d = Math.min(dprCap, window.devicePixelRatio || 1);
      offsetPxBuf[0] = offX * d;
      offsetPxBuf[1] = offY * d;
      program.uniforms.uPxScale.value =
        1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    const rotBuf = new Float32Array(9);
    const setMat3FromEuler = (
      yawY: number,
      pitchX: number,
      rollZ: number,
      out: Float32Array
    ) => {
      const cy = Math.cos(yawY),
        sy = Math.sin(yawY);
      const cx = Math.cos(pitchX),
        sx = Math.sin(pitchX);
      const cz = Math.cos(rollZ),
        sz = Math.sin(rollZ);
      const r00 = cy * cz + sy * sx * sz,
        r01 = -cy * sz + sy * sx * cz,
        r02 = sy * cx;
      const r10 = cx * sz,
        r11 = cx * cz,
        r12 = -sx;
      const r20 = -sy * cz + cy * sx * sz,
        r21 = sy * sz + cy * sx * cz,
        r22 = cy * cx;
      out.set([r00, r10, r20, r01, r11, r21, r02, r12, r22]);
      return out;
    };

    const NOISE_IS_ZERO = NOISE < 1e-6;
    let raf = 0;
    const t0 = performance.now();
    const startRAF = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const stopRAF = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const rnd = () => Math.random();
    const wX = 0.3 + rnd() * 0.6,
      wY = 0.2 + rnd() * 0.7,
      wZ = 0.1 + rnd() * 0.5;
    const phX = rnd() * Math.PI * 2,
      phZ = rnd() * Math.PI * 2;

    let yaw = 0,
      pitch = 0,
      roll = 0;
    let targetYaw = 0,
      targetPitch = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const pointer = { x: 0, y: 0, inside: true };
    const onMove = (e: PointerEvent) => {
      const ww = Math.max(1, window.innerWidth);
      const wh = Math.max(1, window.innerHeight);
      const nx = (e.clientX - ww * 0.5) / (ww * 0.5);
      const ny = (e.clientY - wh * 0.5) / (wh * 0.5);
      pointer.x = Math.max(-1, Math.min(1, nx));
      pointer.y = Math.max(-1, Math.min(1, ny));
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
    };
    const onBlur = () => {
      pointer.inside = false;
    };

    let onPointerMove: ((e: PointerEvent) => void) | null = null;
    const enableHover = animationType === "hover" && !prefersReduced;
    if (enableHover) {
      onPointerMove = (e: PointerEvent) => {
        onMove(e);
        startRAF();
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onBlur);
      program.uniforms.uUseBaseWobble.value = 0;
    } else if (animationType === "3drotate") {
      program.uniforms.uUseBaseWobble.value = 0;
    } else {
      program.uniforms.uUseBaseWobble.value = 1;
    }

    const render = (t: number) => {
      const time = (t - t0) * 0.001;
      program.uniforms.iTime.value = time;

      let keep = true;
      if (enableHover) {
        const maxPitch = 0.6 * HOVSTR,
          maxYaw = 0.6 * HOVSTR;
        targetYaw = (pointer.inside ? -pointer.x : 0) * maxYaw;
        targetPitch = (pointer.inside ? pointer.y : 0) * maxPitch;
        yaw = lerp(yaw, targetYaw, INERT);
        pitch = lerp(pitch, targetPitch, INERT);
        roll = lerp(roll, 0, 0.1);
        program.uniforms.uRot.value = setMat3FromEuler(
          yaw,
          pitch,
          roll,
          rotBuf
        );
        if (NOISE_IS_ZERO) {
          const settled =
            Math.abs(yaw - targetYaw) < 1e-4 &&
            Math.abs(pitch - targetPitch) < 1e-4 &&
            Math.abs(roll) < 1e-4;
          if (settled) keep = false;
        }
      } else if (animationType === "3drotate") {
        const tScaled = time * TS;
        yaw = tScaled * wY;
        pitch = Math.sin(tScaled * wX + phX) * 0.6;
        roll = Math.sin(tScaled * wZ + phZ) * 0.5;
        program.uniforms.uRot.value = setMat3FromEuler(
          yaw,
          pitch,
          roll,
          rotBuf
        );
        if (TS < 1e-6) keep = false;
      } else {
        rotBuf.set([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        program.uniforms.uRot.value = rotBuf;
        if (TS < 1e-6) keep = false;
      }

      renderer.render({ scene: mesh });
      if (keep) raf = requestAnimationFrame(render);
      else raf = 0;
    };

    if (suspendWhenOffscreen) {
      const c = container as unknown as { __prismIO?: IntersectionObserver };
      const io = new IntersectionObserver(
        (entries) => {
          const vis = entries.some((e) => e.isIntersecting);
          vis ? startRAF() : stopRAF();
        },
        { rootMargin: "200px" }
      );
      io.observe(container);
      c.__prismIO = io;
      startRAF();
    } else {
      startRAF();
    }

    return () => {
      stopRAF();
      ro.disconnect();
      if (enableHover && onPointerMove) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onBlur);
      }
      if (suspendWhenOffscreen) {
        const c = container as unknown as { __prismIO?: IntersectionObserver };
        c.__prismIO?.disconnect();
        delete c.__prismIO;
      }
      if (gl.canvas.parentElement === container) container.removeChild(gl.canvas);
    };
  }, [
    // deps visuales y de perf
    height,
    baseWidth,
    animationType,
    glow,
    noise,
    offset?.x,
    offset?.y,
    effectiveScale,
    transparent,
    hueShift,
    colorFrequency,
    timeScale,
    hoverStrength,
    inertia,
    bloom,
    suspendWhenOffscreen,
    prefersReduced,
    dprCap,
  ]);

  return (
    <div
      ref={containerRef}
      className={
        [
          "absolute inset-0 w-full h-full pointer-events-none",
          className ?? "",
        ].join(" ")
      }
      style={{
        opacity: containerOpacity,
        WebkitMaskImage: maskCss,
        maskImage: maskCss,
        ...style,
      }}
      aria-hidden
    />
  );
};

export default Prism;
