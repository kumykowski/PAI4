import { useState, useEffect } from "react";

export const FavouritesPage = () => {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favouriteLocations");
    if (stored) setFavourites(JSON.parse(stored));
  }, []);

  const removeFavourite = (city: string) => {
    const updated = favourites.filter((item) => item !== city);
    setFavourites(updated);
    localStorage.setItem("favouriteLocations", JSON.stringify(updated));
  };

  return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-800 text-white">
          <h1 className="text-3xl font-bold mb-4">Ulubione Lokalizacje</h1>
      <ul>
        {favourites.map((city) => (
          <li key={city} className="mb-2">
            {city}{" "}
            <button onClick={() => removeFavourite(city)}>
              Usuń z ulubionych
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};