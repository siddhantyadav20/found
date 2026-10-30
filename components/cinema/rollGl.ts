/* ===========================================================================
   The reel's picture, in raw WebGL 1 (2026-10-31): each still drawn into its
   rounded frame with burnt corners and a fade top and bottom, then the whole
   screen through a pass that adds film grain and smears along the direction of
   travel while the reel moves. The shading follows siena.film's; there's no
   library here, because the homepage has a budget. Returns null where WebGL
   isn't available, and the reel falls back to the plain <img> underneath.
   =========================================================================== */

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const PLANE_VERTEX = `
attribute vec2 p;
uniform vec4 rect;
varying vec2 uv;
void main() {
  uv = p * .5 + .5;
  uv.y = 1. - uv.y;
  vec2 q = rect.xy + uv * rect.zw;
  gl_Position = vec4(q.x * 2. - 1., 1. - q.y * 2., 0., 1.);
}`;

const PLANE_FRAGMENT = `
precision highp float;
varying vec2 uv;
uniform sampler2D tex;
uniform vec2 fit;
uniform vec2 size;
uniform float parallax;
uniform float alpha;
uniform float radius;
float dodge(float b, float s) { return s >= 1. ? s : min(b / (1. - s), 1.); }
vec3 dodge(vec3 b, vec3 s) { return vec3(dodge(b.r, s.r), dodge(b.g, s.g), dodge(b.b, s.b)); }
float box(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.) + length(max(q, 0.)) - r;
}
void main() {
  vec2 u = (uv - .5) * fit + .5;
  u.y -= parallax * .3;
  vec3 color = texture2D(tex, u).rgb;
  float a = smoothstep(.1, .4, distance(u, vec2(.15)));
  float b = smoothstep(.1, .4, distance(u, vec2(.85)));
  float grads = a * b;
  color = mix(mix(color * .2, dodge(color, vec3(1., .86, 0.)) * .3, .2), color, grads);
  color *= 1. - smoothstep(.1, .5, distance(u.y, .5));
  // The gate of a projector: a rounded frame whose long edges bow very slightly.
  vec2 c = uv * 2. - 1.;
  vec2 p = (uv - .5) * size;
  p.y *= 1. + .012 * c.x * c.x;
  p.x *= 1. + .006 * c.y * c.y;
  float mask = 1. - smoothstep(-.75, .75, box(p, size * .5, radius));
  gl_FragColor = vec4(color, mask * alpha);
}`;

const POST_VERTEX = `
attribute vec2 p;
varying vec2 uv;
void main() {
  uv = p * .5 + .5;
  gl_Position = vec4(p, 0., 1.);
}`;

const POST_FRAGMENT = `
precision highp float;
varying vec2 uv;
uniform sampler2D tex;
uniform float time;
uniform float speed;
const vec2 dir = vec2(0., 1.);
vec4 blur13(vec2 at, vec2 res, vec2 d) {
  vec4 c = vec4(0.);
  vec2 o1 = vec2(1.411764705882353) * d;
  vec2 o2 = vec2(3.2941176470588234) * d;
  vec2 o3 = vec2(5.176470588235294) * d;
  c += texture2D(tex, at) * .1964825501511404;
  c += texture2D(tex, at + o1 / res) * .2969069646728344;
  c += texture2D(tex, at - o1 / res) * .2969069646728344;
  c += texture2D(tex, at + o2 / res) * .09447039785044732;
  c += texture2D(tex, at - o2 / res) * .09447039785044732;
  c += texture2D(tex, at + o3 / res) * .010381362401148057;
  c += texture2D(tex, at - o3 / res) * .010381362401148057;
  return c;
}
void main() {
  vec4 img = texture2D(tex, uv);
  vec4 smear = blur13(uv, vec2(1920., 1080.), dir * 10.);
  img = mix(img, smear, min(speed * .5, 1.));
  img += smear * speed * 3. * .5;
  float noise = fract(sin(dot(vec2(sin(uv.x + time) + 1., uv.y), vec2(12.9898, 78.233) * 2.)) * 43758.5453);
  img += noise * .07;
  gl_FragColor = vec4(img.rgb, 1.);
}`;

