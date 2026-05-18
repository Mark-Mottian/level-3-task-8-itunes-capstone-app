import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";

/* <=== APP ROUTING ===> */

function App() {
  return (
    <Routes>
      {/*
        The app only needs one page for this task.
        Search, results and favourites all live inside HomePage.
      */}
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
