import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ username, userId }) {
  const [moviesData, setMoviesData] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeMenu, setActiveMenu] = useState('all');

  const fetchSubscription = async (userId, movieId) => {
    try {
      const response = await fetch(`http://localhost:3000/abonnement/${userId}/${movieId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status === 404) {
        return null;
      } else {
        console.error('Erreur lors de la récupération des abonnements :', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements :', error.message);
      return null;
    }
  };

  const toggleSubscription = async (movieId, field) => {
    try {
      let currentSubscription = await fetchSubscription(userId, movieId);

      if (!currentSubscription) {
        const response = await fetch(`http://localhost:3000/abonnement/${userId}/${movieId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            filmId: movieId,
            favori: field === 'favori',
            vu: field === 'vu',
            aVoir: field === 'aVoir'
          })
        });

        if (response.ok) {
          currentSubscription = await fetchSubscription(userId, movieId);
        } else {
          console.error('Erreur lors de la création de l\'abonnement :', response.statusText);
          return;
        }
      } else {
        setSubscriptions(prevSubscriptions => ({
          ...prevSubscriptions,
          [movieId]: { ...prevSubscriptions[movieId], [field]: !prevSubscriptions[movieId]?.[field] }
        }));
      }

      const { favori, vu, aVoir } = currentSubscription;

      const response = await fetch(`http://localhost:3000/abonnement/${userId}/${movieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          favori,
          vu,
          aVoir,
          [field]: !currentSubscription[field]
        })
      });

      if (!response.ok) {
        console.error('Erreur lors de la requête :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error.message);
    }
  };

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

  const fetchSubscriptions = async () => {
    try {
      const subscriptionsData = {};
      for (const movie of moviesData) {
        const subscription = await fetchSubscription(userId, movie._id);
        if (subscription !== null) {
          const [isFavorite, isWatched, isToWatch] = await Promise.all([
            fetchSubscriptionField(userId, movie._id, 'favori'),
            fetchSubscriptionField(userId, movie._id, 'vu'),
            fetchSubscriptionField(userId, movie._id, 'aVoir')
          ]);
          subscriptionsData[movie._id] = { favori: isFavorite, vu: isWatched, aVoir: isToWatch };
        }
      }
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des abonnements :', error.message);
    }
  };

  const fetchSubscriptionField = async (userId, movieId, field) => {
    const subscription = await fetchSubscription(userId, movieId);
    return subscription?.[field] || false;
  };

  useEffect(() => {
    fetchMovies();
  }, [currentPage]);

  useEffect(() => {
    fetchSubscriptions();
  }, [moviesData, userId]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
  };

  const toggleFavorite = (movieId) => toggleSubscription(movieId, 'favori');
  const toggleWatched = (movieId) => toggleSubscription(movieId, 'vu');
  const toggleToWatch = (movieId) => toggleSubscription(movieId, 'aVoir');

  return (
    <div className="container mx-auto p-4 mt-4 h-screen">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Bienvenue <strong>{username} </strong></h1>
        <img src="https://filmoflix.to/templates/filmoflix-cc/images/logo-filmoflix.png" alt="Logo" className="h-10 w-auto" />
      </header>

      <nav className="flex mb-4">
        <button className={`mr-4 ${activeMenu === 'all' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('all')}>Tous</button>
        <button className={`mr-4 ${activeMenu === 'favorites' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('favorites')}>Favoris</button>
        <button className={`mr-4 ${activeMenu === 'watched' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('watched')}>Vus</button>
        <button className={`mr-4 ${activeMenu === 'toWatch' ? 'font-bold' : ''}`} onClick={() => handleMenuChange('toWatch')}>À voir</button>
        <Link to="/Suggestion">Suggestion</Link>
      </nav>

      <p className="text-gray-500">Date : {new Date().toLocaleDateString()}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {moviesData.length > 0 ? (
          moviesData.map(movie => (
            <div key={movie.id} className="border rounded overflow-hidden shadow-md">
              {movie.details ? (
                <img src={`https://image.tmdb.org/t/p/original/${movie.details.poster_path}`} alt={movie.details.title} className="w-full h-32 object-cover" />
              ) : (
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Pas_d%27image_disponible.svg/1024px-Pas_d%27image_disponible.svg.png" className="w-full h-32 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{movie.titre}</h2>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <p className="text-sm text-gray-700"><strong>Année:</strong> {movie.annéeProduction}</p>
                  <p className="text-sm text-gray-700"><strong>Durée:</strong> {movie.durée}</p>
                  <p className="text-sm text-gray-700"><strong>Genre:</strong> {movie.genre}</p>
                  {movie.details ? (
                    <>
                      <p className="text-sm text-gray-700"><strong>Population:</strong> {movie.details.popularity}</p>
                      <p className="text-sm text-gray-700"><strong>Nbre de Votes: </strong> {movie.details.vote_count}</p>
                      <div className="text-sm text-gray-700">
                        <strong>Vote étoile: </strong>
                        {Array.from({ length: movie.details.vote_average }, (_, index) => (
                          <span key={index}>★</span>
                        ))}
                      </div>
                    </>
                  ) : null}
                  <p className="text-sm text-gray-700"><strong>Nationalité:</strong> {movie.nationalité}</p>
                  <p className="text-sm text-gray-700"><strong>Réalisateurs:</strong> {movie.réalisateurs}</p>
                </div>
                <p className="text-sm text-gray-700 mb-2"><strong>Synopsis:</strong> {movie.synopsis}</p>
                <div className="flex justify-start space-x-2 mb-2">
                  <button
                    onClick={() => toggleFavorite(movie._id)}
                    className={`py-1 px-2 rounded text-xs ${subscriptions[movie._id]?.favori ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-800'
                      }`}
                  >
                    {subscriptions[movie._id]?.favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </button>
                  <button
                    onClick={() => toggleWatched(movie._id)}
                    className={`py-1 px-2 rounded text-xs ${subscriptions[movie._id]?.vu ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                      }`}
                  >
                    {subscriptions[movie._id]?.vu ? 'Marquer comme non vu' : 'Marquer comme vu'}
                  </button>
                  <button
                    onClick={() => toggleToWatch(movie._id)}
                    className={`py-1 px-2 rounded text-xs ${subscriptions[movie._id]?.aVoir ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                      }`}
                  >
                    {subscriptions[movie._id]?.aVoir ? 'Retirer de la liste à voir' : 'Ajouter à la liste à voir'}
                  </button>
                </div>
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
            className={`mx-1 px-3 py-1 rounded ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
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
