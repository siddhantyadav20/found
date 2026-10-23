/* The trailer's shots, drawn in GLSL. Each is a fragment shader that gets:
     R  the render size      T  the trailer's clock      L  time into the shot
     D  the shot's length    S  a seed, so a scene used twice isn't the same shot
   and writes linear-ish HDR colour; post.frag grades it, blooms it and adds the film.

   Nothing here is a photograph. A clip at footage/<slot>.mp4 replaces a shot
   (see render.mjs), so these are as much a previs as a picture. */

const COMMON = `#version 300 es
precision highp float;
uniform vec2 R; uniform float T, L, D, S;
out vec4 O;
#define PI 3.14159265
#define sat(x) clamp(x, 0., 1.)
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 h22(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
vec3 h13(float p){ vec3 q = fract(vec3(p) * vec3(.1031, .11369, .13787)); q += dot(q, q.yzx + 19.19); return fract(vec3((q.x + q.y) * q.z, (q.x + q.z) * q.y, (q.y + q.z) * q.x)); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + 1.), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 5; i++) { v += a * n2(p); p = m * p; a *= .5; } return v; }
float fbm3(vec2 p){ float v = 0., a = .5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6); for (int i = 0; i < 3; i++) { v += a * n2(p); p = m * p; a *= .5; } return v; }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float box(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * sat(dot(pa, ba) / dot(ba, ba))); }
// A lens's out-of-focus highlight: a disc, a little brighter at its rim, energy kept.
vec3 bok(vec2 d, float r, vec3 c){
  float l = length(d);
  float disc = smoothstep(r, r * .86, l);
  float rim = smoothstep(r * .6, r * .95, l) * disc;
  return c * disc * (.8 + .5 * rim) * (.0009 / (r * r + .0009));
}
float ease(float x){ x = sat(x); return x * x * (3. - 2. * x); }
vec2 UV(){ return (gl_FragCoord.xy - .5 * R) / R.y; }
`;

const SCENES = {};

/* A phone face-down on a dark table. The screen's light leaks from under it,
   and every buzz walks it a little across the wood. */
SCENES.phone = `
void main(){
  vec2 uv = UV();
  float P = L / D;
  uv *= 1. - .14 * ease(P);
  uv = rot(.05 - .04 * P) * uv;
  float b = 0.;
  for (int i = 0; i < 3; i++) { float bt = L - (.6 + float(i)); b += step(0., bt) * step(bt, .55) * (1. - bt / .55); }
  vec2 sh = vec2(sin(T * 173.), cos(T * 151.)) * .0035 * b;
  float g = fbm(vec2(uv.x * 2.5 + fbm(uv * 3.) * .6, uv.y * 38.));
  vec3 wood = mix(vec3(.05, .028, .015), vec3(.16, .09, .045), g) * (.55 + .6 * fbm(uv * 7. + 3.));
  vec2 q = rot(-.14) * (uv - sh - vec2(.0, .01));
  float d = box(q, vec2(.105, .215), .032);
  vec3 lc = vec3(.55, .7, 1.) * (.3 + 1.6 * b + .05 * sin(T * 2.));
  float leak = d > 0. ? exp(-d * (16. + 10. * sat(q.x * 8. + .5))) : 0.;
  vec3 col = wood * (.06 + 3.4 * leak * lc) + lc * leak * .08;
  // The light catches the grain nearest the phone.
  col += vec3(.3, .35, .5) * leak * leak * g * .4;
  vec3 pc = vec3(.018, .017, .016) + .02 * fbm(q * 40.);
  pc += lc * smoothstep(.006, 0., abs(d)) * .35;
  float cam = box(q - vec2(-.052, .15), vec2(.036), .013);
  pc = mix(pc, vec3(.006), smoothstep(.002, -.002, cam));
  pc += vec3(.2) * smoothstep(.003, 0., abs(cam)) * (.2 + .3 * b);
  col = mix(col, pc, smoothstep(.002, -.002, d));
  col *= 1. - .5 * length(uv * vec2(1.3, .8));
  O = vec4(col, 1);
}`;

/* Bulbs strung through trees at a farmhouse wedding, out of focus, and a
   focus pull that brings one string sharp. */
