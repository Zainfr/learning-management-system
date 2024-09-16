import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "primereact/resources/themes/saga-blue/theme.css"; // Or any theme you like
import "primereact/resources/primereact.min.css"; // Core PrimeReact styles

import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);
