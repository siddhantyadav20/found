# frames for RAAKH v3: game clips at native size, real overlays cropped to the 4:5 window
import subprocess, sys, os
FF = sys.argv[1]; S = sys.argv[2]
R = "/Users/siddhantyadav/Desktop/Found/public/found/raakh/"
jobs = {
  # name: (file, ss, t, speed, vf-size)
  "k3":    (R + "clip-k-3.mp4", 4.3, 3.4, 1.0, None),
  "reel":  (R + "clip-reel-take.mp4", 0.0, 4.6, 0.85, None),
  "fire":  (R + "clip-fire-whole.mp4", 13.0, 6.0, 1.0, None),
  "sparks":(S + "/src/12298312.mp4", 1.0, 6.0, 0.8, "scale=-2:1350,crop=1080:1350"),
  "embers":(S + "/src/13220869.mp4", 2.0, 8.0, 0.8, "scale=-2:1350,crop=1080:1350"),
  "embers2":(S + "/src/9667285.mp4", 30.0, 8.0, 0.8, "scale=-2:1350,crop=1080:1350"),
  "fog":   (S + "/src/11789203.mp4", 2.0, 8.0, 0.7, "scale=-2:1350,crop=1080:1350"),
  "flame": (S + "/src/9121388.mp4", 1.0, 6.0, 0.9, "scale=-2:1350,crop=1080:1350"),
}
only = sys.argv[3:] or list(jobs)
for name in only:
    f, ss, t, sp, vf = jobs[name]
    out = f"frames/{name}"; os.makedirs(out, exist_ok=True)
    chain = f"setpts=PTS/{sp},fps=24" + ("," + vf if vf else "")
    subprocess.run([FF, "-nostdin", "-v", "error", "-y", "-ss", str(ss), "-t", str(t), "-i", f, "-vf", chain, "-q:v", "3", f"{out}/%05d.jpg"], check=True)
    print(name, len(os.listdir(out)))