SCENES.bulbs = `
void main(){
  vec2 uv = UV();
  float P = L / D;
  vec2 cam = vec2(-.25 + .5 * P + S * .3, .02 * sin(L * .7));
  float zf = mix(9., 2.2, ease((P - .15) / .6));
  vec3 col = vec3(.012, .01, .012) + vec3(.06, .03, .01) * (1. - uv.y);
  // Leaves, lit faintly from the bulbs.
  float leaf = fbm(uv * 9. + vec2(cam.x * 2., 0.) + S);
  col += vec3(.03, .025, .01) * smoothstep(.55, .75, leaf);
  for (int s = 0; s < 5; s++) {
    float fs = float(s);
    float z = 1.8 + fs * 1.7 + h11(fs + S) * .8;
    float y0 = .35 - h11(fs * 3.1 + S) * .5;
    float sag = .25 + .2 * h11(fs * 7.7);
    float ap = .055;
    float r = abs(1. / z - 1. / zf) * ap * 2.4 + .0035;
    for (int i = 0; i < 16; i++) {
      float u = float(i) / 15.;
      vec3 w = vec3(-3. + 6. * u, y0 * z * .6 - sag * (1. - pow(2. * u - 1., 2.)) * z * .25, z);
      vec2 p = (w.xy - cam * z * .3) / w.z * 1.4;
      vec2 dd = uv - p;
      if (abs(dd.x) > r + .02 || abs(dd.y) > r + .02) continue;
      float fl = .85 + .15 * sin(T * 7. + fs * 3. + float(i) * 1.7);
      vec3 c = mix(vec3(1., .55, .18), vec3(1., .75, .4), h11(float(i) + fs * 9.)) * fl * 2.2;
      col += bok(dd, r, c);
      col += c * smoothstep(.004, .0, length(dd)) * smoothstep(.012, .0035, r) * 2.;
    }
  }
  col += vec3(.08, .04, .01) * smoothstep(.6, -.5, uv.y) * .5;
  O = vec4(col, 1);
}`;

/* The baraat's fireworks over the farmhouse trees, string lights below,
   smoke hanging where the shells went. The sound under it is the dhol. */
SCENES.fireworks = `
void main(){
  vec2 uv = UV();
  float P = L / D;
  float tt = L + S * 3.;
  uv.y -= .03 * ease(P);
  vec3 col = mix(vec3(.012, .01, .02), vec3(.07, .035, .03), sat(.4 - uv.y));
  // Smoke left by earlier shells, lit from below.
  float sm = fbm(uv * vec2(2.5, 3.5) + vec2(tt * .03, -tt * .02));
  col += vec3(.12, .06, .04) * sat(sm - .35) * smoothstep(.5, -.1, uv.y);
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec3 r = h13(fi * 7.31 + floor(S));
    float a = mod(tt - fi * .42 + .6 - r.z * .2, 2.6);
    vec2 c = vec2((r.x - .5) * .42, .08 + r.y * .3);
    float R = .16 + .1 * r.z;
    vec3 hue = mix(vec3(1., .62, .25), mix(vec3(1., .85, .6), vec3(1., .3, .2), step(.7, r.x)), step(.4, r.y));
    float fade = exp(-a * 1.5);
    col += hue * .25 * fade * exp(-length(uv - c) * 9.) * smoothstep(.0, .05, a);
    if (length(uv - c) > R + .06 + a * .1) continue;
    for (int j = 0; j < 44; j++) {
      float fj = float(j);
      vec2 hj = h22(vec2(fj, fi + 3.));
      float ang = fj / 44. * 2. * PI + hj.x * .25;
      float v = R * (.75 + .25 * hj.y);
      vec2 dir = vec2(cos(ang), sin(ang));
      float k = 1. - exp(-a * 3.2);
      vec2 p1 = c + dir * v * k + vec2(0, -.035 * a * a);
      float a0 = max(a - .12, 0.);
      vec2 p0 = c + dir * v * (1. - exp(-a0 * 3.2)) + vec2(0, -.035 * a0 * a0);
      float d = seg(uv, p0, p1);
      float tw = .6 + .4 * sin(a * 40. + fj * 3.);
      col += hue * (exp(-d * 900.) * 1.8 + exp(-d * 160.) * .25) * fade * tw;
    }
  }
  // The tree line and the strings of bulbs in front of it.
  float tl = -.18 + .1 * fbm(vec2(uv.x * 5. + 9., 1.)) + .04 * fbm(vec2(uv.x * 25., 2.));
  float leaves = smoothstep(.0, .01, tl - uv.y + .015 * (fbm(uv * 40.) - .5));
  col = mix(col, vec3(.006, .005, .006), leaves);
  for (int i = 0; i < 18; i++) {
    float fi = float(i);
    vec2 p = vec2(-.42 + fi * .05, -.26 - .05 * (1. - pow(fi / 8.5 - 1., 2.)));
    col += bok(uv - p, .016, vec3(1., .6, .25) * (1.4 + .3 * sin(T * 6. + fi)));
  }
  O = vec4(col, 1);
}`;

