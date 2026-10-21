"use client";

import { useEffect, useRef } from "react";

// Animated monochrome diagonal light beams behind the hero heading. The light
// theme shows them inverted to dark grey (see globals.css). Under
// prefers-reduced-motion it draws one still frame. Drawing pauses while it is
// off screen or hidden.

// Time used for the still frame under reduced motion.
const STILL_TIME = 2.4;

const VS_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FS_SOURCE = `
  precision highp float;
  varying vec2 v_uv;
  // Size in CSS pixels, so beams look the same on every pixel density.
  uniform vec2 u_resolution;
  uniform float u_dpr;
  // Shrinks the beams to fit narrow boxes (1.0 on wide screens).
  uniform float u_scale;
  uniform float u_time;

  // High-frequency hash for the stippled film grain.
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Smooth value noise for the flowing shimmer along the beams.
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // One diagonal beam. Returns vec2(stippled core, soft glow).
  vec2 beam(
    vec2 rotP,
    float xCenter,
    float baseWidth,
    float yCenter,
    float length,
    float flipSharpEdge,
    float phase,
    float speed
  ) {
    // Staggered fade in and out, 0.35 to 1.0.
    float fadeCycle = 0.35 + 0.65 * (0.5 + 0.5 * sin(u_time * speed + phase));

    // Slight sideways drift and width breathing.
    float xDrift = sin(u_time * (speed * 0.65) + phase * 1.7) * 10.0;
    float width = baseWidth * (0.86 + 0.24 * sin(u_time * (speed * 0.8) + phase));
    float dx = (rotP.x - (xCenter + xDrift)) / width + 0.5;

    // Movement along the diagonal.
    float ySlide = yCenter + sin(u_time * (speed * 0.9) + phase * 1.3) * 68.0;
    float dy = abs(rotP.y - ySlide) / (length * 0.5);
    float axialMask = 1.0 - smoothstep(0.42, 1.0, dy);

    // Bright wave travelling down the beam.
    float wave = 0.58 + 0.42 * sin(rotP.y * 0.011 - u_time * (speed * 2.1) + phase * 2.0);
    wave = pow(wave, 1.4);

    // Razor-sharp edge on one side, feathered decay across the width.
    float u = flipSharpEdge > 0.5 ? (1.0 - dx) : dx;
    float core = 0.0;
    if (dx >= -0.2 && dx <= 1.2) {
      float sharpSide = smoothstep(0.0, 0.032, u);
      float softSide = 1.0 - smoothstep(0.14, 1.0, u);
      core = sharpSide * pow(max(0.0, softSide), 1.2) * axialMask * fadeCycle * (0.55 + 0.65 * wave);
    }

    // Soft glow around the beam.
    float d = abs(dx - 0.38);
    float haloX = exp(-d * d * 2.4);
    float haloY = 1.0 - smoothstep(0.25, 1.18, dy);
    float glow = haloX * haloY * fadeCycle * (0.45 + 0.55 * wave) * 0.62;

    return vec2(core, glow);
  }

  void main() {
    vec2 fragPx = vec2(v_uv.x * u_resolution.x, (1.0 - v_uv.y) * u_resolution.y);
    vec2 center = u_resolution * vec2(0.5, 0.45);
    vec2 p = (fragPx - center) / u_scale;

    // Top-left to bottom-right diagonal (41.5 degrees).
    float ang = 0.725;
    float ca = cos(ang);
    float sa = sin(ang);
    vec2 rotP = vec2(p.x * ca - p.y * sa, p.x * sa + p.y * ca);

    // Six parallel beams with staggered phases and speeds.
    vec2 b0 = beam(rotP, -238.0,  64.0,  60.0, 340.0, 0.0, 0.2, 1.15) * 0.76;
    vec2 b1 = beam(rotP, -148.0,  88.0,  15.0, 480.0, 0.0, 1.6, 0.95) * 0.98;
    vec2 b2 = beam(rotP,  -38.0, 106.0, -10.0, 540.0, 1.0, 3.0, 1.05) * 1.05;
    vec2 b3 = beam(rotP,   74.0,  96.0,   8.0, 500.0, 1.0, 4.3, 0.88) * 1.00;
    vec2 b4 = beam(rotP,  178.0,  76.0, -25.0, 410.0, 1.0, 5.5, 1.22) * 0.85;
    vec2 b5 = beam(rotP,  260.0,  42.0, -55.0, 290.0, 1.0, 2.1, 1.35) * 0.64;

    float core = max(max(b0.x, b1.x), max(max(b2.x, b3.x), max(b4.x, b5.x)));
    core += 0.16 * (b1.x * b2.x + b2.x * b3.x + b3.x * b4.x);
    float glow = (b0.y + b1.y + b2.y + b3.y + b4.y + b5.y) * 0.42;

    // Elliptical fade so the beams never reach the navbar or the preview.
    vec2 normDist = (fragPx - center) / (u_resolution * vec2(0.35, 0.44));
    float radialFade = 1.0 - smoothstep(0.45, 1.0, length(normDist));
    radialFade = pow(max(0.0, radialFade), 1.15);
    core *= radialFade;
    glow *= radialFade;

    // Animated film grain on the feathered edges.
    float grain = hash12(fragPx * u_dpr + vec2(sin(u_time * 3.7) * 40.0, cos(u_time * 2.9) * 40.0));
    float flowingNoise = vnoise(rotP * vec2(0.08, 0.025) - vec2(0.0, u_time * 1.8));
    float envelope = 4.0 * core * (1.0 - clamp(core, 0.0, 1.0));
    float dithered = clamp(
      core + (grain - 0.5) * 0.38 * envelope + (flowingNoise - 0.5) * 0.12 * core,
      0.0,
      1.0
    );

    float energy = clamp(dithered + glow * 0.58, 0.0, 1.0);

    // Monochrome ramp: deep zinc, slate grey, silver, and a crest kept well
    // below the white heading so the text stays readable.
    vec3 zinc   = vec3(32.0, 32.0, 38.0) / 255.0;
    vec3 slate  = vec3(70.0, 70.0, 80.0) / 255.0;
    vec3 silver = vec3(120.0, 120.0, 132.0) / 255.0;
    vec3 crest  = vec3(140.0, 140.0, 152.0) / 255.0;

    vec3 col = mix(zinc, slate, smoothstep(0.08, 0.38, energy));
    col = mix(col, silver, smoothstep(0.35, 0.72, energy));
    col = mix(col, crest, smoothstep(0.70, 0.99, dithered));

    // Transparent outside the beams, so the glow behind the canvas shows.
    float beamAlpha = smoothstep(0.015, 0.88, energy) * 0.85;
    float bloomAlpha = clamp(pow(glow, 1.3) * 0.4 * radialFade, 0.0, 1.0);
    float alpha = beamAlpha + bloomAlpha * (1.0 - beamAlpha);
    vec3 finalCol = (col * beamAlpha + silver * bloomAlpha * (1.0 - beamAlpha)) / max(alpha, 0.001);
    gl_FragColor = vec4(clamp(finalCol, 0.0, 1.0), alpha);
  }
`;

