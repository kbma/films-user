import React, { useState } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Suggestion from './Suggestion';



function RegistrationLoginForm() {
  const [registrationData, setRegistrationData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [username, setUsername] = useState('');
  const [userId, setuserId] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // Ajout de l'état de connexion

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
      });

      if (response.ok) {
        setLoggedIn(true); // Mettre à jour l'état de connexion à true
        

        const responseText = await response.text();

        // Utilisez une expression régulière pour extraire le token du texte
        const tokenMatch = responseText.match(/"token":"([^"]+)"/);
        
        // Vérifiez si une correspondance a été trouvée
        if (tokenMatch && tokenMatch.length > 1) {
          const token = tokenMatch[1]; // Le groupe de capture 1 contient la valeur du token
          
          setuserId(token);
        } 
        










      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la connexion :', errorData.error);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleRegistrationSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (response.ok) {
        console.log('Inscription réussie !');
        setRegistrationData({ username: '', email: '', password: '' });
      } else {
        console.error('Erreur lors de l\'inscription :', response.statusText);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error.message);
    }
  };

  // Si l'utilisateur est connecté, afficher le tableau de bord
  if (loggedIn) {
    return <Dashboard username={username}  userId={userId}/>;
  }

  // Sinon, afficher le formulaire de connexion et d'inscription
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex w-full max-w-xl">
        <div className="w-1/2 bg-white p-8">
          <h2 className="text-2xl font-bold mb-4">Connexion</h2>
          <form onSubmit={handleLoginSubmit}>
            {/* Formulaire de connexion */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usernameLogin">
                Nom d'utilisateur
              </label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} name='username' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="usernameLogin" type="text" placeholder="Nom d'utilisateur" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordLogin">
                Mot de passe
              </label>
              <input value={password}  onChange={(e) => setPassword(e.target.value)}  name='password' className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="passwordLogin" type="password" placeholder="******************" />
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Connexion
            </button>

          </form>
        </div>

        <div className="w-1/2 bg-white p-8">
          <h2 className="text-2xl font-bold mb-4">Inscription</h2>
          <form onSubmit={handleRegistrationSubmit}>
            {/* Formulaire d'inscription */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="usernameRegister">
                Nom d'utilisateur
              </label>
              <input onChange={handleInputChange} name='username' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="usernameRegister" type="text" placeholder="Nom d'utilisateur" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailRegister">
                Email
              </label>
              <input onChange={handleInputChange} name='email' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="emailRegister" type="email" placeholder="Email" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordRegister">
                Mot de passe
              </label>
              <input onChange={handleInputChange} name='password' className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="passwordRegister" type="password" placeholder="******************" />
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleRegistrationSubmit}>
              Inscription
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  return <RegistrationLoginForm />;
}

export default App;
