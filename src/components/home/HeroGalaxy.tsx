"use client";

import { useEffect, useRef } from "react";

// A slowly turning spiral galaxy of fine monochrome grains behind the hero
// copy. The geometry is generated once from a fixed seed; all motion (rotation,
// drift along the arms, turbulence, twinkle, the cursor ripple) runs in the
// vertex shader, so nothing re-renders per frame. The light theme draws the
// same grains in dark graphite. Under prefers-reduced-motion it draws one still
// frame with no pointer response. Drawing pauses while off screen or hidden.
// Without WebGL it renders nothing and the hero stays plain.

// Time used for the still frame under reduced motion.
const STILL_TIME = 40;
// Fixed seed, so the galaxy looks the same on every visit.
const SEED = 0x5eed2026;

// Floats per particle: layer, s0|radius, offset|angle, height, dr, dtheta,
// size, brightness, phase, warm.
const STRIDE = 10;

const VS_SOURCE = `
  attribute vec4 a_geo;
  attribute vec2 a_scatter;
  attribute vec4 a_look;

  uniform float u_time;
  uniform vec2 u_res;
  uniform float u_dpr;
  uniform vec2 u_center;
  uniform float u_scale;
  // Eased mouse tilt: x = yaw, y = pitch, in radians.
  uniform vec2 u_tilt;
  uniform vec2 u_pointer;
  uniform float u_pointerAmt;
  // Copy box in CSS px: centre and half size. Grains dim inside it.
  uniform vec4 u_text;
  uniform float u_light;
  uniform float u_opacity;

  varying vec3 v_color;
  varying float v_alpha;

  const float TAU = 6.2831853;

  void main() {
    float layer = a_geo.x;
    float phase = a_look.z;
    float r;
    float theta;
    float fade = 1.0;

    if (layer < 0.5) {
      // Arm grain: flows slowly outward along a logarithmic spiral and wraps,
      // fading in and out at the ends so nothing pops.
      float s = fract(a_geo.y + u_time * 0.0032);
      float r0 = 0.07 + 0.93 * s;
      float w = 0.016 + 0.06 * r0;
      r = r0 + a_scatter.x * w;
      theta = a_geo.z + 2.3 * log(r0 / 0.07) + a_scatter.y * w * 1.2 / max(r0, 0.08);
      fade = smoothstep(0.0, 0.06, s) * (1.0 - smoothstep(0.86, 1.0, s));
      theta += u_time * 0.018;
    } else {
      // Core and halo grains orbit; the core turns a little faster.
      r = a_geo.y;
      theta = a_geo.z + u_time * (0.012 + 0.05 / (1.0 + r * 10.0) * step(layer, 1.5));
    }

    // Gentle turbulence, larger toward the rim.
    vec2 disc = vec2(cos(theta), sin(theta)) * r;
    disc += 0.010 * (0.3 + r) * vec2(
      sin(u_time * 0.31 + phase * TAU + r * 9.0),
      cos(u_time * 0.27 + phase * 11.0 + theta * 3.0)
    );
    float h = a_geo.w + 0.006 * sin(u_time * 0.4 + phase * 17.0);

    // Disc in x/y, height in z. Yaw (mouse), then tilt away from the viewer.
    float yaw = u_tilt.x;
    float tilt = 0.98 + u_tilt.y;
    vec3 p = vec3(disc.x, disc.y, h);
    p.xz = vec2(p.x * cos(yaw) - p.z * sin(yaw), p.x * sin(yaw) + p.z * cos(yaw));
    vec2 yz = vec2(p.y * cos(tilt) - p.z * sin(tilt), p.y * sin(tilt) + p.z * cos(tilt));
    float persp = 3.2 / (3.2 + yz.y);
    vec2 screen = vec2(p.x, yz.x) * persp;

    // A slight roll so the disc sits on a gentle diagonal.
    float roll = -0.26;
    screen = vec2(screen.x * cos(roll) - screen.y * sin(roll),
                  screen.x * sin(roll) + screen.y * cos(roll));
    vec2 px = u_center + vec2(screen.x, -screen.y) * u_scale;

    // Cursor ripple: grains near the pointer ease outward a few pixels.
    vec2 d = px - u_pointer;
    float dist = length(d);
    float push = u_pointerAmt * 16.0 * exp(-dist * dist / 16200.0)
      * (0.8 + 0.2 * sin(dist * 0.05 - u_time * 1.6));
    px += d / max(dist, 1.0) * push;

    gl_Position = vec4(px / u_res * 2.0 - 1.0, 0.0, 1.0) * vec4(1.0, -1.0, 1.0, 1.0);
    gl_PointSize = max(1.0, a_look.x * u_dpr * persp);

    // Brightness: per-grain, a slow twinkle, the radial falloff, and dimmer
    // inside the copy so the heading stays the focal point.
    float twinkle = 1.0 + 0.16 * sin(u_time * (0.5 + phase * 1.1) + phase * 40.0);
    float radial = 1.0 - smoothstep(0.62, 1.12, r);
    vec2 q = (px - u_text.xy) / max(u_text.zw, vec2(1.0));
    float textDim = mix(0.28, 1.0, smoothstep(0.55, 1.25, length(q)));
    vec2 e = (px - u_res * 0.5) / (u_res * 0.5);
    float edge = 1.0 - smoothstep(0.72, 1.0, length(e));
    float b = a_look.y;
    v_alpha = clamp(b * 2.0 * twinkle, 0.0, 1.0) * radial * fade * textDim * edge * u_opacity
      * mix(1.0, 0.95, u_light);

    // Dark theme: graphite to silver to soft white, with rare warm grains.
    vec3 dark = mix(vec3(0.34), vec3(0.7), smoothstep(0.15, 0.6, b));
    dark = mix(dark, vec3(0.86), smoothstep(0.7, 1.0, b));
    dark = mix(dark, vec3(0.9, 0.87, 0.81), step(0.97, a_look.w) * step(0.45, b));
    // Light theme: the brighter the grain, the darker the graphite.
    vec3 light = mix(vec3(0.48), vec3(0.1), smoothstep(0.15, 0.9, b));
    v_color = mix(dark, light, u_light);
  }
`;

