import React, { useState } from 'react';

const Suggestion = () => {
    const [movies, setMovies] = useState([]);
    const [nationality, setNationality] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);

    const handleNationalityChange = (event) => {
        setNationality(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/films`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des films');
            }
            const data = await response.json();
            const filtered = data.filter(movie => movie.nationality.toLowerCase() === nationality.toLowerCase());
            setFilteredMovies(filtered);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="nationalityInput">Entrez la nationalité : </label>
                <input type="text" id="nationalityInput" value={nationality} onChange={handleNationalityChange} />
                <button type="submit">Filtrer</button>
            </form>
            {filteredMovies.length > 0 &&
                <div>
                    <h2>Films de {nationality} :</h2>
                    <ul>
                        {filteredMovies.map(movie => (
                            <li key={movie.id}>{movie.title}</li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
};

export default Suggestion;
