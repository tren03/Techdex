import { Route, Routes } from "react-router-dom";
import Youtube from "./pages/Youtube";
import People from "./pages/People";
import Articles from "./pages/Articles";
import Papers from "./pages/Papers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Youtube />} />
      <Route path="/people" element={<People />} />
      <Route path="/papers" element={<Papers />} />
      <Route path="/articles" element={<Articles />} />
    </Routes>
  );
}

export default App;
