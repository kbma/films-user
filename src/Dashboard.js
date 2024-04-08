import React, { useState, useEffect } from 'react';

function Dashboard({ username ,userId}) {
  const [moviesData, setMoviesData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);
  const [toWatch, setToWatch] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeMenu, setActiveMenu] = useState('all');
  const [subscriptions, setSubscriptions] = useState({});
  const toggleFavorite = async (movieId,ID) => {
    try {
      const response = await fetch(`http://localhost:3000/abonnement/${userId}/${ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favori: !favorites.includes(movieId) })
      });
  
      if (response.ok) {
        setFavorites(prevFavorites => {
          if (prevFavorites.includes(movieId)) {
            return prevFavorites.filter(id => id !== movieId);
          } else {
            return [...prevFavorites, movieId];
          }
        });
      } else {
        console.error('Erreur lors de la requête :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error.message);
    }
  };
  

  const toggleWatched = (movieId) => {
    if (watched.includes(movieId)) {
      setWatched(watched.filter(id => id !== movieId));
    } else {
      setWatched([...watched, movieId]);
    }
  };

  const toggleToWatch = (movieId) => {
    if (toWatch.includes(movieId)) {
      setToWatch(toWatch.filter(id => id !== movieId));
    } else {
      setToWatch([...toWatch, movieId]);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`http://localhost:3000/films?page=${currentPage}`);
        if (response.ok) {
          const { data, totalPages } = await response.json();
          setMoviesData(data);
          setTotalPages(totalPages);
        } else {
          console.error('Erreur lors de la récupération des films :', response.statusText);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des films :', error.message);
      }
    };
    fetchMovies();
  }, [currentPage]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <div className="container mx-auto p-4 mt-4 h-screen">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Bienvenue {username} {userId} </h1>
        <img src="https://filmoflix.to/templates/filmoflix-cc/images/logo-filmoflix.png" alt="Logo" className="h-10 w-auto" />
      </header>

      <nav className="flex mb-4">
        <button className={`mr-4 ${activeMenu === 'all' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('all')}>Tous</button>
        <button className={`mr-4 ${activeMenu === 'favorites' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('favorites')}>Favoris</button>
        <button className={`mr-4 ${activeMenu === 'watched' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('watched')}>Vus</button>
        <button className={`mr-4 ${activeMenu === 'toWatch' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('toWatch')}>À voir</button>
      </nav>
      
      <p className="text-gray-500">Date : {new Date().toLocaleDateString()}</p>
      
      <p className="text-lg">Message de bienvenue </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {moviesData.length > 0 ? (
          moviesData.map(movie => (
            <div key={movie.id} className="border rounded overflow-hidden shadow-md">
              <img src='https://image.tmdb.org/t/p/w300_and_h450_bestv2/oEyIhY1WzoFHUDE7U3p1AWwyoSN.jpg' alt={movie.titre} className="w-full h-64 object-cover" />
              <div className="p-4">
              {movie._id}
                <h2 className="text-xl font-semibold mb-2">{movie.titre}</h2>
                <p className="text-gray-700 mb-2">Année de production: {movie.annéeProduction}</p>
                <p className="text-gray-700 mb-2">Durée: {movie.durée}</p>
                <p className="text-gray-700 mb-2">Genre: {movie.genre}</p>
                <p className="text-gray-700 mb-2">Nationalité: {movie.nationalité}</p>
                <p className="text-gray-700 mb-2">Réalisateurs: {movie.réalisateurs}</p>
                <p className="text-gray-700 mb-2">Synopsis: {movie.synopsis}</p>
                <button
                onClick={() => toggleFavorite(movie.id, movie._id)}
                className={`py-2 px-4 rounded ${
                  subscriptions[movie._id]?.favori ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-800'
                }`}
              >
                {subscriptions[movie._id]?.favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
                <button
                  onClick={() => toggleWatched(movie.id)}
                  className={`py-2 px-4 rounded ${
                    watched.includes(movie.id) ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  {watched.includes(movie.id) ? 'Marquer comme non vu' : 'Marquer comme vu'}
                </button>
                <button
                  onClick={() => toggleToWatch(movie.id)}
                  className={`py-2 px-4 rounded ${
                    toWatch.includes(movie.id) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  {toWatch.includes(movie.id) ? 'Retirer de la liste à voir' : 'Ajouter à la liste à voir'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun film trouvé.</p>
        )}
      </div>
      
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages || 1 }, (_, index) => index + 1).map(page => (
          <button
            key={page}
            className={`mx-1 px-3 py-1 rounded ${
              page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
