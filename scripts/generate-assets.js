// Script to generate all game assets (images and audio files) in public/assets/
import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate valid WAV buffer that browsers / media players play seamlessly
function createWavBuffer(durationSeconds, sampleRate, sampleGenerator) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // audioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, sampleGenerator(t, durationSeconds)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Sound definitions
const sampleRate = 22050;

const sounds = {
  'piuw.mp3': (t) => {
    // High-pitched laser drop
    const freq = 1200 * Math.exp(-t * 15);
    return Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 8);
  },
  'dry-fart.mp3': (t) => {
    // Low frequency buzzing stutter with harmonics
    const wobble = Math.sin(2 * Math.PI * 18 * t);
    const freq = 75 + wobble * 25 + Math.random() * 15;
    const saw = ((t * freq) % 1) * 2 - 1;
    return saw * (0.8 + 0.2 * Math.random()) * Math.exp(-t * 2.5);
  },
  '30-s-left.mp3': (t) => {
    // Heartbeat clock ticks and intense alarm beeps
    const tickTime = t % 0.5;
    if (tickTime < 0.08) {
      return Math.sin(2 * Math.PI * 880 * tickTime) * Math.exp(-tickTime * 40);
    }
    return 0;
  },
  'faaah.mp3': (t) => {
    // Dramatic choir drop / gasp chord
    const f1 = Math.sin(2 * Math.PI * 220 * t);
    const f2 = Math.sin(2 * Math.PI * 277.18 * t);
    const f3 = Math.sin(2 * Math.PI * 329.63 * t);
    return (f1 + f2 + f3) / 3 * Math.exp(-t * 1.2);
  },
  'get-out-tuco.mp3': (t) => {
    // Tuco dramatic heavy bass punch with distorted stinger
    const freq = 180 * Math.exp(-t * 2);
    const dist = Math.sin(2 * Math.PI * freq * t);
    return Math.max(-0.8, Math.min(0.8, dist * 2)) * Math.exp(-t * 1.5);
  },
  'du-bist-gut-genug.mp3': (t) => {
    // Victory fanfare synth arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    const noteIdx = Math.min(notes.length - 1, Math.floor(t * 5));
    const freq = notes[noteIdx];
    return Math.sin(2 * Math.PI * freq * t) * 0.7 * (1 - (t % 0.2) * 4);
  },
  'suuuuui.mp3': (t) => {
    // Ronaldo SUUUU cheer stinger (rising sweep to powerful pitch)
    const freq = 200 + 400 * (t / 1.5);
    const wave = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(4 * Math.PI * freq * t);
    return wave * 0.8 * Math.exp(-t * 0.8);
  },
  'yyy_ahqVbsA.mp3': (t) => {
    // Wrong answer sad trombone / buzzer
    const freq = 150 - 40 * t;
    const saw = ((t * freq) % 1) * 2 - 1;
    return saw * Math.exp(-t * 1.2);
  },
  'quack_5.mp3': (t) => {
    // Funny duck quack
    const f = 400 + Math.sin(2 * Math.PI * 30 * t) * 100;
    return ((t * f) % 1 > 0.5 ? 0.7 : -0.7) * Math.exp(-t * 3);
  },
  'anime-girl-voice.mp3': (t) => {
    // High anime sparkle chime
    const f1 = 1200 + 300 * Math.sin(2 * Math.PI * 10 * t);
    return Math.sin(2 * Math.PI * f1 * t) * Math.exp(-t * 3);
  },
  'n-ldhy-smtny-my-hydr.mp3': (t) => {
    // Epic warrior chant / fanfare bass horn
    const f = 110 + Math.sin(t * 4) * 10;
    return (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2 * t)) * Math.exp(-t * 0.6);
  },
  'plankton-augh.mp3': (t) => {
    // Plankton comical scream stinger
    const f = 300 + 200 * Math.sin(t * 25);
    return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 2);
  },
  'Msic00.mp3': (t) => {
    // Main menu groovy rhythm beat loop (4 seconds loop)
    const beat = Math.floor(t * 2) % 4;
    const bass = Math.sin(2 * Math.PI * (beat === 0 ? 55 : (beat === 2 ? 65.41 : 49)) * t);
    const hihat = (t % 0.25 < 0.03) ? (Math.random() * 0.3) : 0;
    const melody = Math.sin(2 * Math.PI * (220 + beat * 55) * t) * 0.2;
    return bass * 0.5 + hihat + melody;
  },
  'msic01.mp3': (t) => {
    // Investigation tension track (low suspense drone + ticking)
    const drone = Math.sin(2 * Math.PI * 40 * t) * 0.6 + Math.sin(2 * Math.PI * 40.5 * t) * 0.3;
    const tick = (t % 1 < 0.05) ? (Math.sin(2 * Math.PI * 1200 * (t % 1)) * 0.3) : 0;
    return drone + tick;
  },
  'msic02.mp3': (t) => {
    // Voting high drama countdown beat
    const fastBeat = Math.floor(t * 4) % 8;
    const freq = [130.81, 146.83, 155.56, 174.61, 130.81, 155.56, 174.61, 196.00][fastBeat];
    const pulse = Math.sin(2 * Math.PI * freq * t) * 0.4;
    const snare = (t % 0.5 > 0.45) ? (Math.random() * 0.4) : 0;
    return pulse + snare;
  }
};

