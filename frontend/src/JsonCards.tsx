// JsonCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";  // Import ShadCN Input component
import { useState } from "react";

interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  addedAt: Date;
}

interface JsonCardsProps {
  articles: Article[];
}

function formatProgrammaticData(article: Article) {
  const epochDate = article.addedAt.getTime(); // Get epoch time
  const humanReadableDate = article.addedAt.toLocaleDateString(); // Get human-readable date
  return `{
  id: ${article.id},
  title: "${article.title}",
  url: "${article.url}",
  addedAt: ${epochDate} (${humanReadableDate})
}`;
}

const JsonCards: React.FC<JsonCardsProps> = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter articles based on the search query
  const filteredArticles = articles.filter((article) => {
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.url.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full sm:w-9/12 p-4 space-y-4">
      {/* ShadCN Input Component */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          // className="bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2"
           className="text-white"
        />
      </div>

      {/* Cards */}
      {filteredArticles.length === 0 ? (
        <p className="text-center text-gray-400">No articles match your search.</p>
      ) : (
        filteredArticles.map((article) => (
          <Card key={article.id} className="dark">
            <CardContent>
              <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg font-mono whitespace-pre-wrap break-words">
                <code>{formatProgrammaticData(article)}</code>
              </pre>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default JsonCards;