/* Morning after, the back lawn: grey sky, the mango trees, the strings of
   bulbs gone dark, and smoke still rising from somewhere behind them. */
SCENES.dawn = `
void main(){
  vec2 uv = UV();
  float P = L / D;
  uv.y -= .04 * ease(P);
  uv.x += S * .2;
  vec3 col = mix(vec3(.16, .18, .21), vec3(.36, .38, .4), sat(uv.y * 1.4 + .4));
  col += vec3(.15, .1, .05) * exp(-pow(uv.y + .02, 2.) * 30.) * .5;
  // Smoke, domain-warped and rising.
  vec2 q = vec2(uv.x * 3.2, uv.y * 2.2 - L * .22);
  float w = fbm(q + vec2(fbm(q + L * .05), fbm(q * 1.3 - L * .04)));
  float plume = smoothstep(.36 + .25 * (uv.y + .2), 0., abs(uv.x - .04 - .08 * (uv.y + .2)));
  float sm = sat((w - .3) * 2.2) * plume * smoothstep(-.25, .05, uv.y);
  col = mix(col, vec3(.08, .085, .09), sm * .85);
  col += vec3(.1, .1, .11) * sat((w - .55) * 3.) * plume * .5;
  col += vec3(.5, .2, .05) * plume * smoothstep(-.12, -.22, uv.y) * .25;
  // Wires and dead bulbs.
  for (int s = 0; s < 2; s++) {
    float fs = float(s);
    float y = .32 - fs * .12 - .1 * (1. - pow(uv.x * 2.2 + fs * .2, 2.));
    col *= 1. - .7 * smoothstep(.0018, .0, abs(uv.y - y));
    vec2 g = vec2(fract(uv.x * 14. + fs * .5) - .5, uv.y - y + .012);
    col *= 1. - .8 * smoothstep(.009, .005, length(g * vec2(.07, 1.)));
  }
  // The tree line.
  float tl = -.1 + .14 * fbm(vec2(uv.x * 5. + 3., 1.)) + .06 * fbm(vec2(uv.x * 22., 2.));
  float leaves = smoothstep(.0, .015, tl - uv.y + .02 * (fbm(uv * 40.) - .5));
  col = mix(col, vec3(.015, .018, .02), leaves);
  col += vec3(.02, .022, .025) * fbm(uv * vec2(3., 8.) + L * .1) * (1. - leaves);
  O = vec4(col, 1);
}`;

/* A front door from the floor: light under it, a parcel in front, dust in
   the light, and somebody's feet passing on the other side. */
