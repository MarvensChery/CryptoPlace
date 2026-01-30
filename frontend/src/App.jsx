import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Predict from "./pages/Predict";


function App() {
  return (
    <div className="app-root">
      
      <Navbar />

      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/predict/:id" element={<Predict />} />
      </Routes>
    </div>
  );
}

export default App;
