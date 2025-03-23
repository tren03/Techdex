import JsonCards from "./JsonCards"; // Adjust the import based on your folder structure

const articles = [
  {
    id: "1",
    title: "Article 1",
    description: "Description of article 1",
    url: "https://example.com/article1",
    addedAt: new Date(),
  },
  {
    id: "2",
    title: "Article 2",
    description: "Description of article 2",
    url: "https://example.com/article2",
    addedAt: new Date(),
  },
  // Add more articles as needed
];

function App() {
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center ">
      <JsonCards articles={articles} />
    </div>
  );
}

export default App;
