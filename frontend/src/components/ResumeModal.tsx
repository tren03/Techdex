import { useState, useEffect, useRef, useCallback } from "react";

const RESUME_URL = "https://ymxadwabx8zitdmi.public.blob.vercel-storage.com/hire_me.pdf";

const PROMPT_USER = "tren03@arch";
const PROMPT_DIR = "~";
const CMD_ARG = " make resume";

type LineType = "success" | "section" | "blank" | "final";

interface PipelineLine {
  text: string;
  type: LineType;
  delay: number;
}

const PIPELINE: PipelineLine[] = [
  { text: "", type: "blank", delay: 200 },
  { text: "── Scanning experience...", type: "section", delay: 300 },
  { text: "✓ backend engineering", type: "success", delay: 150 },
  { text: "✓ GNU/Linux systems", type: "success", delay: 120 },
  { text: "✓ Go, vim", type: "success", delay: 100 },
  { text: "", type: "blank", delay: 150 },
  { text: "── Running tests...", type: "section", delay: 300 },
  { text: "✓ split_keyboard_test.go ... ok", type: "success", delay: 220 },
  { text: "✓ reads_the_manual_test.go ... ok", type: "success", delay: 260 },
  { text: "✓ ships_working_code_test.go ... ok", type: "success", delay: 220 },
  { text: "", type: "blank", delay: 150 },
  { text: "── Building...", type: "section", delay: 300 },
  { text: "✓ go build -o bin/tren03 ./...", type: "success", delay: 350 },
  { text: "✓ Stripping unnecessary meetings", type: "success", delay: 200 },
  { text: "✓ Optimizing for impact", type: "success", delay: 160 },
  { text: "", type: "blank", delay: 150 },
  { text: "── Containerizing candidate...", type: "section", delay: 300 },
  { text: "✓ FROM arch:latest", type: "success", delay: 160 },
  { text: "✓ COPY ./skills /usr/bin/", type: "success", delay: 160 },
  { text: "✓ EXPOSE personality", type: "success", delay: 160 },
  { text: '✓ CMD ["hire", "tren03"]', type: "success", delay: 160 },
  { text: "", type: "blank", delay: 150 },
  { text: "── Deploying...", type: "section", delay: 300 },
  { text: "✓ Successfully built tren03.pdf", type: "success", delay: 500 },
  { text: "", type: "blank", delay: 200 },
  { text: "── Opening resume...", type: "final", delay: 400 },
];

function renderLine(line: PipelineLine, idx: number) {
  if (line.type === "blank") return <div key={idx} className="h-3" />;
  const colorClass =
    line.type === "success"
      ? "text-green-400"
      : line.type === "section"
      ? "text-blue-400"
      : "text-yellow-400";
  return (
    <div key={idx} className={`${colorClass} leading-5`}>
      {line.text}
    </div>
  );
}

interface Props {
  onClose: () => void;
}

export default function ResumeModal({ onClose }: Props) {
  const [typedChars, setTypedChars] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "running">("typing");
  const bottomRef = useRef<HTMLDivElement>(null);

  const skip = useCallback(() => {
    if (RESUME_URL !== "#") window.open(RESUME_URL, "_blank");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const cmdLen = CMD_ARG.length;

    // Type the command arg character by character
    for (let i = 1; i <= cmdLen; i++) {
      ids.push(setTimeout(() => setTypedChars(i), 300 + i * 48));
    }

    const afterType = 300 + cmdLen * 48 + 150;
    ids.push(setTimeout(() => setPhase("running"), afterType));

    // Show pipeline lines with cumulative delays
    let cum = afterType + 100;
    PIPELINE.forEach((line, i) => {
      cum += line.delay;
      ids.push(setTimeout(() => setVisibleCount(i + 1), cum));
      if (line.type === "final") {
        ids.push(
          setTimeout(() => {
            if (RESUME_URL !== "#") window.open(RESUME_URL, "_blank");
            setTimeout(onClose, 600);
          }, cum + 900)
        );
      }
    });

    return () => ids.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleCount, typedChars]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [skip]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={skip}
    >
      <div
        className="w-full max-w-xl mx-4 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          <span className="ml-2 text-gray-400 text-xs font-mono">make resume</span>
          <button
            onClick={skip}
            className="ml-auto text-gray-500 hover:text-gray-300 text-xs font-mono transition-colors"
          >
            skip →
          </button>
        </div>

        {/* Body */}
        <div className="p-5 font-mono text-sm max-h-96 overflow-y-auto">
          {/* Command line */}
          <div className="leading-5">
            <span className="text-green-400">{PROMPT_USER}</span>
            <span className="text-gray-500">:</span>
            <span className="text-blue-400">{PROMPT_DIR}</span>
            <span className="text-gray-400">$</span>
            <span className="text-gray-100">{CMD_ARG.slice(0, typedChars)}</span>
            {phase === "typing" && (
              <span className="text-gray-100 animate-pulse">▋</span>
            )}
          </div>

          {/* Pipeline output */}
          {phase === "running" &&
            PIPELINE.slice(0, visibleCount).map((line, i) =>
              renderLine(line, i)
            )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
