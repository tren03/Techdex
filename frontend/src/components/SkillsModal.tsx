import Markdown from "react-markdown";

const SKILLS_MD = `
# skills.md

## Languages
Python, Golang

## Frameworks
FastAPI, Django, React, Celery, REST

## Infrastructure
GNU/Linux (Arch btw), Git, Docker, AWS

## Databases
PostgreSQL, DynamoDB
`;

interface Props {
  onClose: () => void;
}

export default function SkillsModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={onClose}
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
          <span className="ml-2 text-gray-400 text-xs font-mono">skills.md</span>
          <button
            onClick={onClose}
            className="ml-auto text-gray-500 hover:text-gray-300 text-xs font-mono transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <article className="prose prose-invert prose-sm">
            <Markdown>{SKILLS_MD}</Markdown>
          </article>
        </div>
      </div>
    </div>
  );
}
