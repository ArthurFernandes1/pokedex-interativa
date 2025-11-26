import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom";
import { getPokemonPage } from "../api/pokeapi";
import { PokemonCard } from "../components/PokemonCard";

export default function PokedexPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 30;

  useEffect(() => {
    async function load() {
      const data = await getPokemonPage(limit, page * limit);
      setPokemonList(data);
    }
    load();

    // 🔥 Move para o topo sempre que a página mudar
    window.scrollTo({ top: 0, behavior: "smooth" });

  }, [page]);

  return (
    <div className="p-6">

      {/* Voltar */}
      <Link
        to="/"
        className="fixed top-4 left-4 bg-red-600 text-white px-3 py-2 rounded-lg shadow hover:bg-red-700 z-50"
      >
        Voltar para o Início
      </Link>

      <h1 className="text-4xl pokemon-title text-center mb-6 text-red-600">
        Pokédex Completa
      </h1>

      {/* Listagem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemonList.map((p) => (
          <PokemonCard pokemon={p} key={p.id} />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50"
          disabled={page === 0}
        >
          Anterior
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