SCENES.door = `
void main(){
  vec2 uv = UV();
  float P = L / D;
  uv *= 1. - .1 * ease(P);
  float gy = -.08;
  float fx = mix(-.5, .5, ease((L - .9) / 1.6));
  float feet = 1. - .9 * (smoothstep(.04, .02, abs(uv.x - fx + .03)) + smoothstep(.04, .02, abs(uv.x - fx - .06 + .03 * sin(L * 9.))));
  feet = sat(feet);
  float fl = .95 + .05 * sin(T * 11.) * sin(T * 3.7);
  vec3 warm = vec3(1., .7, .4) * fl;
  vec3 col = vec3(.008, .007, .006);
  // Door: dark panels, the gap glowing.
  float panel = min(abs(box(uv - vec2(-.11, .15), vec2(.08, .17), .0)), abs(box(uv - vec2(.11, .15), vec2(.08, .17), .0)));
  col += vec3(.035, .025, .015) * exp(-(uv.y - gy) * 6.) * step(gy, uv.y) * (1. + 2. * smoothstep(.004, .0, panel)) * smoothstep(.35, .2, abs(uv.x));
  float gap = smoothstep(.006, .0, abs(uv.y - gy)) * step(abs(uv.x), .3);
  col += warm * gap * 4. * feet;
  // Spill across the floor, in perspective.
  if (uv.y < gy) {
    float dist = gy - uv.y;
    float spread = .3 + dist * 1.6;
    float fx2 = uv.x * (.3 / spread);
    float f2 = 1. - .9 * (smoothstep(.04, .02, abs(fx2 - fx + .03)) + smoothstep(.04, .02, abs(fx2 - fx - .06 + .03 * sin(L * 9.))));
    float spill = exp(-dist * 7.) * smoothstep(spread, spread * .6, abs(uv.x));
    float boards = .9 + .1 * smoothstep(.0, .01, abs(fract(uv.x / (.06 + dist * .4)) - .5) - .47);
    col += warm * spill * .5 * sat(f2) * boards * (.7 + .3 * fbm(vec2(uv.x * 30., dist * 80.)));
  }
  // The parcel.
  vec2 bp = uv - vec2(.0, -.27);
  float bx = box(bp, vec2(.13, .07), .004);
  float top = box(bp - vec2(0, .075), vec2(.13, .012), .003);
  vec3 bc = vec3(.03, .02, .012) + warm * .12 * smoothstep(-.07, .07, bp.y) * feet;
  bc += warm * .4 * smoothstep(.01, .0, abs(bp.y - .07)) * feet;
  bc = mix(bc, bc * 1.6, smoothstep(.012, .008, abs(bp.x)));
  col = mix(col, bc, smoothstep(.002, -.002, min(bx, top)));
  // Dust turning in the light.
  for (int k = 0; k < 2; k++) {
    vec2 g = uv * (30. + float(k) * 20.) + vec2(L * .3, L * (.2 + float(k) * .1));
    vec2 id = floor(g), f = fract(g) - .5;
    vec2 j = h22(id) - .5;
    float m = smoothstep(.08, .0, length(f - j * .7)) * step(.7, h21(id + 3.));
    col += warm * m * .35 * exp(-abs(uv.y - gy + .02) * 9.) * smoothstep(.35, .0, abs(uv.x));
  }
  O = vec4(col, 1);
}`;

/* His lock screen, held in a dark room: the wedding-light wallpaper, and a
   notification the focus finds (its words are drawn over this, in HTML). */
SCENES.screen = `
void main(){
  vec2 uv = UV();
  float P = L / D;
  vec2 hand = vec2(sin(L * 1.3) * .006 + sin(L * 3.1) * .002, cos(L * 1.1) * .005);
  uv += hand;
  float blur = mix(.06, .035, ease((L - .2) / 1.2));
  vec3 col = vec3(.02, .015, .02);
  for (int i = 0; i < 26; i++) {
    float fi = float(i);
    vec2 p = vec2(h11(fi * 1.7) - .5, h11(fi * 2.3) - .5) * vec2(.6, 1.);
    p.y += .03 * sin(L * .3 + fi);
    col += bok(uv - p, blur * (.7 + .6 * h11(fi * 5.1)), mix(vec3(1., .55, .2), vec3(1., .8, .5), h11(fi)) * 1.6);
  }
  // The notification's glass.
  float n = box(uv - vec2(0, -.02), vec2(.235, .06), .03);
  col = mix(col, col * .5 + vec3(.04, .04, .045), smoothstep(.003, -.003, n) * .9);
  // A reflection crossing the glass.
  float sw = smoothstep(.05, 0., abs(uv.x + uv.y * .6 - mix(-.6, .6, P)));
  col += vec3(.05) * sw;
  O = vec4(col * 1.1, 1);
}`;

/* Rain on a car window, Delhi traffic beyond it: brake lights, sodium lamps,
   a green signal. The drops refract the street sharper than the glass sees it.
   The drop model follows BigWings' "Heartfelt". */
