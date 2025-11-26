import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getPokemon } from "../api/pokeapi";

/**
 * PokemonPage.jsx
 * - animated gradient background by type
 * - neon border by type
 * - parallax effect on pokemon image (mouse move / touch)
 * - smooth transition when switching pokemon
 *
 * Requirements: Tailwind is used for base styling. Additional styles (keyframes)
 * are included inline in the component.
 */

export default function PokemonPage() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [visible, setVisible] = useState(true); // for fade transition
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const rafRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const transformRef = useRef({ tx: 0, ty: 0 });

  // Load pokemon
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getPokemon(name);
        if (!mounted) return;
        // trigger fade-out then fade-in
        setVisible(false);
        setTimeout(() => {
          setPokemon(data);
          setVisible(true);
        }, 180); // small gap to allow fade out
      } catch {
        if (mounted) setPokemon(null);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [name]);

  // Parallax animation loop
  useEffect(() => {
    function loop() {
      // lerp toward target
      const target = mousePosRef.current;
      transformRef.current.tx += (target.x - transformRef.current.tx) * 0.12;
      transformRef.current.ty += (target.y - transformRef.current.ty) * 0.12;

      if (imgRef.current) {
        const tx = transformRef.current.tx;
        const ty = transformRef.current.ty;
        imgRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04) rotate(${tx * 0.02}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // mouse / touch handlers to update target transform
  function handlePointerMove(e) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !imgRef.current) return;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // small movement range
    const dx = (clientX - cx) / rect.width; // -0.5 -> 0.5
    const dy = (clientY - cy) / rect.height;

    const max = 14; // px
    mousePosRef.current.x = dx * max;
    mousePosRef.current.y = dy * max * 0.7;
  }

  function handlePointerLeave() {
    mousePosRef.current.x = 0;
    mousePosRef.current.y = 0;
  }

  if (!pokemon) {
    return <div className="text-center text-xl mt-20">Carregando Pokémon...</div>;
  }

  // main type & styling helpers
  const mainType = pokemon.types[0].type.name;
  const gradient = getTypeGradient(mainType);
  const neon = getTypeNeonColor(mainType);

  return (
    <div
  className="min-h-screen p-6 transition-all duration-700"
  style={{
    "--type-gradient": gradient,
  }}
>

      {/* embed required keyframes + helper classes */}
      <style>{`
        /* moving gradient animation */
        .type-gradient {
          background: linear-gradient(var(--type-gradient));
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* subtle glowing neon border */
        .neon-border {
          box-shadow: 0 0 18px 2px ${neon}, inset 0 0 18px 1px ${neon}66;
          border: 1px solid ${neon}bb;
        }

        /* smooth fade for card content */
        .fade-transition {
          transition: opacity 280ms ease, transform 280ms ease;
        }
      `}</style>

      {/* full-screen animated background */}
      <div className="type-gradient fixed inset-0 -z-10 opacity-100" />

      {/* overlay to darken/smooth */}
      <div className="min-h-screen p-6">
        <Link
          to="/"
          className="fixed top-4 left-4 bg-red-600 text-white px-3 py-2 rounded-lg shadow hover:bg-red-700 z-30"
        >
          Início
        </Link>

        <div
          ref={containerRef}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          onTouchEnd={handlePointerLeave}
          className="max-w-xl mx-auto relative z-20"
        >
          <div
            // card with neon border and backdrop blur. fade on pokemon change.
            className={`backdrop-blur-md bg-white/75 rounded-xl p-6 shadow-2xl neon-border fade-transition`}
            style={{
              // neon color glow uses inline boxShadow fallback for older browsers
              boxShadow: `0 10px 30px -10px ${neon}55, inset 0 0 18px 1px ${neon}33`,
              border: `1px solid ${neon}aa`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0px)" : "translateY(6px)",
            }}
          >
            <h1 className="text-3xl font-bold capitalize text-center mb-4">
              {pokemon.name} #{pokemon.id}
            </h1>

            {/* Pokémon image with parallax ref and smooth transition when pokemon changes */}
            <div className="w-full flex justify-center mb-6">
              <img
                key={pokemon.id} // forces reflow when pokemon changes for smoother transition
                ref={imgRef}
                src={
                  pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                  pokemon.sprites?.front_default ||
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"
                }
                alt={pokemon.name}
                className="w-64 h-64 object-contain drop-shadow-2xl transition-transform duration-300"
                style={{
                  willChange: "transform",
                  transition: "transform 260ms cubic-bezier(.2,.9,.3,1)",
                }}
                onLoad={() => {
                  // small bounce when image loads
                  if (imgRef.current) {
                    imgRef.current.style.transform += " scale(1.04)";
                    setTimeout(() => {
                      if (imgRef.current) {
                        imgRef.current.style.transform = imgRef.current.style.transform.replace(" scale(1.04)"," scale(1.04)");
                      }
                    }, 150);
                  }
                }}
              />
            </div>

            {/* types */}
            <div className="text-center mb-4">
              <span className="font-bold">Tipos: </span>
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="px-3 py-1 mx-1 rounded-full text-white capitalize"
                  style={{
                    backgroundColor: getTypeColor(t.type.name),
                    boxShadow: `0 6px 18px -6px ${getTypeNeonColor(t.type.name)}88`,
                    border: `1px solid ${getTypeNeonColor(t.type.name)}cc`,
                  }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            {/* info */}
            <div className="flex justify-around text-lg">
              <p><b>Altura:</b> {pokemon.height / 10} m</p>
              <p><b>Peso:</b> {pokemon.weight / 10} kg</p>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-2">Status Base</h2>
            <ul>
              {pokemon.stats.map((s) => (
                <li key={s.stat.name} className="capitalize">
                  <b>{s.stat.name}:</b> {s.base_stat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------- Helpers ------------- */

function getTypeColor(type) {
  const colors = {
    grass: "#48D0B0",
    fire: "#FB6C6C",
    water: "#76BEFE",
    bug: "#A8B820",
    normal: "#A8A77A",
    poison: "#A040A0",
    electric: "#F8D030",
    ground: "#E0C068",
    fairy: "#EE99AC",
    fighting: "#C22E28",
    psychic: "#F95587",
    rock: "#B6A136",
    ghost: "#735797",
    ice: "#96D9D6",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    flying: "#A98FF3",
  };
  return colors[type] || "#666";
}

function getTypeNeonColor(type) {
  // brighter/neon-ish color for glow and border
  const neon = {
    grass: "#2DD4BF",
    fire: "#ff6b6b",
    water: "#3db4ff",
    bug: "#a3e635",
    electric: "#ffd54a",
    ground: "#e9c46a",
    rock: "#f0c987",
    ice: "#7ee8fa",
    dragon: "#b084ff",
    ghost: "#9f7aea",
    psychic: "#ff6fb4",
    dark: "#9ca3af",
    steel: "#cbd5e1",
    fairy: "#ff9ad6",
    poison: "#c084fc",
    normal: "#d1d5db",
    fighting: "#ff7a5a",
    flying: "#93c5fd",
  };
  return neon[type] || "#aaaaaa";
}

function getTypeGradient(type) {
  // return a gradient string that will be applied to CSS var --type-gradient
  const g = {
    grass: "#bbf7d0, #34d399, #059669",
    fire: "#fed7d7, #fb7185, #ef4444",
    water: "#bfdbfe, #60a5fa, #2563eb",
    electric: "#fff7cc, #fde047, #f59e0b",
    ground: "#fff1cc, #f6d365, #fda085",
    rock: "#f1f5f9, #c7d2fe, #94a3b8",
    bug: "#ecfccb, #a3e635, #65a30d",
    ice: "#e6fffa, #67e8f9, #0ea5e9",
    dragon: "#f3e8ff, #c084fc, #7c3aed",
    ghost: "#f3e8ff, #c7b3ff, #8b5cf6",
    psychic: "#fff0f6, #fbcfe8, #fb7185",
    dark: "#e2e8f0, #94a3b8, #0f172a",
    steel: "#f8fafc, #cbd5e1, #94a3b8",
    fairy: "#fff1f2, #ffd6e0, #fb7185",
    poison: "#fbebff, #e9d5ff, #c084fc",
    normal: "#f8fafc, #e6e7e8, #cfd3d6",
    flying: "#eff6ff, #bfdbfe, #60a5fa",
    fighting: "#fff7ed, #ffedd5, #fb923c",
  };
  const colors = g[type] || g.normal;
  // we return a CSS list of colors suitable for linear-gradient(var(--type-gradient))
  // the caller sets --type-gradient to e.g. "#a, #b, #c"
  return colors;
}
