// Renders a spec to MP4: steps the animation frame by frame, pipes JPEGs into ffmpeg.
let chromium;try{({chromium}=require('playwright'));}catch(e){({chromium}=require('/home/claude/.npm-global/lib/node_modules/@playwright/mcp/node_modules/playwright'));}
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const D = __dirname, FPS = 30;
const logo = fs.readFileSync(path.join(D, 'logo-inline.svg'), 'utf8')
  .replace(/#000001/g, '#FFFFFF').replace(/#000002/g, '#8A98FF').replace(/#000003/g, '#FFFFFF').replace(/#000004/g, '#F5C043');
(async () => {
  const name = process.argv[2], stillsOnly = process.argv[3] === 'stills';
  const spec = JSON.parse(fs.readFileSync(path.join(D, 'specs', name + '.json'), 'utf8'));
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.addInitScript(l => { window.__LOGO = l; }, logo);
  await p.goto('file://' + path.join(D, 'stage.html'));
  await p.evaluate(() => document.fonts.ready);
  const T = await p.evaluate(s => window.build(s), spec);
  await p.waitForTimeout(400);
  if (stillsOnly) {
    let a = 0; const outs = [];
    for (let i = 0; i < spec.scenes.length; i++) { const t = a + spec.scenes[i].dur - 0.3; a += spec.scenes[i].dur;
      await p.evaluate(t => window.seek(t), t); const f = path.join(D, 'stills', `${name}-${i}.jpg`); await p.screenshot({ path: f, type: 'jpeg', quality: 80 }); outs.push(f); }
    console.log(outs.join('\n')); await b.close(); return;
  }
  const out = path.join(D, 'out', name + '.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const N = Math.round(T * FPS);
  for (let i = 0; i < N; i++) {
    await p.evaluate(t => window.seek(t), i / FPS);
    const buf = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  // poster frame from the first scene
  await p.evaluate(t => window.seek(t), spec.scenes[0].dur - 0.3);
  await p.screenshot({ path: path.join(D, 'out', name + '-poster.jpg'), type: 'jpeg', quality: 85 });
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  console.log(out, N, 'frames', T.toFixed(1) + 's'); await b.close();
})();
