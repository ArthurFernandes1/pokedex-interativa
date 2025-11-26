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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="p-6">

      {/* HEADER FIXO */}
      <div className="fixed top-0 left-0 w-full bg-white py-4 px-4 shadow-lg z-50 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">

        {/* Título */}
        <h1 className="text-3xl sm:text-4xl pokemon-title text-center text-red-600">
          Pokédex Completa
        </h1>

        {/* Botão Voltar */}
        <Link
          to="/"
          className="
            bg-red-600 text-white px-3 py-2 rounded-lg shadow hover:bg-red-700
            self-center            /* CENTRALIZADO NO CELULAR */
            sm:self-auto           /* DESATIVA NO DESKTOP */
            sm:absolute sm:left-4  /* ESQUERDA NO DESKTOP */
          "
        >
          Voltar
        </Link>

      </div>

      {/* Espaço abaixo do header */}
      <div className="mt-32"></div>

      {/* Listagem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemonList.map((p) => (
          <PokemonCard pokemon={p} key={p.id} />
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center gap-6 mt-6 mb-6">
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