const FS_SOURCE = `
  precision mediump float;
  varying vec3 v_color;
  varying float v_alpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = v_alpha * (1.0 - smoothstep(0.24, 0.5, d));
    if (a < 0.004) discard;
    gl_FragColor = vec4(v_color * a, a);
  }
`;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Two major and two minor arms, a small bulge, and a sparse halo of dust.
function buildGalaxy(count: number) {
  const rand = mulberry32(SEED);
  const gauss = () => {
    const u = Math.max(rand(), 1e-7);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  const arms = [
    { offset: 0, weight: 0.36 },
    { offset: Math.PI, weight: 0.36 },
    { offset: Math.PI / 2 + 0.25, weight: 0.14 },
    { offset: (3 * Math.PI) / 2 + 0.25, weight: 0.14 },
  ];
  // Star-forming knots along each arm; they flow with the arm, so they last.
  const clumps = arms.map(() =>
    Array.from({ length: 34 }, () => ({ s: rand(), spread: 0.006 + rand() * 0.012 })),
  );

  const data = new Float32Array(count * STRIDE);
  for (let i = 0; i < count; i++) {
    const o = i * STRIDE;
    const pick = rand();
    const phase = rand();
    const warm = rand();

    if (pick < 0.7) {
      let k = 0;
      let acc = arms[0].weight;
      const armPick = rand();
      while (armPick > acc && k < arms.length - 1) acc += arms[++k].weight;
      let s = rand();
      let dr = gauss();
      let dt = gauss();
      if (rand() < 0.32) {
        const c = clumps[k][Math.floor(rand() * clumps[k].length)];
        s = c.s + gauss() * c.spread;
        dr *= 0.35;
        dt *= 0.35;
      }
      s = ((s % 1) + 1) % 1;
      const r0 = 0.07 + 0.93 * s;
      const ridge = Math.exp(-0.28 * (dr * dr + dt * dt));
      data[o] = 0;
      data[o + 1] = s;
      data[o + 2] = arms[k].offset + gauss() * 0.04;
      data[o + 3] = gauss() * 0.022 * (1 - 0.5 * r0);
      data[o + 4] = dr;
      data[o + 5] = dt;
      data[o + 6] = 0.85 + rand() ** 3 * 1.5;
      data[o + 7] = (0.22 + 0.7 * rand() ** 1.6) * (0.45 + 0.55 * ridge);
    } else if (pick < 0.82) {
      const r = Math.abs(gauss()) * 0.11;
      data[o] = 1;
      data[o + 1] = r;
      data[o + 2] = rand() * Math.PI * 2;
      data[o + 3] = gauss() * 0.05 * Math.exp(-r * 6);
      data[o + 6] = 0.75 + rand() ** 3 * 1.1;
      // Restrained core: dim grains so the bulge never washes out the heading.
      data[o + 7] = 0.18 + 0.42 * rand() ** 2;
    } else {
      const r = 0.15 + Math.sqrt(rand()) * 1.15;
      data[o] = 2;
      data[o + 1] = r;
      data[o + 2] = rand() * Math.PI * 2;
      data[o + 3] = gauss() * 0.12;
      data[o + 6] = 0.75 + rand() ** 4 * 1.2;
      data[o + 7] = 0.1 + 0.35 * rand() ** 2;
    }
    data[o + 8] = phase;
    data[o + 9] = warm;
  }
  return data;
}

type Frame = {
  time: number;
  tilt: [number, number];
  pointer: [number, number];
  pointerAmt: number;
  light: boolean;
  opacity: number;
};

type Painter = {
  resize: () => void;
  draw: (frame: Frame) => void;
  dispose: () => void;
};

function createPainter(canvas: HTMLCanvasElement, small: boolean): Painter | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  // Strict Mode remounts reuse the canvas, so never force-lose the context
  // on cleanup; a context that is already lost just leaves the hero plain.
  if (!gl || gl.isContextLost()) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, VS_SOURCE);
  const fs = compile(gl.FRAGMENT_SHADER, FS_SOURCE);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const count = small ? 22000 : 55000;
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, buildGalaxy(count), gl.STATIC_DRAW);
  const bind = (name: string, size: number, offset: number) => {
    const loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, STRIDE * 4, offset * 4);
  };
  bind("a_geo", 4, 0);
  bind("a_scatter", 2, 4);
  bind("a_look", 4, 6);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const loc = {
    time: u("u_time"),
    res: u("u_res"),
    dpr: u("u_dpr"),
    center: u("u_center"),
    scale: u("u_scale"),
    tilt: u("u_tilt"),
    pointer: u("u_pointer"),
    pointerAmt: u("u_pointerAmt"),
    text: u("u_text"),
    light: u("u_light"),
    opacity: u("u_opacity"),
  };

  return {
    resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = small ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Centre the galaxy on the hero copy and dim the grains inside it.
      const copy = canvas
        .closest("section")
        ?.querySelector<HTMLElement>("[data-hero-copy]")
        ?.getBoundingClientRect();
      const cx = copy ? copy.left + copy.width / 2 - rect.left : rect.width / 2;
      const hw = copy ? copy.width / 2 : rect.width * 0.3;
      const hh = copy ? copy.height / 2 : rect.height * 0.25;
      // On phones the copy spans the full width, so the galaxy grows and sits
      // a little lower, letting its arms show around and below the copy.
      const narrow = rect.width < 640;
      const cy =
        (copy ? copy.top + copy.height / 2 - rect.top : rect.height * 0.4) +
        (narrow ? hh * 0.6 : 0);
      const scale = narrow
        ? rect.width * 1.0
        : Math.min(rect.width * 0.46, rect.height * 0.95, 720);

      gl.uniform2f(loc.res, rect.width, rect.height);
      gl.uniform1f(loc.dpr, dpr);
      gl.uniform2f(loc.center, cx, cy);
      gl.uniform1f(loc.scale, scale);
      gl.uniform4f(
        loc.text,
        cx,
        cy - (narrow ? hh * 0.6 : 0),
        Math.min(narrow ? hw * 0.8 : hw, 380),
        hh,
      );
    },
    draw(frame) {
      gl.uniform1f(loc.time, frame.time);
      gl.uniform2f(loc.tilt, frame.tilt[0], frame.tilt[1]);
      gl.uniform2f(loc.pointer, frame.pointer[0], frame.pointer[1]);
      gl.uniform1f(loc.pointerAmt, frame.pointerAmt);
      gl.uniform1f(loc.light, frame.light ? 1 : 0);
      gl.uniform1f(loc.opacity, frame.opacity);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}

