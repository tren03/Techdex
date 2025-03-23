"use client";

import { useState } from "react";

interface TechLink {
  id: string;
  title: string;
  url: string;
  addedAt: Date;
}

export default function Home() {
  const [links, setLinks] = useState<TechLink[]>([
    {
      id: "1",
      title: "The Future of React",
      url: "https://react.dev/blog/2023/03/16/introducing-react-dev",
      addedAt: new Date("2023-03-16"),
    },
    {
      id: "2",
      title: "Next.js 14",
      url: "https://nextjs.org/blog/next-14",
      addedAt: new Date("2023-10-26"),
    },
    {
      id: "3",
      title: "TypeScript 5.0",
      url: "https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/",
      addedAt: new Date("2023-03-20"),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
  });

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tech Article Bookmarks</h1>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">URL</th>
                <th className="px-4 py-3">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-400"
                  >
                    No articles match your search.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link, index) => (
                  <tr key={link.id} className="bg-gray-800 hover:bg-gray-750">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{link.title}</td>
                    <td className="px-4 py-3">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {link.url.replace(/(^\w+:|^)\/\//, "").substring(0, 30)}
                        {link.url.length > 30 ? "..." : ""}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {link.addedAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