export type Plane = {
  /** Which still, and where its frame is, in CSS pixels. */
  texture: number;
  x: number;
  y: number;
  w: number;
  h: number;
  parallax: number;
};

export type RollGl = {
  resize(width: number, height: number, dpr: number): void;
  render(planes: readonly Plane[], radius: number, alpha: number, speed: number, time: number): void;
  /** Point the stills at a different set (a phone's tall ones, after a resize). */
  load(sources: readonly string[]): void;
  destroy(): void;
};

function program(gl: WebGLRenderingContext, vertex: string, fragment: string) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compile(gl.VERTEX_SHADER, vertex);
  const fs = compile(gl.FRAGMENT_SHADER, fragment);
  const linked = gl.createProgram();
  if (!vs || !fs || !linked) return null;
  gl.attachShader(linked, vs);
  gl.attachShader(linked, fs);
  gl.bindAttribLocation(linked, 0, "p");
  gl.linkProgram(linked);
  return gl.getProgramParameter(linked, gl.LINK_STATUS) ? linked : null;
}

function emptyTexture(gl: WebGLRenderingContext) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  return texture;
}

export function createRollGl(canvas: HTMLCanvasElement): RollGl | null {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "high-performance" });
  if (!gl) return null;

  const plane = program(gl, PLANE_VERTEX, PLANE_FRAGMENT);
  const post = program(gl, POST_VERTEX, POST_FRAGMENT);
  const buffer = gl.createBuffer();
  const target = emptyTexture(gl);
  const frame = gl.createFramebuffer();
  if (!plane || !post || !buffer || !target || !frame) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const at = (p: WebGLProgram, name: string) => gl.getUniformLocation(p, name);
  const u = {
    rect: at(plane, "rect"),
    fit: at(plane, "fit"),
    size: at(plane, "size"),
    parallax: at(plane, "parallax"),
    alpha: at(plane, "alpha"),
    radius: at(plane, "radius"),
    time: at(post, "time"),
    speed: at(post, "speed"),
  };

  let stills: { texture: WebGLTexture; aspect: number }[] = [];
  let generation = 0;
  let width = 1;
  let height = 1;
  let scale = 1;

  const load: RollGl["load"] = (sources) => {
    const mine = ++generation;
    const old = stills;
    sources.forEach((src, i) => {
      const image = new Image();
      image.onload = () => {
        if (mine !== generation) return;
        const texture = emptyTexture(gl);
        if (!texture) return;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        stills[i] = { texture, aspect: image.naturalWidth / image.naturalHeight };
      };
      image.src = src;
    });
    stills = [];
    old.forEach((s) => gl.deleteTexture(s.texture));
  };

  return {
    load,
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
    render(planes, radius, alpha, speed, time) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, frame);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.useProgram(plane);
      gl.uniform1f(u.alpha, alpha);
      gl.uniform1f(u.radius, radius * scale);
      for (const p of planes) {
        const still = stills[p.texture];
        if (!still || p.y > height || p.y + p.h < 0) continue;
        const aspect = p.w / p.h;
        gl.bindTexture(gl.TEXTURE_2D, still.texture);
        gl.uniform4f(u.rect, p.x / width, p.y / height, p.w / width, p.h / height);
        gl.uniform2f(
          u.fit,
          aspect < still.aspect ? aspect / still.aspect : 1,
          aspect < still.aspect ? 1 : still.aspect / aspect,
        );
        gl.uniform2f(u.size, p.w * scale, p.h * scale);
        gl.uniform1f(u.parallax, p.parallax);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(post);
      gl.bindTexture(gl.TEXTURE_2D, target);
      gl.uniform1f(u.time, time);
      gl.uniform1f(u.speed, speed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      generation++;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
