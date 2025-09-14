import { Route, Routes } from "react-router-dom";
import Youtube from "./pages/Youtube";
import People from "./pages/People";
import Articles from "./pages/Articles";
import Papers from "./pages/Papers";
import MyBlogs from "./pages/MyBlogs";
import BlogPage from "./pages/BlogPage";
import CTF from "./pages/CTF";
import InstantAvatarStack from "./components/Avatars";

function App() {
  return (
    <div className="min-h-screen relative">
      <Routes>
        <Route path="/" element={<Youtube />} />
        <Route path="/people" element={<People />} />
        <Route path="/papers" element={<Papers />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/ctf" element={<CTF />} />
        <Route path="/:slug" element={<BlogPage />} />
      </Routes>
      <div className="fixed bottom-4 right-4 z-50">
        <InstantAvatarStack />
      </div>
    </div>
  );
}

export default App;
