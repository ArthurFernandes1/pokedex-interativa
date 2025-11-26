import { Link } from "react-router-dom";

// 🎨 Mapa de cores por tipo
const typeColors = {
  fire: "from-orange-500 via-red-500 to-yellow-400",
  water: "from-blue-500 via-cyan-500 to-blue-300",
  grass: "from-green-500 via-lime-500 to-emerald-400",
  electric: "from-yellow-400 via-amber-300 to-orange-300",
  psychic: "from-pink-500 via-fuchsia-500 to-pink-400",
  ice: "from-cyan-300 via-blue-200 to-cyan-100",
  dragon: "from-purple-700 via-indigo-600 to-blue-500",
  dark: "from-gray-800 via-gray-700 to-gray-600",
  fairy: "from-pink-300 via-rose-300 to-pink-200",
  normal: "from-gray-300 via-gray-200 to-gray-100",
  fighting: "from-red-700 via-orange-700 to-yellow-600",
  flying: "from-indigo-300 via-sky-300 to-purple-300",
  poison: "from-purple-600 via-fuchsia-600 to-purple-400",
  ground: "from-yellow-700 via-amber-600 to-orange-500",
  rock: "from-yellow-800 via-stone-700 to-stone-500",
  bug: "from-lime-500 via-green-500 to-lime-400",
  steel: "from-gray-400 via-gray-300 to-gray-200",
  ghost: "from-indigo-700 via-purple-700 to-indigo-600",
};

export function PokemonCard({ pokemon }) {
  const primaryType = pokemon.types?.[0]?.type?.name || "normal";
  const gradient = typeColors[primaryType] || typeColors.normal;

  const image = pokemon.sprites?.other?.["official-artwork"]?.front_default;

  return (
    <Link
      to={`/pokemon/${pokemon.name}`}
      className={`bg-gradient-to-br ${gradient} p-[2px] rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
      
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 flex flex-col items-center">

        {/* Imagem */}
        {image ? (
          <img
            src={image}
            alt={pokemon.name}
            className="w-80 h-28 object-contain drop-shadow-xl hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-28 h-28 flex items-center justify-center bg-gray-200 rounded-lg text-gray-500">Sem imagem</div>
        )}

        {/* Nome */}
        <h2 className="capitalize text-xl font-bold text-gray-800 mt-3">
          {pokemon.name}
        </h2>

        <p className="text-gray-600 text-sm mb-2">#{pokemon.id}</p>

        {/* Tipos */}
        <div className="flex gap-2 mb-3">
          {pokemon.types?.map((t) => (
            <span
              key={t.type.name}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/40 backdrop-blur border border-white/30 capitalize"
            >
              {t.type.name}
            </span>
          ))}
        </div>

        {/* Status (HP, ATK, DEF) */}
        <div className="w-full grid grid-cols-3 text-center">
          {pokemon.stats?.slice(0, 3).map((stat) => (
            <div key={stat.stat.name} className="p-2">
              <p className="text-gray-700 text-xs font-semibold uppercase tracking-wide">
                {stat.stat.name === "hp" && "HP"}
                {stat.stat.name === "attack" && "ATK"}
                {stat.stat.name === "defense" && "DEF"}
              </p>
              <p className="text-gray-900 font-bold">{stat.base_stat}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}