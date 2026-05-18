import "bootstrap/dist/css/bootstrap.min.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

/* <=== REACT ROOT SETUP ===> */

/*
 * main.jsx is the React entry point.
 * It mounts the app inside the root div from index.html.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*
      BrowserRouter allows React Router to manage client-side routes.
      This task only uses one route, but keeping routing in place keeps the structure clean.
    */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
