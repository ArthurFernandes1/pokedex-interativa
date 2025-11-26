import { useState } from "react";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import { PokemonCard } from "./components/PokemonCard";
import { Footer } from "./components/Footer";
import { getPokemon } from "./api/pokeapi";

export default function App() {
  const [search, setSearch] = useState("");
  const [pokemon, setPokemon] = useState(null);

  const handleSearch = async () => {
    try {
      const data = await getPokemon(search.toLowerCase());
      setPokemon(data);
    } catch {
      setPokemon(null);
      alert("Pokémon não encontrado 😢");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Cabeçalho */}
      <Header />

      {/* Conteúdo principal */}
      <div className="flex-grow">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
        />

        {pokemon && (
          <div className="flex justify-center mt-6 mb-10">
            <PokemonCard pokemon={pokemon} />
          </div>
        )}
      </div>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
