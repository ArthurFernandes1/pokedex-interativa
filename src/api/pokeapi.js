import axios from "axios";

const API_BASE = "https://pokeapi.co/api/v2";

export const api = axios.create({
  baseURL: API_BASE,
});

// Lista de Pokémon (com limite e paginação)
export async function getPokemonList(limit = 20, offset = 0) {
  const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
}

// Detalhes de um Pokémon específico
export async function getPokemon(nameOrId) {
  const response = await api.get(`/pokemon/${nameOrId}`);
  return response.data;
}

// Nova função para pegar Pokémon com offset (paginação)
export async function getPokemonPage(limit = 30, offset = 0) {
  const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  const results = response.data.results;

  // Buscar dados completos de cada Pokémon
  const pokemonData = await Promise.all(
    results.map(async (p) => {
      const details = await api.get(p.url);
      return details.data;
    })
  );

  return pokemonData;
}

