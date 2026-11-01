/* ===========================================================================
   The camera's sounds (2026-11-01), worked out sample by sample rather than
   built from a filter and a burst of hiss: every click here is a few struck
   metal and plastic modes, every flap of film its own scrap of air, so that
   nothing plays back the same way twice inside a cue and none of it sounds like
   a tone generator. Pure functions of a sample rate, so they can be measured.
   =========================================================================== */

export type Stereo = readonly [Float32Array, Float32Array];

/** Small and seeded, so a cue is the same take every time it's rendered. */
function dice(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

class Take {
  readonly l: Float32Array;
  readonly r: Float32Array;

  constructor(
    readonly rate: number,
    seconds: number,
  ) {
    const frames = Math.ceil(rate * seconds);
    this.l = new Float32Array(frames);
    this.r = new Float32Array(frames);
  }

  /** One struck resonance: a sine that dies away. */
  mode(at: number, hz: number, tau: number, level: number, pan = 0) {
    const from = Math.floor(at * this.rate);
    const to = Math.min(this.l.length, from + Math.ceil(tau * 7 * this.rate));
    const left = level * (1 - pan) * 0.5 * 2 ** 0.5;
    const right = level * (1 + pan) * 0.5 * 2 ** 0.5;
    const turn = (2 * Math.PI * hz) / this.rate;
    const fade = Math.exp(-1 / (tau * this.rate));
    let gain = 1;
    for (let i = Math.max(from, 0); i < to; i += 1) {
      // Two samples in, so nothing starts with a step in it.
      const v = Math.sin((i - from) * turn) * gain * Math.min((i - from) / 2, 1);
      this.l[i] += v * left;
      this.r[i] += v * right;
      gain *= fade;
    }
  }

  /** A puff of filtered noise: `low` and `high` are one-pole corners, in Hz. */
  air(at: number, seconds: number, level: number, low: number, high: number, roll: () => number, pan = 0) {
    const from = Math.floor(at * this.rate);
    const to = Math.min(this.l.length, from + Math.ceil(seconds * 7 * this.rate));
    const a = 1 - Math.exp((-2 * Math.PI * high) / this.rate);
    const b = 1 - Math.exp((-2 * Math.PI * low) / this.rate);
    const fade = Math.exp(-1 / (seconds * this.rate));
    let gain = level;
    let top = 0;
    let bottom = 0;
    for (let i = Math.max(from, 0); i < to; i += 1) {
      top += (roll() * 2 - 1 - top) * a;
      bottom += (top - bottom) * b;
      const v = (top - bottom) * gain * Math.min((i - from) / 8, 1);
      this.l[i] += v * (1 - pan);
      this.r[i] += v * (1 + pan);
      gain *= fade;
    }
  }

  /** Pressed into itself, which is most of what makes a thing sound heavy. */
  drive(amount: number) {
    const top = Math.tanh(amount);
    for (const channel of [this.l, this.r]) {
      for (let i = 0; i < channel.length; i += 1) channel[i] = Math.tanh(channel[i] * amount) / top;
    }
  }

  /** A small hard room: four combs into two all-passes, a little different in each ear. */
  room(wet: number, seconds: number) {
    const reverb = (input: Float32Array, spread: number) => {
      const out = new Float32Array(input.length);
      for (const ms of [23.1, 29.7, 37.3, 41.9]) {
        const delay = Math.floor(((ms + spread) * this.rate) / 1000);
        const back = 10 ** ((-3 * ms) / (seconds * 1000));
        const line = new Float32Array(delay);
        let damped = 0;
        for (let i = 0; i < input.length; i += 1) {
          const held = line[i % delay];
          damped += (held - damped) * 0.45;
          line[i % delay] = input[i] + damped * back;
          out[i] += held * 0.25;
        }
      }
      for (const ms of [5.3, 1.7]) {
        const delay = Math.floor((ms * this.rate) / 1000);
        const line = new Float32Array(delay);
        for (let i = 0; i < out.length; i += 1) {
          const held = line[i % delay];
          const v = out[i] + held * 0.5;
          line[i % delay] = v;
          out[i] = held - v * 0.5;
        }
      }
      return out;
    };
    const left = reverb(this.l, 0);
    const right = reverb(this.r, 1.3);
    for (let i = 0; i < this.l.length; i += 1) {
      this.l[i] += left[i] * wet;
      this.r[i] += right[i] * wet;
    }
  }

  /** To a peak, with the very end faded so that nothing clicks off. */
  finish(peak: number): Stereo {
    let most = 0;
    for (const channel of [this.l, this.r]) for (const v of channel) most = Math.max(most, Math.abs(v));
    const tail = Math.floor(0.03 * this.rate);
    for (const channel of [this.l, this.r]) {
      for (let i = 0; i < channel.length; i += 1) {
        channel[i] *= (peak / (most || 1)) * Math.min((channel.length - i) / tail, 1);
      }
    }
    return [this.l, this.r];
  }
}

/** The claw pulling one perforation: steel on steel, inside a plastic body. */
function claw(take: Take, at: number, level: number, roll: () => number, pan: number) {
  const out = () => 0.94 + roll() * 0.12;
  take.mode(at, 2380 * out(), 0.0034, level * 0.5, pan);
  take.mode(at, 3910 * out(), 0.0026, level * 0.42, pan);
  take.mode(at, 6240 * out(), 0.0015, level * 0.24, pan);
  take.mode(at, 1180 * out(), 0.006, level * 0.34, pan);
  take.mode(at + 0.0006, 410 * out(), 0.011, level * 0.42, pan);
  take.air(at, 0.0012, level * 0.7, 1800, 11000, roll, pan);
}

/** A loose end of celluloid whipping past: slap, then a scrap of air behind it. */
function flap(take: Take, at: number, level: number, roll: () => number, pan: number) {
  take.air(at, 0.0035, level, 900, 7000, roll, pan);
  take.air(at + 0.0015, 0.011, level * 0.38, 500, 2600, roll, pan);
  take.mode(at, 720 + roll() * 180, 0.007, level * 0.3, pan);
}

/**
 * A length of film pulled out of a camera very fast, then running out: the
 * perforations a purr at first, slowing into separate clicks, the tail whipping
 * round the spool a few times and lying down. It lasts as long as the list
 * takes to open, and each flap lands as another row of it does.
 */
export function filmRun(rate: number): Stereo {
  const take = new Take(rate, 1.75);
  const roll = dice(35);

  // The gate letting go.
  take.mode(0, 64, 0.05, 0.5);
  take.mode(0, 118, 0.03, 0.34);
  take.air(0, 0.004, 1.1, 1400, 9000, roll);

  // Perforations going by, from a blur down to countable.
  const run = 0.86;
  for (let t = 0.012, n = 0; t < run; n += 1) {
    const through = t / run;
    const fall = 1 - through ** 1.8 * 0.82;
    const pan = Math.sin(n * 0.37) * 0.28;
    claw(take, t, 0.3 * fall + roll() * 0.07, roll, pan);
    flap(take, t + 0.002, 0.26 * fall * (0.7 + roll() * 0.6), roll, -pan);
    t += 1 / (64 * (1 - through) ** 1.5 + 11);
  }

  // The rush of air along the strip, its band closing as the film slows.
  for (let t = 0.004; t < run * 0.92; t += 0.009) {
    const through = t / run;
    take.air(t, 0.016, 0.1 * (1 - through) ** 1.2, 500 + 1500 * (1 - through), 2200 + 6400 * (1 - through), roll, Math.sin(t * 19) * 0.2);
  }

  // The spool, thrown round: a low flutter that winds down with it.
  const spool = Math.floor(rate * 1.2);
  let phase = 0;
  for (let i = 0; i < spool; i += 1) {
    const t = i / rate;
    const spin = 26 * Math.exp(-t * 2.3) + 3;
    phase += (2 * Math.PI * spin) / rate;
    const swell = Math.min(t / 0.015, 1) * Math.exp(-t * 3);
    const wobble = 0.5 + 0.5 * Math.sin(phase);
    const v = (Math.sin(2 * Math.PI * 71 * t) + Math.sin(2 * Math.PI * 106 * t + 1) * 0.5) * wobble * swell * 0.13;
    take.l[i] += v;
    take.r[i] += v;
  }

  // The tail going round, slower each time, and settling flat.
  for (const [t, level, pan] of [
    [0.9, 0.3, 0.2],
    [0.99, 0.27, -0.16],
    [1.1, 0.22, 0.12],
    [1.24, 0.16, -0.08],
    [1.4, 0.1, 0.05],
  ] as const) {
    flap(take, t, level, roll, pan);
    take.mode(t, 190, 0.02, level * 0.36, pan);
    take.mode(t, 96, 0.03, level * 0.3, pan);
  }

  take.drive(1.5);
  take.room(0.2, 0.42);
  return take.finish(0.92);
}

/**
 * The camera stopped dead: the motor falling out from under the last few frames
 * of film, and the whole mechanism landing on its latch. Heavy on purpose,
 * everything low in it stacked up and pressed together.
 */
export function cameraStop(rate: number): Stereo {
  const take = new Take(rate, 1.1);
  const roll = dice(84);
  const land = 0.3;

  // The motor running down, a stack of harmonics that sags in pitch.
  let phase = 0;
  const frames = Math.floor(rate * (land + 0.02));
  for (let i = 0; i < frames; i += 1) {
    const t = i / rate;
    const through = Math.min(t / land, 1);
    const hz = 34 + 196 * (1 - through) ** 2.1;
    phase += (2 * Math.PI * hz) / rate;
    const body = Math.min(t / 0.012, 1) * Math.min((land + 0.02 - t) / 0.02, 1) * (1 - through * 0.4);
    let v = 0;
    for (const [n, level] of [[1, 0.42], [2, 0.3], [3, 0.22], [4, 0.12], [6, 0.07], [9, 0.035]] as const) {
      v += Math.sin(phase * n + n) * level;
    }
    v *= body * 0.46;
    take.l[i] += v;
    take.r[i] += v;
  }

  // The last frames through the gate, each further from the one before.
  for (const [t, level] of [[0.008, 0.62], [0.052, 0.56], [0.102, 0.5], [0.158, 0.44], [0.222, 0.36]] as const) {
    claw(take, t, level, roll, 0);
    take.mode(t, 150, 0.02, level * 0.45);
  }

  // Ka: the latch dropping.
  take.mode(land - 0.012, 1420, 0.009, 0.5);
  take.mode(land - 0.012, 3080, 0.005, 0.36);
  take.air(land - 0.012, 0.003, 1, 1200, 8000, roll);

  // Chunk: the body taking it, all the weight at once.
  for (const [hz, tau, level] of [
    [47, 0.16, 1.1],
    [74, 0.12, 1],
    [112, 0.085, 0.8],
    [168, 0.06, 0.62],
    [263, 0.04, 0.5],
    [418, 0.026, 0.36],
    [760, 0.016, 0.26],
    [1620, 0.009, 0.16],
  ] as const) {
    take.mode(land, hz, tau, level);
  }
  take.air(land, 0.024, 2.1, 40, 620, roll);
  take.air(land, 0.005, 1.2, 600, 5200, roll);

  // The mechanism bouncing once on its stop, and a spring left ringing.
  take.mode(land + 0.078, 92, 0.05, 0.38);
  take.mode(land + 0.078, 310, 0.02, 0.22);
  take.mode(land + 0.078, 1240, 0.006, 0.12);
  take.mode(land + 0.012, 1934, 0.17, 0.028, 0.15);
  take.mode(land + 0.012, 2871, 0.12, 0.016, -0.15);

  take.drive(2.3);
  take.room(0.17, 0.38);
  return take.finish(0.95);
}

/** One perforation, on its own, soft: the ticket under the pointer. */
export function perforation(rate: number): Stereo {
  const take = new Take(rate, 0.09);
  const roll = dice(12);
  claw(take, 0.001, 0.5, roll, 0);
  take.room(0.12, 0.1);
  return take.finish(0.9);
}
