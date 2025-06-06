import Navbar from "@/components/Navbar";
import { useMemo } from "react";
import { Item } from "@/models";
import rawBlogs from "../data/blogs.json"
import SearchAndTable from "@/components/SearchAndTable";
import { useNavigate } from "react-router-dom";

export default function MyBlogs() {
    const navigate = useNavigate()
    const blogs: Item[] = useMemo(
        () =>
            rawBlogs.map((entry: any) => ({
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
            <h1 className="my-4 text-center font-bold text-3xl ">
                My Blogs
            </h1>
            <SearchAndTable items={blogs.reverse()} onClickRow={(item) => navigate(`/b/${item.url}`)} />
        </div>
    );
}
