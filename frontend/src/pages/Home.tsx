"use client";

import { useState } from "react";
import backendLinks from "../data/yt.json";
import backendPeople from "../data/ppl.json"; // Import your people data

interface TechLink {
  id: string;
  title: string;
  url: string;
  addedAt: Date;
}

interface Person {
  id: string;
  name: string;
  url: string;
  addedAt: Date;
}

export default function Home() {
  // "links" for YouTube links, "people" for people data
  const [activeTab, setActiveTab] = useState<"links" | "people">("links");
  const [searchQuery, setSearchQuery] = useState("");

  // Process links, converting addedAt to Date
  backendLinks.reverse()
  backendPeople.reverse()
  const [links] = useState<TechLink[]>(() =>
    backendLinks.map((link) => ({
      ...link,
      addedAt: new Date(link.addedAt),
    }))
  );

  // Process people, converting addedAt to Date
  const [people] = useState<Person[]>(() =>
    backendPeople.map((person) => ({
      ...person,
      addedAt: new Date(person.addedAt),
    }))
  );

  // Filter links by title or URL
  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  });

  // Filter people by name or URL
  const filteredPeople = people.filter((person) => {
    const query = searchQuery.toLowerCase();
    return (
      person.name.toLowerCase().includes(query) ||
      person.url.toLowerCase().includes(query)
    );
  });

  // Select which data set to display based on activeTab
  const displayedItems =
    activeTab === "links" ? filteredLinks : filteredPeople;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => {
            setActiveTab("links");
            setSearchQuery(""); // Optionally clear the search when switching
          }}
          className={`px-4 py-2 rounded-l-md transition-all duration-200 ${
            activeTab === "links"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:text-white"
          }`}
        >
          Links
        </button>
        <button
          onClick={() => {
            setActiveTab("people");
            setSearchQuery("");
          }}
          className={`px-4 py-2 rounded-r-md transition-all duration-200 ${
            activeTab === "people"
              ? "bg-blue-500 text-white"
              : "bg-gray-800 text-gray-300 hover:text-white"
          }`}
        >
          People
        </button>
      </div>

      {/* Header Title */}
      <h1 className="text-3xl font-bold mb-4 text-center">
          Techdex
      </h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${activeTab === "links" ? "links" : "people"}...`}
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
                <th className="px-3 py-2">
                  {activeTab === "links" ? "Title" : "Name"}
                </th>
                <th className="px-3 py-2">URL</th>
                <th className="px-3 py-2">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {displayedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-gray-400"
                  >
                    No results match your search.
                  </td>
                </tr>
              ) : (
                displayedItems.map((item, index) => (
                  <tr key={item.id} className="bg-gray-800 hover:bg-gray-750">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2 font-medium">
                      {activeTab === "links"
                        ? (item as TechLink).title
                        : (item as Person).name}
                    </td>
                    <td className="px-3 py-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline truncate block"
                        style={{ maxWidth: "200px" }}
                      >
                        {item.url.replace(/(^\w+:|^)\/\//, "")}
                      </a>
                    </td>
                    <td className="px-3 py-2 text-gray-300">
                      {item.addedAt.toLocaleDateString()}
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
        {displayedItems.length === 0 ? (
          <div className="px-4 py-4 text-center text-gray-400">
            No results match your search.
          </div>
        ) : (
          displayedItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-gray-800 rounded p-4 border border-gray-700"
            >
              <div className="text-sm text-gray-400 mb-1">#{index + 1}</div>
              <div className="font-medium text-white">
                {activeTab === "links"
                  ? (item as TechLink).title
                  : (item as Person).name}
              </div>
              <div className="mt-1">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline break-words"
                >
                  {item.url.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
              <div className="text-gray-300 text-sm mt-1">
                {item.addedAt.toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
