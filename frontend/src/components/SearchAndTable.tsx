import { useState } from "react";
import { Item } from "@/models";

interface Props {
    items: Item[];
    onClickRow?: (item: Item) => void;
}

export default function SearchAndTable({
    items, onClickRow
}: Props) {
    const [searchQuery, setSearchQuery] = useState<string>("")

    const filtered = items.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.title.toLowerCase().includes(query) ||
            item.url.toLowerCase().includes(query)
        );
    });

    return (
        <>
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
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
                                <th className="px-3 py-2">Name</th>
                                <th className="px-3 py-2">URL</th>
                                <th className="px-3 py-2">Date Added</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-3 py-4 text-center text-gray-400"
                                    >
                                        No results match your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((item, index) => (
                                    <tr key={item.id} onClick={() => onClickRow?.(item)} className="bg-gray-800 hover:bg-gray-750">
                                        <td className="px-3 py-2">{index + 1}</td>
                                        <td className="px-3 py-2 font-medium">{item.title}</td>
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
                {filtered.length === 0 ? (
                    <div className="px-4 py-4 text-center text-gray-400">
                        No results match your search.
                    </div>
                ) : (
                    filtered.map((item, index) => (
                        <div
                            key={item.id}
                            onClick={() => onClickRow?.(item)}
                            className="bg-gray-800 rounded p-4 border border-gray-700"
                        >
                            <div className="text-sm text-gray-400 mb-1">#{index + 1}</div>
                            <div className="font-medium text-white">{item.title}</div>
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
        </>
    );
}
