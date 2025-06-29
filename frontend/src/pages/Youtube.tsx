import Navbar from "@/components/Navbar";
import { useMemo } from "react";
import SearchAndTable from "@/components/SearchAndTable";
import ytlinksRaw from "../data/yt.json";
import { Item } from "@/models";

export default function Youtube() {
    const ytlinks: Item[] = useMemo(
        () =>
            ytlinksRaw.map((entry: any) => ({
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
            <h1 className="my-4 text-center font-bold text-3xl">Youtube Links</h1>
            <SearchAndTable items={ytlinks.reverse()} />
        </div>
    )

}