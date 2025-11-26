export function Footer() {
  return (
    <footer className="bg-red-600 text-white mt-10 py-6 px-4 flex flex-col items-center shadow-inner">
      {/* Pokébola girando */}
      <img
        src="https://img.pokemondb.net/sprites/items/poke-ball.png"
        className="w-10 h-10 sm:w-12 sm:h-12 animate-spin-slow mb-3"
      />

      {/* Título */}
      <p className="text-xl sm:text-5xl pokemon-title tracking-wide margin p-2">
        Pokédex Interativa
      </p>
      {/* Subtexto */}
      <p className="text-sm mt-1 opacity-80 text-center margin p-2">
        Dados fornecidos pela PokéAPI • Projeto criado para estudo
      </p>

      {/* Divider */}
      <div className="w-full max-w-md h-px bg-white/30 my-3"></div>

      {/* Créditos */}
      <p className="text-xs opacity-80 text-center">
        Desenvolvido por <span className="font-semibold">Arthur Fernandes</span>
      </p>
    </footer>
  );
}
