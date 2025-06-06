import { Route, Routes } from "react-router-dom";
import Youtube from "./pages/Youtube";
import People from "./pages/People";
import Articles from "./pages/Articles";
import Papers from "./pages/Papers";
import MyBlogs from "./pages/MyBlogs";
import BlogPage from "./pages/BlogPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Youtube />} />
      <Route path="/people" element={<People />} />
      <Route path="/papers" element={<Papers />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/my-blogs" element={<MyBlogs />} />
      <Route path="/b/:slug" element={<BlogPage />} />
    </Routes>
  );
}

export default App;
