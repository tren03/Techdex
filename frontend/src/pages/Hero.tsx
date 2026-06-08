import { useState, useEffect, useRef, startTransition } from "react";
import Navbar from "@/components/Navbar";
import ResumeModal from "@/components/ResumeModal";
import SkillsModal from "@/components/SkillsModal";

const ASCII_CHARS = "@%#*+=-:. ";
const IMG_SRC = "/tux.png";

const CHAR_ASPECT = 0.601;

function imageToAscii(img: HTMLImageElement, width: number, height: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  let ascii = "";
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const off = (y * width + x) * 4;
      const brightness = 0.2126 * data[off] + 0.7152 * data[off + 1] + 0.0722 * data[off + 2];
      ascii += ASCII_CHARS[Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))];
    }
    ascii += "\n";
  }
  return ascii;
}

function applyDrift(base: string, tick: number): string {
  const chars = ASCII_CHARS.split("");
  const n = chars.length;
  return base
    .split("\n")
    .map((line, y) =>
      line
        .split("")
        .map((ch, x) => {
          if (ch === " ") return ch;
          const idx = chars.indexOf(ch);
          if (idx < 0) return ch;
          const seed = (x * 8191) ^ (y * 3191) ^ (tick * 103);
          const offset = Math.round(((Math.sin(seed) + 1) * 99999) % 1);
          let next = (idx + offset) % n;
          if (n > 8 && Math.abs(offset) < 2 && seed % 4 === 0) next = (idx - 1 + n) % n;
          return chars[next];
        })
        .join("")
    )
    .join("\n");
}

const COLOR = "#60a5fa";

function makePreStyle(extra?: React.CSSProperties): React.CSSProperties {
  return {
    margin: 0,
    fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
    color: COLOR,
    whiteSpace: "pre",
    lineHeight: "1.1",
    background: "none",
    letterSpacing: 0,
    textAlign: "left",
    fontWeight: 400,
    ...extra,
  };
}

export default function Hero() {
  const [ascii, setAscii] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [showResume, setShowResume] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animating = false;
    let rafId: number | undefined;
    const baseRef = { current: "" };

    function startDrift() {
      animating = true;
      let last = Date.now();
      let tick = 0;
      function animate() {
        if (!animating) return;
        rafId = requestAnimationFrame(animate);
        if (Date.now() - last > 120) {
          tick++;
          startTransition(() => setAscii(applyDrift(baseRef.current, tick)));
          last = Date.now();
        }
      }
      animate();
    }

    function generate(containerWidth: number) {
      const img = imgRef.current;
      if (!img) return;
      const fs = Math.max(8, Math.min(16, containerWidth * 0.018));
      const charPx = fs * CHAR_ASPECT;
      const w = Math.max(20, Math.floor(containerWidth / charPx));
      const h = Math.max(2, Math.round((w / (img.naturalWidth / img.naturalHeight)) * 0.5));
      setFontSize(fs);
      baseRef.current = imageToAscii(img, w, h);
      startTransition(() => setAscii(baseRef.current));
    }

    const obs = new ResizeObserver((entries) => {
      animating = false;
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      generate(entries[0].contentRect.width);
      startDrift();
    });

    const img = new window.Image();
    img.src = IMG_SRC;
    img.onload = () => {
      imgRef.current = img;
      if (containerRef.current) obs.observe(containerRef.current);
    };

    return () => {
      animating = false;
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      obs.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-10 p-8">
        <div ref={containerRef} style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <pre
              aria-hidden
              style={makePreStyle({
                fontSize,
                position: "absolute",
                inset: 0,
                opacity: 0.2,
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
                textShadow: `0 0 8px ${COLOR}99, 0 0 18px ${COLOR}55, 0 0 32px ${COLOR}30`,
              })}
            >{ascii}</pre>
            <pre
              aria-hidden
              style={makePreStyle({
                fontSize,
                position: "absolute",
                inset: 0,
                opacity: 0.5,
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
                textShadow: `0 0 2px ${COLOR}EE, 0 0 4px ${COLOR}CC`,
              })}
            >{ascii}</pre>
            <pre style={makePreStyle({ fontSize, position: "relative", zIndex: 1 })}>{ascii}</pre>
          </div>
        </div>

        <div className="text-center max-w-xl space-y-4">
          <h1 className="text-4xl font-bold tracking-wide">Hi, I'm Vishnu.</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Software engineer with a thing for GNU/Linux, split keyboards, and vim.
            This is my personal index — videos, articles, papers, and people I keep coming back to.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => setShowResume(true)}
              className="font-mono text-blue-400 border border-blue-400/40 px-4 py-2 rounded hover:bg-blue-400/10 transition-colors text-sm"
            >
              $ get-resume
            </button>
            <button
              onClick={() => setShowSkills(true)}
              className="font-mono text-blue-400 border border-blue-400/40 px-4 py-2 rounded hover:bg-blue-400/10 transition-colors text-sm"
            >
              $ cat skills.md
            </button>
          </div>
        </div>

        {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
        {showSkills && <SkillsModal onClose={() => setShowSkills(false)} />}
      </div>
    </div>
  );
}
