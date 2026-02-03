import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Predict from "./pages/Predict";
import RedditPredict from "./pages/predict/RedditPredict";


function App() {
  return (
    <div className="app-root">
      
      <Navbar />

      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/predict/:id" element={<Predict />} />
        <Route path="/predict/:id/reddit" element={<RedditPredict />} />
      </Routes>
    </div>
  );
}

export default App;