// The beam cluster is about 800px across at scale 1. Fit it to the box.
function beamScale(width: number) {
  return Math.min(1, Math.max(0.5, width / 900));
}

type Painter = { resize: () => void; draw: (time: number) => void };

function createWebGLPainter(canvas: HTMLCanvasElement): Painter | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
  });
  if (!gl) return null;

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

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const posLoc = gl.getAttribLocation(prog, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const resLoc = gl.getUniformLocation(prog, "u_resolution");
  const dprLoc = gl.getUniformLocation(prog, "u_dpr");
  const scaleLoc = gl.getUniformLocation(prog, "u_scale");
  const timeLoc = gl.getUniformLocation(prog, "u_time");
  let width = 0;
  let height = 0;
  let dpr = 1;

  return {
    resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(time) {
      gl.uniform2f(resLoc, width, height);
      gl.uniform1f(dprLoc, dpr);
      gl.uniform1f(scaleLoc, beamScale(width));
      gl.uniform1f(timeLoc, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
  };
}

// Plain 2D beams for browsers without WebGL.
function create2DPainter(canvas: HTMLCanvasElement): Painter | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  return {
    resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
    },
    draw(time) {
      const t = time * 1.2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width * 0.5, canvas.height * 0.45);
      const scale = beamScale(canvas.width);
      ctx.scale(scale, scale);
      ctx.rotate((-41.5 * Math.PI) / 180);
      [-220, -135, -35, 65, 160].forEach((x, i) => {
        const yOff = Math.sin(t + i) * 35;
        const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.2 + i));
        const g = ctx.createLinearGradient(x, 0, x + 86, 0);
        g.addColorStop(0, `rgba(140, 140, 152, ${(0.85 * pulse).toFixed(2)})`);
        g.addColorStop(0.65, `rgba(92, 92, 104, ${(0.5 * pulse).toFixed(2)})`);
        g.addColorStop(1, "rgba(7, 7, 9, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(x, -220 + yOff, 86, 440);
      });
      ctx.restore();
    },
  };
}

export function HeroBeams() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const painter = createWebGLPainter(canvas) ?? create2DPainter(canvas);
    if (!painter) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      painter.draw((now - start) * 0.001);
      frame = requestAnimationFrame(tick);
    };

    const onResize = () => {
      painter.resize();
      if (still) painter.draw(STILL_TIME);
    };
    onResize();
    window.addEventListener("resize", onResize);

    // Pauses off screen. Resize on show, since a canvas mounted while hidden
    // has no size.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (!entry.isIntersecting) return;
      onResize();
      if (!still) frame = requestAnimationFrame(tick);
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="hero-beams" aria-hidden="true">
      <div className="hero-beams-glow" />
      <canvas ref={canvasRef} className="hero-beams-canvas" />
    </div>
  );
}
