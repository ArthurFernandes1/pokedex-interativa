import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PokemonPage from "./pages/PokemonPage.jsx";
import PokedexPage from "./pages/PokedexPage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/pokemon/:name", element: <PokemonPage /> },
  { path: "/pokedex", element: <PokedexPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
<Route path="/pokemon/:name" element={<PokemonPage />} />
