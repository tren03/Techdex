import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Blog from "@/components/Blog";

export function loadMarkdown(slug: string): Promise<string> {
    return fetch(`/blogs/${slug}.md`)
        .then((res) => {
            if (!res.ok) throw new Error("Not found");
            return res.text();
        })
        .catch(() => "# 404\nBlog not found.");
}

export default function BlogPage() {
    const { slug } = useParams();
    console.log(slug)
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        if (slug) {
            loadMarkdown(slug).then(setMarkdown);
        }
    }, [slug]);

    return <Blog markdown={markdown} />;
}
