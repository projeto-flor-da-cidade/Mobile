import React, { useState } from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption,} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet-routing-machine';



const DefaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Mapa: React.FC = () => {
  const history = useHistory();
  const initialPosition: LatLngExpression = [-8.0476, -34.8770]; // Recife
  const mapRef = React.useRef<L.Map | null>(null);

  // Dados dos marcadores
  const markers = [
    { name: 'Feira Agroecológica 1', position: [-8.0488, -34.8762] as L.LatLngTuple },
    { name: 'Feira Agroecológica 2', position: [-8.0512, -34.8756] as L.LatLngTuple },
    { name: 'Espaço Agroecológico', position: [-8.0455, -34.8798] as L.LatLngTuple },
    { name: 'Feira de Orgânicos Ceasa', position: [-8.0541, -34.8813] as L.LatLngTuple },
  ];

  // Estado para o destino selecionado
  const [selectedDestination, setSelectedDestination] = useState<LatLngExpression | null>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes" style={{ '--background': '#316cae' }}>
        <div className="content-container">
          <div className="button-group">
            <IonSelect
              placeholder="Escolha um destino"
              onIonChange={(e) => setSelectedDestination(e.detail.value)}
            >
              {markers.map((marker, index) => (
                <IonSelectOption key={index} value={marker.position}>
                  {marker.name}
                </IonSelectOption>
              ))}
            </IonSelect>

            <IonButton
              expand="block"
              className="botao-personalizado"
              onClick={() => {
                if (mapRef.current && selectedDestination) {
                  const routingControl = L.Routing.control({
                    waypoints: [
                      L.latLng(initialPosition),
                      L.latLng(selectedDestination),
                    ],
                    routeWhileDragging: true,
                  }).addTo(mapRef.current);

                  // Remover rota após 10 segundos (opcional)
                  setTimeout(() => routingControl.remove(), 10000);
                } else {
                  console.error("Mapa não inicializado ou destino não selecionado.");
                }
              }}
              disabled={!selectedDestination}
            >
              Rotas
            </IonButton>

            <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/cadastrofeira')} >
              Cadastre sua Feira Agroecológica
            </IonButton>
          </div>

          <div className="map-container">
            <MapContainer
              center={initialPosition}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {markers.map((marker, index) => (
                <Marker key={index} position={marker.position} icon={DefaultIcon}>
                  <Popup>{marker.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="voltar-button">
            <IonButton
              expand="block"
              className="botao-personalizado"
              onClick={() => history.goBack()}
            >
              Voltar
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Mapa;