SCENES.rain = `
float Saw(float b, float t){ return smoothstep(0., b, t) * smoothstep(1., b, t); }
vec2 DropLayer(vec2 uv, float t){
  vec2 UVv = uv;
  uv.y += t * .75;
  vec2 a = vec2(6., 1.), grid = a * 2.;
  vec2 id = floor(uv * grid);
  uv.y += h11(id.x * 7.13);
  id = floor(uv * grid);
  vec3 n = h13(id.x * 35.2 + id.y * 2376.1);
  vec2 st = fract(uv * grid) - vec2(.5, 0);
  float x = n.x - .5;
  float y = UVv.y * 20.;
  x += sin(y + sin(y)) * (.5 - abs(x)) * (n.z - .5);
  x *= .7;
  float ti = fract(t + n.z);
  y = (Saw(.85, ti) - .5) * .9 + .5;
  vec2 p = vec2(x, y);
  float d = length((st - p) * a.yx);
  float main = smoothstep(.4, .0, d);
  float r = sqrt(smoothstep(1., y, st.y));
  float cd = abs(st.x - x);
  float trail = smoothstep(.23 * r, .15 * r * r, cd);
  float front = smoothstep(-.02, .02, st.y - y);
  trail *= front * r * r;
  y = fract(UVv.y * 10.) + (st.y - .5);
  float drops = smoothstep(.3, 0., length(st - vec2(x, y)));
  return vec2(main + drops * r * front, trail);
}
float StaticDrops(vec2 uv, float t){
  uv *= 40.;
  vec2 id = floor(uv); uv = fract(uv) - .5;
  vec3 n = h13(id.x * 107.45 + id.y * 3543.654);
  vec2 p = (n.xy - .5) * .7;
  return smoothstep(.3, 0., length(uv - p)) * fract(n.z * 10.) * Saw(.025, fract(t + n.z));
}
vec2 Drops(vec2 uv, float t){
  float s = StaticDrops(uv, t);
  vec2 m1 = DropLayer(uv, t), m2 = DropLayer(uv * 1.85, t);
  return vec2(smoothstep(.3, 1., s + m1.x + m2.x), max(m1.y, m2.y));
}
vec3 street(vec2 uv, float blur){
  vec3 col = mix(vec3(.06, .03, .02), vec3(.01, .015, .03), sat(uv.y * 2. + .5));
  col += vec3(.25, .12, .04) * exp(-pow(uv.y + .05, 2.) * 40.) * .4;
  for (int i = 0; i < 34; i++) {
    float fi = float(i);
    vec3 n = h13(fi * 13.7 + S * 3.);
    vec2 p; vec3 c; float sz = 1.;
    if (i < 14) {         // brake lights, crawling
      p = vec2(fract(n.x - L * .015 * (1. + n.z)) * 1.2 - .6, -.1 + n.y * .08);
      c = vec3(1., .08, .04) * 1.6;
    } else if (i < 22) {  // headlights the other way
      p = vec2(fract(n.x + L * .03) * 1.2 - .6, -.03 + n.y * .05);
      c = vec3(1., .9, .75) * 1.8; sz = .8;
    } else if (i < 30) {  // sodium lamps
      p = vec2(n.x * 1.1 - .55, .12 + n.y * .2);
      c = vec3(1., .55, .15) * 1.5; sz = 1.2;
    } else {              // a signal, shop signs
      p = vec2(n.x * .8 - .4, .02 + n.y * .12);
      c = i == 30 ? vec3(.1, 1., .4) * 1.4 : vec3(.2, .6, 1.) * .9;
    }
    col += bok(uv - p, blur * sz * (.8 + .4 * n.z), c);
  }
  return col;
}
void main(){
  vec2 uv = UV();
  vec2 UVv = uv;
  float t = (T + S * 10.) * .2;
  vec2 c = Drops(uv, t);
  vec2 e = vec2(.001, 0.);
  float cx = Drops(uv + e, t).x, cy = Drops(uv + e.yx, t).x;
  vec2 n = vec2(cx - c.x, cy - c.x);
  float focus = mix(.05 - c.y * .02, .01, smoothstep(.1, .2, c.x));
  vec3 col = street(UVv + n * 1.2, focus);
  col *= 1. - .3 * c.y;
  O = vec4(col, 1);
}`;

