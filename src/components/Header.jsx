import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="bg-red-600 text-white p-6 flex justify-center items-center">

      <h1 className="text-6xl pokemon-title arc-text">
  {"Pokédex".split("").map((letra, i) => (
    <span key={i}>{letra}</span>
  ))}
</h1>

    </header>
  );
}
