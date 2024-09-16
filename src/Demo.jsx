import React, { useState,useRef} from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style/style.css'; // Assurez-vous d'inclure le fichier CSS
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import red_marker from './images/icons/red_marker.png'
// Définir une icône par défaut pour les marqueurs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Exemple de données d'objets avec latitude, longitude, et nom
const data = [
  { id: 1, name: 'Lieu 1', lat: 48.8566, lng: 2.3522 },  // Paris
  { id: 2, name: 'Lieu 2', lat: 51.5074, lng: -0.1278 },  // Londres
  { id: 3, name: 'Lieu 3', lat: 40.7128, lng: -74.0060 }, // New York
  { id: 4, name: 'Lieu 4', lat: 34.0522, lng: -118.2437 },// Los Angeles
];

const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="cluster-icon">${count}</div>`,
    className: 'custom-cluster',  // Classe CSS pour personnaliser le style
    iconSize: L.point(40, 40, true),  // Taille du cluster
  });
};

const MapWithMarkers = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [activeMarkerId, setActiveMarkerId] = useState(null);
  const markerRefs = useRef({})
  // Créer une icône personnalisée pour le marqueur
  const getIcon = (id) => {
    return L.divIcon({
      className: ``,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      html: `<img src="${id === activeMarkerId ? "blue_marker" : red_marker}" />`, // URL des images
    });
  };

  // Fonction appelée lors du clic sur un marqueur
  const handleMarkerClick = (location) => {
	setSelectedMarker(location);
	setActiveMarkerId(location.id);
  };
  

  return (
    <div style={{ display: 'flex' }}>
      {/* Carte */}
      <div style={{ width: '75%', height: '100vh' }}>
        <MapContainer center={[48.8566, 2.3522]} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
            {data.map((location) => (
              <Marker
                key={location.id}
                icon={getIcon(location.id)}
                position={[location.lat, location.lng]}
                eventHandlers={{
                  click: () => handleMarkerClick(location),  // Appeler handleMarkerClick lors du clic
                }}
              >
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      {/* Popup personnalisée */}
      {selectedMarker && (
        <div style={{
          width: '25%',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderLeft: '1px solid #ccc',
          height: '100vh',
          overflowY: 'auto',
          position: 'relative'
        }}>
          <h2>{selectedMarker.name}</h2>
          <p><strong>Latitude:</strong> {selectedMarker.lat}</p>
          <p><strong>Longitude:</strong> {selectedMarker.lng}</p>
          <button onClick={() => setSelectedMarker(null)}>Fermer</button>
        </div>
      )}
    </div>
  );
};

export default MapWithMarkers;