/* Fire before dawn, and the wedding's lights behind the smoke. */
SCENES.fire = `
vec3 ramp(float x){ return vec3(pow(sat(x * 1.5), 1.5), pow(sat(x * 1.5 - .35), 2.) * .7, pow(sat(x * 1.8 - 1.1), 2.) * .45) * (x * 2.6); }
void main(){
  vec2 uv = UV();
  float P = L / D;
  float tt = L + S * 7.;
  uv *= 1. - .08 * ease(P);
  vec3 col = vec3(.004, .003, .003);
  // Fairy lights far behind, shimmering in the heat.
  vec2 hz = uv + .006 * vec2(fbm(uv * 12. + tt * 2.) - .5, 0) * smoothstep(-.3, .2, uv.y);
  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    vec2 p = vec2(-.5 + fi * .07, .33 - .06 * (1. - pow(fi / 7.5 - 1., 2.)));
    col += bok(hz - p, .018, vec3(1., .6, .25) * 1.1);
  }
  vec2 q = vec2(uv.x * 6.5, uv.y * 3.2 - tt * 2.1);
  float n = fbm(q + vec2(fbm(q * 1.7 + tt * .5), fbm(q * 1.3 - tt * .4)) * 1.6);
  float tongues = pow(sat(1. - abs(fract(uv.x * 9. + n * 2.2) - .5) * 2.), 2.);
  float width = .26 - (uv.y + .3) * .42;
  float shape = smoothstep(width, width * .2, abs(uv.x + .03 * sin(uv.y * 7. + tt * 2.)));
  shape *= smoothstep(.3, -.28, uv.y);
  float f = sat((n - .38) * 2.6 * shape * (.6 + .6 * tongues) + .45 * smoothstep(-.2, -.33, uv.y) * smoothstep(.22, .0, abs(uv.x)) * n);
  // Smoke above the flame, hiding the lights.
  float sm = fbm(vec2(uv.x * 2.5, uv.y * 1.5 - tt * .3) + 4.) * smoothstep(-.05, .35, uv.y) * smoothstep(.45, .0, abs(uv.x - .05));
  col *= 1. - .85 * sat(sm * 1.4);
  col += vec3(.05, .025, .015) * sm;
  col += ramp(f) * 1.4;
  col += vec3(1., .35, .08) * .25 * exp(-pow(uv.y + .3, 2.) * 18.) * smoothstep(.5, .0, abs(uv.x));
  // Logs.
  float lg = 9.;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 a = vec2(-.3 + fi * .13, -.47 + .02 * h11(fi)), b = vec2(-.06 + fi * .03 + (h11(fi * 3.) - .5) * .25, -.36 + .04 * h11(fi * 5.));
    lg = min(lg, seg(uv, a, b) - (.018 + .008 * h11(fi * 7.)) * (1. + .3 * fbm(uv * 30. + fi)));
  }
  float glow = pow(fbm(uv * 45. + tt * .6), 2.) * smoothstep(-.4, -.28, uv.y);
  float cracks = smoothstep(.62, .75, fbm(uv * vec2(70., 25.) + tt * .3));
  vec3 lc = vec3(.008, .005, .004) + vec3(1., .3, .05) * cracks * glow * .9 + vec3(.6, .2, .04) * smoothstep(.006, .0, abs(lg)) * .25;
  col = mix(col, lc, smoothstep(.003, -.003, lg));
  // Embers.
  for (int k = 0; k < 3; k++) {
    float fk = float(k);
    vec2 g = vec2(uv.x * (10. + fk * 6.), uv.y * (6. + fk * 3.) - tt * (1.5 + fk * .6) - fk * 5.);
    vec2 id = floor(g), fr = fract(g) - .5;
    vec2 j = h22(id + fk * 9.) - .5;
    vec2 pp = fr - j * .6 - vec2(.25 * sin(tt * 3. + id.y * 2.), 0);
    float m = smoothstep(.06, .0, length(pp * vec2(1., .45))) * step(.82, h21(id * 1.7 + fk));
    col += vec3(1., .5, .15) * m * 3. * smoothstep(.45, -.2, uv.y) * (.5 + .5 * sin(tt * 20. + id.x));
  }
  O = vec4(col, 1);
}`;

/* Delhi from a flyover: headlights and tail-lights drawn into lines, sodium
   lamps, the smog the city lives in. */