const durations = {
  'piuw.mp3': 0.3,
  'dry-fart.mp3': 1.2,
  '30-s-left.mp3': 2.5,
  'faaah.mp3': 1.8,
  'get-out-tuco.mp3': 1.5,
  'du-bist-gut-genug.mp3': 2.0,
  'suuuuui.mp3': 1.8,
  'yyy_ahqVbsA.mp3': 1.5,
  'quack_5.mp3': 0.8,
  'anime-girl-voice.mp3': 1.2,
  'n-ldhy-smtny-my-hydr.mp3': 3.0,
  'plankton-augh.mp3': 1.0,
  'Msic00.mp3': 4.0,
  'msic01.mp3': 4.0,
  'msic02.mp3': 4.0
};

console.log('Generating audio files in public/assets/...');
for (const [filename, generator] of Object.entries(sounds)) {
  const filePath = path.join(assetsDir, filename);
  const dur = durations[filename] || 1.5;
  const buffer = createWavBuffer(dur, sampleRate, generator);
  fs.writeFileSync(filePath, buffer);
  console.log(`Saved ${filename} (${buffer.length} bytes)`);
}

// Generate stylish SVG-based rasterized images for game assets
function createSvgData(title, subtitle, bgColor1, bgColor2, accentColor, iconSvg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor1}" />
        <stop offset="100%" stop-color="${bgColor2}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0" />
      </radialGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${accentColor}" stroke-opacity="0.08" stroke-width="1" />
      </pattern>
    </defs>
    
    <rect width="800" height="800" fill="url(#bg)" />
    <rect width="800" height="800" fill="url(#grid)" />
    <circle cx="400" cy="400" r="350" fill="url(#glow)" />
    
    <!-- Outer Cyber Border -->
    <rect x="24" y="24" width="752" height="752" rx="32" fill="none" stroke="${accentColor}" stroke-width="3" stroke-opacity="0.4" stroke-dasharray="16 8" />
    <rect x="36" y="36" width="728" height="728" rx="24" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.2" />

    <!-- Center Icon Area -->
    <g transform="translate(400, 360)">
      ${iconSvg}
    </g>

    <!-- Title & Subtitle -->
    <text x="400" y="580" text-anchor="middle" font-family="'Cairo', 'Outfit', sans-serif" font-weight="900" font-size="44" fill="#ffffff" letter-spacing="2">
      ${title}
    </text>
    <text x="400" y="635" text-anchor="middle" font-family="'Cairo', 'Outfit', sans-serif" font-weight="600" font-size="24" fill="${accentColor}" letter-spacing="1">
      ${subtitle}
    </text>
    
    <!-- Bottom Badge -->
    <rect x="280" y="680" width="240" height="42" rx="21" fill="${accentColor}" fill-opacity="0.15" stroke="${accentColor}" stroke-width="1.5" />
    <text x="400" y="708" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="800" font-size="18" fill="#ffffff" letter-spacing="4">
      Z3MA IMPOSTER
    </text>
  </svg>`;
}

const images = {
  'Icon.jpg': createSvgData(
    'Z3MA IMPOSTER',
    'PARTY SOCIAL DEDUCTION',
    '#050811',
    '#0a1428',
    '#00d2ff',
    `<circle r="140" fill="#00d2ff" fill-opacity="0.1" stroke="#00d2ff" stroke-width="6"/>
     <path d="M-60 -40 L0 -100 L60 -40 L40 60 L-40 60 Z" fill="#00d2ff" fill-opacity="0.85"/>
     <polygon points="0,-70 -35,-20 35,-20" fill="#050811"/>
     <text x="0" y="30" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="48" font-weight="900" fill="#050811">Z3</text>`
  ),
  'Main.jpg': createSvgData(
    'Z3MA IMPOSTER',
    'الشك راهو يدور في القعدة 😈',
    '#070a14',
    '#111827',
    '#38bdf8',
    `<circle r="130" fill="#38bdf8" fill-opacity="0.1" stroke="#38bdf8" stroke-width="4"/>
     <path d="M-80 -20 Q0 -90 80 -20 Q80 80 0 100 Q-80 80 -80 -20 Z" fill="#38bdf8" fill-opacity="0.7"/>
     <circle cx="-30" cy="-10" r="16" fill="#070a14"/>
     <circle cx="30" cy="-10" r="16" fill="#070a14"/>
     <circle cx="-30" cy="-10" r="6" fill="#ffffff"/>
     <circle cx="30" cy="-10" r="6" fill="#ffffff"/>
     <path d="M-25 40 Q0 60 25 40" stroke="#070a14" stroke-width="6" fill="none" stroke-linecap="round"/>`
  ),
  'Man.jpg': createSvgData(
    'لاعب بريء',
    'CREWMATE INNOCENT',
    '#062319',
    '#09432d',
    '#10b981',
    `<circle r="130" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="4"/>
     <circle cx="0" cy="-10" r="80" fill="#ffffff"/>
     <circle cx="-35" cy="-25" r="28" fill="#0f172a"/>
     <circle cx="35" cy="-25" r="28" fill="#0f172a"/>
     <circle cx="-40" cy="-32" r="10" fill="#ffffff"/>
     <circle cx="30" cy="-32" r="10" fill="#ffffff"/>
     <path d="M-25 15 Q0 35 25 15" stroke="#0f172a" stroke-width="6" fill="none" stroke-linecap="round"/>
     <circle cx="-65" cy="50" r="25" fill="#f43f5e" stroke="#ffffff" stroke-width="4"/>`
  ),
  'Imposter.jpg': createSvgData(
    'IMPOSTER 😈',
    'أنت هو الخداع... ما تفضحش روحك!',
    '#260408',
    '#4c0519',
    '#f43f5e',
    `<circle r="130" fill="#f43f5e" fill-opacity="0.2" stroke="#f43f5e" stroke-width="5"/>
     <!-- Wolf Hood / Demon Mask -->
     <path d="M-70 -70 L-40 -10 L0 -50 L40 -10 L70 -70 L60 30 L0 80 L-60 30 Z" fill="#f43f5e"/>
     <polygon points="-30,0 -10,15 -35,20" fill="#facc15"/>
     <polygon points="30,0 10,15 35,20" fill="#facc15"/>
     <path d="M-30 45 Q0 65 30 45" stroke="#ffffff" stroke-width="6" fill="none"/>`
  ),
  'Voting.jpg': createSvgData(
    'شاشة التصويت 🗳️',
    'فيمن راك شاك؟ صوّت بحذر!',
    '#180828',
    '#2e1065',
    '#a855f7',
    `<circle r="130" fill="#a855f7" fill-opacity="0.15" stroke="#a855f7" stroke-width="4"/>
     <path d="M-70 20 L-20 -40 L20 -40 L70 20 L50 60 L-50 60 Z" fill="#a855f7" fill-opacity="0.8"/>
     <rect x="-35" y="-10" width="70" height="40" rx="8" fill="#ffffff"/>
     <line x1="0" y1="-30" x2="0" y2="10" stroke="#a855f7" stroke-width="8" stroke-linecap="round"/>`
  ),
  'Victory_imposters.png': createSvgData(
    'فوز الـ IMPOSTER 😈',
    'تحيا كامل الـ IMPOSTERS... قلبوها عليكم!',
    '#20040a',
    '#500724',
    '#fb7185',
    `<circle r="140" fill="#fb7185" fill-opacity="0.2" stroke="#fb7185" stroke-width="6"/>
     <text x="0" y="30" text-anchor="middle" font-size="90">👑</text>
     <path d="M-80 50 Q0 80 80 50" stroke="#fb7185" stroke-width="8" fill="none" stroke-linecap="round"/>`
  ),
  'Imposter_lose.png': createSvgData(
    'فوز اللاعبين الأبرياء 🎉',
    'بلع فمك يا الـ IMPOSTER... مفضوح مفضوح!',
    '#051c24',
    '#0c4a6e',
    '#38bdf8',
    `<circle r="140" fill="#38bdf8" fill-opacity="0.2" stroke="#38bdf8" stroke-width="6"/>
     <text x="0" y="30" text-anchor="middle" font-size="90">🏆</text>`
  ),
  'Assistant.jpg': createSvgData(
    'المساعد السري 🤫',
    'عاون صاحبك الـ Imposter بلا ما تفضحو!',
    '#241505',
    '#451a03',
    '#f59e0b',
    `<circle r="130" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="4"/>
     <path d="M-50 -40 Q0 -90 50 -40 Q50 60 0 80 Q-50 60 -50 -40 Z" fill="#f59e0b" fill-opacity="0.8"/>
     <circle cx="-20" cy="-20" r="10" fill="#ffffff"/>
     <circle cx="20" cy="-20" r="10" fill="#ffffff"/>
     <line x1="0" y1="0" x2="0" y2="40" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>`
  ),
  'Stop.jpg': createSvgData(
    'توقف المؤقت ⏸️',
    'TIME OUT - استراحة أو نقاش خاص',
    '#18181b',
    '#27272a',
    '#e4e4e7',
    `<circle r="130" fill="#ffffff" fill-opacity="0.1" stroke="#e4e4e7" stroke-width="4"/>
     <rect x="-40" y="-50" width="30" height="100" rx="8" fill="#e4e4e7"/>
     <rect x="10" y="-50" width="30" height="100" rx="8" fill="#e4e4e7"/>`
  )
};

console.log('Writing images to public/assets/...');
for (const [filename, svgContent] of Object.entries(images)) {
  const filePath = path.join(assetsDir, filename);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Saved ${filename}`);
}

console.log('Asset generation completed successfully!');
