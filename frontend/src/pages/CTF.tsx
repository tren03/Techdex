import { useState } from "react";
import Navbar from "../components/Navbar";
import ctfData from "../data/ctf.json";

interface Challenge {
  id: string;
  name: string;
  difficulty: "easy" | "medium" | "hard";
  link: string;
}

interface CTFCategory {
  category: string;
  challenges: Challenge[];
}

const difficultyColors = {
  easy: "bg-green-500 hover:bg-green-600",
  medium: "bg-yellow-500 hover:bg-yellow-600",
  hard: "bg-red-500 hover:bg-red-600",
};

export default function CTF() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const closeModal = () => {
    setSelectedChallenge(null);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="my-4 text-center font-bold text-3xl">
        CTF Progress Tracker
      </h1>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {(ctfData as CTFCategory[]).map((category) => (
            <div
              key={category.category}
              className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  {category.category}
                </h2>
                <span className="text-sm text-gray-400">
                  {category.challenges.length} challenges
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.challenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => handleChallengeClick(challenge)}
                    className={`w-4 h-4 rounded-full transition-all duration-200 transform hover:scale-125 ${
                      difficultyColors[challenge.difficulty]
                    } shadow-sm`}
                    title={`${challenge.name} (${challenge.difficulty})`}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Easy</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Hard</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for challenge details */}
      {selectedChallenge && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-md"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">
                {selectedChallenge.name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Difficulty:</span>
                  <span
                    className={`px-2 py-1 rounded text-white text-sm capitalize ${
                      selectedChallenge.difficulty === "easy"
                        ? "bg-green-500"
                        : selectedChallenge.difficulty === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {selectedChallenge.difficulty}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-gray-300">Link:</span>
                  <a
                    href={selectedChallenge.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 hover:underline break-all text-sm"
                  >
                    {selectedChallenge.link}
                  </a>
                </div>

                <div className="pt-2">
                  <a
                    href={selectedChallenge.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Open Challenge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
