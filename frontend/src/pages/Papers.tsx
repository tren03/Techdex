import Navbar from "@/components/Navbar";
import { useMemo } from "react";
import SearchAndTable from "@/components/SearchAndTable";
import papersRawLinks from "../data/papers.json";
import { Item } from "@/models";

export default function Papers() {
    const links: Item[] = useMemo(
        () =>
            papersRawLinks.map((entry: any) => ({
                id: entry.id,
                title: entry.title,
                url: entry.url,
                addedAt: new Date(entry.addedAt),
            })),
        []
    );
    return (
        <div>
            <Navbar />
            <h1 className="my-4 text-center font-bold text-3xl">Papers</h1>
            <SearchAndTable items={links.reverse()} />
        </div>
    )

}