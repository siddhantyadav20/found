import { POST_VERTEX, QUAD, emptyTexture, postFragment, program } from "./rollGl";

/* ===========================================================================
   The chapters page's picture, in raw WebGL 1 (2026-11-01): the posters in a
   row, sharp in the middle and blurred toward the edges, fading to nothing at
   the foot so the title can sit there; and footage mode, two rows of stills
   passing each other. The shading follows siena.film's. Null where WebGL isn't
   available, and the row falls back to the plain <img> underneath.
   =========================================================================== */

const VERTEX = `
attribute vec2 p;
uniform vec4 rect;
varying vec2 uv;
void main() {
  uv = p * .5 + .5;
  uv.y = 1. - uv.y;
  vec2 q = rect.xy + uv * rect.zw;
  gl_Position = vec4(q.x * 2. - 1., 1. - q.y * 2., 0., 1.);
}`;

const COMMON = `
precision highp float;
varying vec2 uv;
uniform sampler2D tex;
uniform vec2 fit;
uniform vec2 size;
uniform float depth;
uniform float alpha;
uniform float radius;
vec3 blur13(vec2 at, vec2 d) {
  vec3 c = vec3(0.);
  vec2 o1 = vec2(1.411764705882353) * d;
  vec2 o2 = vec2(3.2941176470588234) * d;
  vec2 o3 = vec2(5.176470588235294) * d;
  c += texture2D(tex, at).rgb * .1964825501511404;
  c += texture2D(tex, at + o1).rgb * .2969069646728344;
  c += texture2D(tex, at - o1).rgb * .2969069646728344;
  c += texture2D(tex, at + o2).rgb * .09447039785044732;
  c += texture2D(tex, at - o2).rgb * .09447039785044732;
  c += texture2D(tex, at + o3).rgb * .010381362401148057;
  c += texture2D(tex, at - o3).rgb * .010381362401148057;
  return c;
}
float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.) + length(max(q, 0.)) - r;
}
/* The gate of a projector: a rounded frame whose long edges bow very slightly. */
float gate() {
  vec2 c = uv * 2. - 1.;
  vec2 p = (uv - .5) * size;
  p.y *= 1. + .012 * c.x * c.x;
  p.x *= 1. + .006 * c.y * c.y;
  return box(p, size * .5, radius);
}`;

const POSTER_FRAGMENT = `${COMMON}
uniform float footage;
void main() {
  vec2 u = (uv - .5) * fit + .5;
  vec2 step = vec2(5. / 1090., 5. / 1080.);
  vec3 soft = mix(blur13(u, vec2(step.x, 0.)), blur13(u, vec2(0., step.y)), .5);
  vec3 color = texture2D(tex, u).rgb;
  float near = 1. - smoothstep(0., 1.5, abs(depth));
  float far = 1. - smoothstep(0., 5., abs(depth));
  color = mix(soft * far, color, near);
  color *= mix(smoothstep(.07, .42, 1. - uv.y), 1., footage);
  float edge = gate();
  color *= 1. - smoothstep(-size.x * .07, 0., edge) * .55;
  gl_FragColor = vec4(color, (1. - smoothstep(-.75, .75, edge)) * alpha);
}`;

const STILL_FRAGMENT = `${COMMON}
void main() {
  vec2 u = (uv - .5) * fit * .8 + .5;
  float amount = clamp(abs(depth) / 3., 0., 1.);
  vec2 step = amount * vec2(6. / 1090., 6. / 1080.);
  vec3 color = mix(blur13(u, vec2(step.x, 0.)), blur13(u, vec2(0., step.y)), .5);
  float away = distance(uv, vec2(.5));
  color *= .55 + .45 * (1. - smoothstep(.2, .75, away));
  color *= 1. - amount * .6;
  gl_FragColor = vec4(color, (1. - smoothstep(-.75, .75, gate())) * alpha);
}`;

export type Picture = {
  /** Which texture of the set it's drawn from. */
  texture: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** How many places it is from the middle. */
  depth: number;
  alpha: number;
};

export type StripGl = {
  resize(width: number, height: number, dpr: number): void;
  render(posters: readonly Picture[], stills: readonly Picture[], footage: number, speed: number, time: number): void;
  loadPosters(sources: readonly string[]): void;
  loadStills(sources: readonly string[]): void;
  destroy(): void;
};

type Texture = { texture: WebGLTexture; aspect: number };

export function createStripGl(canvas: HTMLCanvasElement): StripGl | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const poster = program(gl, VERTEX, POSTER_FRAGMENT);
  const still = program(gl, VERTEX, STILL_FRAGMENT);
  const post = program(gl, POST_VERTEX, postFragment("vec2(1., 0.)", 2, true));
  const buffer = gl.createBuffer();
  const target = emptyTexture(gl);
  const frame = gl.createFramebuffer();
  if (!poster || !still || !post || !buffer || !target || !frame) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const names = ["rect", "fit", "size", "depth", "alpha", "radius", "footage"] as const;
  const uniforms = (p: WebGLProgram) =>
    Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, n)])) as Record<(typeof names)[number], WebGLUniformLocation | null>;
  const forPoster = uniforms(poster);
  const forStill = uniforms(still);
  const time = gl.getUniformLocation(post, "time");
  const speedAt = gl.getUniformLocation(post, "speed");

  const sets: { posters: Texture[]; stills: Texture[] } = { posters: [], stills: [] };
  let generation = 0;
  let width = 1;
  let height = 1;
  let scale = 1;

  const load = (set: keyof typeof sets, sources: readonly string[]) => {
    const mine = ++generation;
    const old = sets[set];
    const next: Texture[] = [];
    sets[set] = next;
    sources.forEach((src, i) => {
      const image = new Image();
      image.onload = () => {
        if (mine !== generation) return;
        const texture = emptyTexture(gl);
        if (!texture) return;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        next[i] = { texture, aspect: image.naturalWidth / image.naturalHeight };
      };
      image.src = src;
    });
    old.forEach((t) => gl.deleteTexture(t.texture));
  };

  const draw = (list: readonly Picture[], set: readonly Texture[], u: typeof forPoster, radius: number) => {
    gl.uniform1f(u.radius, radius * scale);
    for (const p of list) {
      const t = set[p.texture];
      if (!t || p.alpha <= 0 || p.x > width || p.x + p.w < 0) continue;
      const aspect = p.w / p.h;
      gl.bindTexture(gl.TEXTURE_2D, t.texture);
      gl.uniform4f(u.rect, p.x / width, p.y / height, p.w / width, p.h / height);
      gl.uniform2f(u.fit, aspect < t.aspect ? aspect / t.aspect : 1, aspect < t.aspect ? 1 : t.aspect / aspect);
      gl.uniform2f(u.size, p.w * scale, p.h * scale);
      gl.uniform1f(u.depth, p.depth);
      gl.uniform1f(u.alpha, p.alpha);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };

  return {
    loadPosters: (sources) => load("posters", sources),
    loadStills: (sources) => load("stills", sources),
    resize(w, h, dpr) {
      width = w;
      height = h;
      scale = Math.min(dpr, 2);
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      gl.bindTexture(gl.TEXTURE_2D, target);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, target, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    render(posters, stills, footage, speed, now) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.useProgram(still);
      draw(stills, sets.stills, forStill, 12);
      gl.useProgram(poster);
      gl.uniform1f(forPoster.footage, footage);
      draw(posters, sets.posters, forPoster, 14);
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(post);
      gl.bindTexture(gl.TEXTURE_2D, target);
      gl.uniform1f(time, now);
      gl.uniform1f(speedAt, speed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      generation++;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
