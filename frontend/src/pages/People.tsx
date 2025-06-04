import Navbar from "@/components/Navbar";
import { useMemo } from "react";
import SearchAndTable from "@/components/SearchAndTable";
import pplinksRaw from "../data/ppl.json";
import { Item } from "@/models";

export default function People() {
    const pplinks: Item[] = useMemo(
        () =>
            pplinksRaw.map((entry: any) => ({
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
            <h1 className="my-4 text-center font-bold text-3xl">People</h1>
            <SearchAndTable items={pplinks.reverse()} />
        </div>
    )

}