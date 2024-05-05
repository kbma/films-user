// OpenStreetMap.js

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function OpenStreetMap({ setCountry }) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            setCountry(data.address.country); // Passer la valeur de country au parent
          });
      },
      (err) => {
        setError(err.message);
      }
    );
  }, [setCountry]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ height: '100px', width: '100%' }}>
      {position && (
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '80%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CircleMarker center={position} radius={8} color="red" fillOpacity={0.5}>
            <Popup>
              Your current location. <br /> Latitude: {position[0]}, Longitude: {position[1]} <br /> 
            </Popup>
          </CircleMarker>
        </MapContainer>
      )}
    </div>
  );
}

export default OpenStreetMap;
