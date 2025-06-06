import Markdown from "react-markdown";
import Navbar from "./Navbar";

interface props {
    markdown: string
}
export default function Blog({ markdown }: props) {
    return (
        <div className=" min-h-screen">
            <Navbar />
            <div className="my-8 max-w-3xl mx-auto px-4 sm:px-6">
                <article className="prose prose-invert prose-lg sm:prose-xl break-words">
                    <Markdown
                        components={{
                            a: ({ node, ...props }) => (
                                <a
                                    {...props}
                                    className="break-words text-blue-400 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    >
                        {markdown}
                    </Markdown>
                </article>
            </div>
        </div>
    );
}
