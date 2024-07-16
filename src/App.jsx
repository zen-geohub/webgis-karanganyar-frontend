import "./sass/style.scss";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Application from "./pages/Application";
import { DataContext } from "./contexts/DataContext";

function App() {
  return (
    <DataContext>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/application" element={<Application />} />
        </Routes>
      </HashRouter>
    </DataContext>
  );
}

export default App;
