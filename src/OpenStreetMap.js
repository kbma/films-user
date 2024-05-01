import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function OpenStreetMap() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Utilisation de l'API de géolocalisation du navigateur pour obtenir la position actuelle
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []); // Le tableau vide [] signifie que useEffect ne s'exécute qu'une seule fois après le premier rendu

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ height: '100px', width: '90%' }}>
      {position && (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Utilisation de CircleMarker pour afficher un marqueur sous forme de cercle */}
          <CircleMarker center={position} radius={8} color="red" fillOpacity={0.5}>
            <Popup>
              Your current location. <br /> Latitude: {position[0]}, Longitude: {position[1]}
            </Popup>
          </CircleMarker>
        </MapContainer>
      )}
    </div>
  );
}

export default OpenStreetMap;
