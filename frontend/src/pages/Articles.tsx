import Navbar from "@/components/Navbar";
import { useMemo } from "react";
import SearchAndTable from "@/components/SearchAndTable";
import articlesRawLinks from "../data/articles.json";
import { Item } from "@/models";

export default function Articles() {
    const links: Item[] = useMemo(
        () =>
            articlesRawLinks.map((entry: any) => ({
                id: entry.id,
                title: entry.title,
                url: entry.url,
                summary: entry.summary,
                addedAt: new Date(entry.addedAt),
            })),
        []
    );
    return (
        <div>
            <Navbar />
            <h1 className="my-4 text-center font-bold text-3xl">Articles</h1>
            <SearchAndTable items={links.reverse()} />
        </div>
    )

}