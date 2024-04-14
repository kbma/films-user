import React, { useState, useEffect } from 'react';

function FavoriteMovies({ userId }) {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const response = await fetch(`http://localhost:3000/favorite-movies/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFavoriteMovies(data.favoriteMovies);
        } else {
          console.error('Erreur lors de la récupération des films favoris :', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des films favoris :', error.message);
      }
    };

    fetchFavoriteMovies();
  }, [userId]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Films Favoris</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map(movie => (
            <div key={movie.id} className="border rounded overflow-hidden shadow-md">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{movie.title}</h2>
                {/* Afficher d'autres détails du film si nécessaire */}
              </div>
            </div>
          ))
        ) : (
          <p>Aucun film favori trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default FavoriteMovies;
