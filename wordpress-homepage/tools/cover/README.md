# Cover and trailer renderer

Makes LinkedIn article covers (1920x1080 JPG) and short trailer videos in the Jay's AI Playbook style.

1. Fonts (not committed, OFL): from this folder run
   `git clone -q --depth 1 --filter=blob:none --sparse https://github.com/google/fonts.git gf && cd gf && git sparse-checkout set ofl/figtree ofl/bricolagegrotesque ofl/jetbrainsmono && cd ..`
2. Write a spec in `specs/<name>.json`, e.g. `{"scenes":[{"type":"cta","dur":3,"eyebrow":"LinkedIn article · <pillar>","title":"<title>","small":"<one-line subtitle>"}]}`
3. Cover: `mkdir -p stills out && node render.js <name> stills` → `stills/<name>-0.jpg`
   Video: `node render.js <name>` → `out/<name>.mp4` (needs ffmpeg)
Chromium: /opt/pw-browsers/chromium.