SCENES.traffic = `
void main(){
  vec2 uv = UV();
  float P = L / D;
  float tt = L + S * 5.;
  vec2 vp = vec2(.0 + .05 * sin(S * 4.), .14);
  vec3 smog = vec3(.22, .13, .07);
  vec3 col = mix(vec3(.02, .02, .03), smog * .6, exp(-abs(uv.y - vp.y) * 6.));
  // Skyline far away.
  float sk = vp.y + .015 + .05 * step(.5, h11(floor(uv.x * 40.))) * h11(floor(uv.x * 40.) + 1.);
  if (uv.y > vp.y && uv.y < sk) col = mix(col, vec3(.015, .012, .015), .8);
  if (uv.y < vp.y) {
    float s = (vp.y - uv.y);
    float z = .08 / s;
    float x = (uv.x - vp.x) * z;
    vec3 road = vec3(.012, .01, .009) * (1. + .3 * fbm(vec2(x * 2., z * 3.)));
    col = road + smog * .5 * exp(-s * 9.);
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      float lane = -1.25 + fi * .5;
      float w = abs(x - lane);
      float dir = fi < 3. ? 1. : -1.;
      float k = z * .6 + tt * 2.2 * dir + fi * 1.7;
      float pulses = smoothstep(.0, .15, fract(k)) * smoothstep(.95, .35, fract(k));
      float on = step(.35, h11(floor(k) + fi * 9.));
      vec3 c = fi < 3. ? vec3(1., .08, .03) : vec3(1., .85, .6);
      col += c * pulses * on * smoothstep(.09, .0, w) * (1.5 + 1.5 / z) * exp(-z * .06);
    }
    col = mix(col, smog * .7, 1. - exp(-z * .05));
  }
  // Lamps along both kerbs, receding.
  for (int i = 0; i < 14; i++) {
    float fi = float(i);
    float z = fract(fi / 14. - tt * .05) * 30. + 1.;
    for (int sd = 0; sd < 2; sd++) {
      float side = sd == 0 ? -1. : 1.;
      vec2 p = vp + vec2(side * 1.9, .9) * (.08 / z) * 5.;
      float r = .003 + .02 / z;
      col += bok(uv - p, r, vec3(1., .55, .15) * 1.8 * exp(-z * .04));
      col += vec3(1., .5, .15) * .04 * exp(-length(uv - p) * 18.) * exp(-z * .05);
    }
  }
  O = vec4(col, 1);
}`;

/* Rajpath in November smog: lamps going into the murk, and India Gate at
   the end of it, floodlit, half there. */
SCENES.gate = `
float gate(vec2 p){
  float w = .13, h = .26;
  float body = box(p - vec2(0, h * .5), vec2(w, h * .5), .0);
  float arch = min(box(p - vec2(0, .08), vec2(.045, .08), .0), length(p - vec2(0, .16)) - .045);
  float attic = box(p - vec2(0, h + .025), vec2(w * .82, .025), .0);
  float top = box(p - vec2(0, h + .06), vec2(w * .45, .012), .0);
  float dome = length((p - vec2(0, h + .072)) / vec2(1.6, 1.)) - .025;
  float d = max(body, -arch);
  d = min(d, min(attic, min(top, max(dome, -(p.y - h - .072)))));
  return d;
}
void main(){
  vec2 uv = UV();
  float P = L / D;
  float push = 1. + .45 * ease(P) ;
  vec2 vp = vec2(0., -.02);
  vec3 fogc = vec3(.16, .1, .065);
  vec3 col = mix(vec3(.01, .01, .014), fogc * .7, exp(-abs(uv.y - vp.y) * 4.5));
  // The gate, floodlit from below, sunk in fog.
  vec2 gp = (uv - vp) / (.55 * push) + vec2(0, .02);
  float g = gate(gp);
  vec3 gc = mix(vec3(.7, .45, .24), vec3(.12, .08, .05), sat(gp.y * 3.2));
  gc *= .75 + .5 * fbm(gp * vec2(40., 90.));
  float m = smoothstep(.003, -.003, g);
  col = mix(col, mix(gc, fogc, .35), m);
  col += vec3(.8, .5, .25) * .05 * exp(-max(g, 0.) * 14.);
  // The road, and the lamps either side, coming at us.
  if (uv.y < vp.y) {
    float s = vp.y - uv.y;
    col = mix(vec3(.012, .01, .01), fogc * .6, exp(-s * 6.));
    col += vec3(.5, .3, .15) * .08 * exp(-abs(uv.x) * 30.) * exp(-s * 4.);
  }
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    float z = fract(fi / 12. - L * .045 - S) * 24. + .6;
    for (int sd = 0; sd < 2; sd++) {
      float side = sd == 0 ? -1. : 1.;
      vec2 p = vp + vec2(side * .9, .55) / z;
      float r = .004 + .03 / z;
      float fade = exp(-z * .09);
      col += bok(uv - p, r, vec3(1., .6, .25) * 2. * fade);
      col += vec3(1., .55, .2) * .07 * exp(-length(uv - p) * 7.) * fade;
    }
  }
  // Smog moving across all of it.
  float f = fbm(uv * vec2(2., 4.) + vec2(L * .05, 0) + S);
  col = mix(col, fogc * .8, sat(f * .7 - .15));
  O = vec4(col, 1);
}`;