export function HeroGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const small =
      window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4;
    const painter = createPainter(canvas, small);
    if (!painter) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const isLight = () => root.dataset.theme === "light";
    const start = performance.now();
    let raf = 0;
    let visible = false;
    let lost = false;

    // Eased interaction state, written by listeners and read once per frame.
    const target = { yaw: 0, pitch: 0, x: -9999, y: -9999, amt: 0 };
    const frame: Frame = {
      time: STILL_TIME,
      tilt: [0, 0],
      pointer: [-9999, -9999],
      pointerAmt: 0,
      light: isLight(),
      opacity: 0,
    };

    const drawStill = () => {
      frame.time = STILL_TIME;
      frame.tilt = [0, 0];
      frame.pointerAmt = 0;
      frame.opacity = 1;
      frame.light = isLight();
      painter.draw(frame);
    };

    const tick = (now: number) => {
      const ease = 0.045;
      frame.time = STILL_TIME + (now - start) * 0.001;
      frame.tilt[0] += (target.yaw - frame.tilt[0]) * ease;
      frame.tilt[1] += (target.pitch - frame.tilt[1]) * ease;
      if (frame.pointer[0] < -9000) frame.pointer = [target.x, target.y];
      frame.pointer[0] += (target.x - frame.pointer[0]) * 0.08;
      frame.pointer[1] += (target.y - frame.pointer[1]) * 0.08;
      frame.pointerAmt += (target.amt - frame.pointerAmt) * 0.05;
      frame.opacity = Math.min(1, frame.opacity + 0.012);
      frame.light = isLight();
      painter.draw(frame);
      raf = requestAnimationFrame(tick);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (lost || !visible || document.hidden) return;
      if (motion.matches) drawStill();
      else raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      painter.resize();
      if (motion.matches && visible) drawStill();
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || motion.matches) return;
      const box = canvas.getBoundingClientRect();
      target.yaw = (event.clientX / window.innerWidth - 0.5) * 0.16;
      target.pitch = (event.clientY / window.innerHeight - 0.5) * 0.08;
      target.x = event.clientX - box.left;
      target.y = event.clientY - box.top;
      const inside =
        target.x >= 0 && target.y >= 0 && target.x <= box.width && target.y <= box.height;
      target.amt = inside ? 1 : 0;
    };
    const onLeave = () => {
      target.amt = 0;
    };

    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      sync();
    };

    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    canvas.addEventListener("webglcontextlost", onLost);

    // Redraw the still frame when the theme flips under reduced motion.
    const themeObserver = new MutationObserver(() => {
      if (motion.matches && visible) drawStill();
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // Pauses off screen. Resize on show, since a canvas mounted while hidden
    // has no size.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) painter.resize();
      sync();
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      painter.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
