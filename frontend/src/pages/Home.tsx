"use client";

import { useState } from "react";
import backendLinks from "../data/yt.json"

interface TechLink {
  id: string;
  title: string;
  url: string;
  addedAt: Date;
}


export default function Home() {
  const [links] = useState<TechLink[]>(() =>
    backendLinks.map((link) => ({
      ...link,
      addedAt: new Date(link.addedAt * 1000),
    }))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className=" w-full mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Techdex</h1>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto border border-gray-700 rounded">
            <table className="min-w-full text-left">
              <thead className="bg-gray-800 text-gray-300">
                <tr>
                  <th className="px-3 py-2 w-10">#</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">URL</th>
                  <th className="px-3 py-2">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-gray-400">
                      No articles match your search.
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link, index) => (
                    <tr key={link.id} className="bg-gray-800 hover:bg-gray-750">
                      <td className="px-3 py-2">{index + 1}</td>
                      <td className="px-3 py-2 font-medium">{link.title}</td>
                      <td className="px-3 py-2">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline truncate block"
                          style={{ maxWidth: "200px" }}
                        >
                          {link.url.replace(/(^\w+:|^)\/\//, "")}
                        </a>
                      </td>
                      <td className="px-3 py-2 text-gray-300">
                        {link.addedAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card/List View */}
        <div className="sm:hidden space-y-4">
          {filteredLinks.length === 0 ? (
            <div className="px-4 py-4 text-center text-gray-400">
              No articles match your search.
            </div>
          ) : (
            filteredLinks.map((link, index) => (
              <div
                key={link.id}
                className="bg-gray-800 rounded p-4 border border-gray-700"
              >
                <div className="text-sm text-gray-400 mb-1">#{index + 1}</div>
                <div className="font-medium text-white">{link.title}</div>
                <div className="mt-1">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline break-words"
                  >
                    {link.url.replace(/(^\w+:|^)\/\//, "")}
                  </a>
                </div>
                <div className="text-gray-300 text-sm mt-1">
                  {link.addedAt.toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