/* Sparks rising in the dark, slowly. */
SCENES.embers = `
void main(){
  vec2 uv = UV();
  float tt = L + S * 11.;
  vec3 col = vec3(.01, .004, .002) + vec3(.2, .05, .01) * exp(-pow(uv.y + .6, 2.) * 6.) * .5;
  for (int k = 0; k < 4; k++) {
    float fk = float(k);
    float sc = 4. + fk * 3.;
    vec2 g = vec2(uv.x * sc, uv.y * sc - tt * (.25 + fk * .12) - fk * 3.);
    vec2 id = floor(g), fr = fract(g) - .5;
    vec2 j = h22(id + fk * 4.) - .5;
    vec2 pp = fr - j * .6 - vec2(.2 * sin(tt * .8 + id.y), 0);
    float on = step(.6, h21(id * 2.1 + fk));
    float r = .02 + .25 * (1. - fk / 3.) * (h21(id) * .5 + .5) * (fk < 1. ? 1. : .15);
    on *= fk < 1. ? step(.85, h21(id * 3.7)) : 1.;
    col += bok(pp / sc, r / sc, vec3(1., .45, .12) * (1.5 + sin(tt * 6. + id.x * 3.)) * on);
  }
  O = vec4(col, 1);
}`;

export const fragments = Object.fromEntries(Object.entries(SCENES).map(([k, v]) => [k, COMMON + v]));

export const POST = `#version 300 es
precision highp float;
uniform sampler2D S; uniform vec2 OUTR; uniform float T, flash, exposure, warmth, sat_, seed;
out vec4 O;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec3 aces(vec3 x){ return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }
void main(){
  vec2 uv = gl_FragCoord.xy / OUTR;
  vec2 c = uv - .5;
  vec2 weave = (vec2(h21(vec2(seed, 1.)), h21(vec2(seed, 2.))) - .5) * .0012;
  uv += weave;
  float ca = .004 * dot(c, c) * 4.;
  vec3 col = vec3(texture(S, uv + c * ca).r, texture(S, uv).g, texture(S, uv - c * ca).b);
  vec3 bl = textureLod(S, uv, 3.).rgb * .45 + textureLod(S, uv, 5.).rgb * .35 + textureLod(S, uv, 6.5).rgb * .3;
  col += max(bl - .2, 0.) * vec3(1., .78, .62) * .9;
  col *= exposure;
  float l = dot(col, vec3(.299, .587, .114));
  col = mix(vec3(l), col, sat_);
  // Teal in the shadows, amber in the highlights.
  col += (1. - smoothstep(0., .35, l)) * vec3(-.004, .01, .016);
  col *= mix(vec3(1.), vec3(1.06, .98, .9), warmth * smoothstep(.2, .9, l));
  col = aces(col * 1.1);
  col *= 1. - .55 * pow(length(c * vec2(1.1, .8)) * 1.25, 2.4);
  float g = h21(gl_FragCoord.xy * .5 + seed * 17.13) - .5;
  col += g * .07 * (1. - .6 * dot(col, vec3(.33)));
  col = mix(col, vec3(1.), flash);
  O = vec4(pow(max(col, 0.), vec3(1. / 1.05)), 1);
}`;
