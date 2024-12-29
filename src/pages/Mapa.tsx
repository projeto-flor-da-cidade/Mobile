import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonAlert,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L, { LatLngExpression } from 'leaflet';

const DefaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getCoordinates = async (logradouro: string) => {
  const address = `${logradouro}`;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      throw new Error("Endereço não encontrado.");
    }
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    return null;
  }
};

const Mapa: React.FC = () => {
  const history = useHistory();
  const initialPosition: LatLngExpression = [-8.0476, -34.8770]; // Recife
  const [equipments, setEquipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const mapRef = React.useRef<L.Map | null>(null);

  const fetchEquipments = async () => {
    try {
      const response = await fetch('http://localhost:8081/equipamento'); // Substitua pela sua URL
      const data = await response.json();

      const equipmentsWithCoordinates = await Promise.all(
        data.map(async (equipment: any) => {
          const coordinates = await getCoordinates(equipment.logradouro);
          return { ...equipment, coordinates };
        })
      );

      setEquipments(equipmentsWithCoordinates);
    } catch (error) {
      console.error('Erro ao buscar equipamentos:', error);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const openInGoogleMaps = (lat: number, lon: number) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleSearch = () => {
    const foundEquipment = equipments.find(e => e.nome.toLowerCase() === searchQuery.toLowerCase());
    if (foundEquipment) {
      setSelectedEquipment(foundEquipment);
      mapRef.current?.flyTo(
        [foundEquipment.coordinates.lat, foundEquipment.coordinates.lon],
        15
      );
    } else {
      setAlertMessage('Nome inválido ou equipamento não existe.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': '#316cae' }}>
        <IonGrid>
          {/* Busca por nome */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8">
              <IonItem>
                <IonLabel position="floating">Buscar pelo nome</IonLabel>
                <IonInput
                  value={searchQuery}
                  onIonChange={(e) => setSearchQuery(e.detail.value!)}
                  placeholder="Digite o nome do equipamento"
                />
              </IonItem>
              <IonButton expand="block" className="botao-personalizado" onClick={handleSearch}>
                Buscar
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Listar equipamentos */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8">
              <IonSelect
                placeholder="Listar equipamentos"
                onIonChange={(e) => setSelectedEquipment(e.detail.value)}
              >
                {equipments.map((equipment, index) => (
                  equipment.coordinates && (
                    <IonSelectOption key={index} value={equipment}>
                      {equipment.nome}
                    </IonSelectOption>
                  )
                ))}
              </IonSelect>

              {selectedEquipment && (
                <IonButton
                  expand="block"
                  className="botao-personalizado"
                  onClick={() => openInGoogleMaps(selectedEquipment.coordinates.lat, selectedEquipment.coordinates.lon)}
                >
                  Ver Rota no Google Maps
                </IonButton>
              )}
            </IonCol>
          </IonRow>

          {/* Mapa */}
          <IonRow>
            <IonCol size="12">
              <div className="map-container">
                <MapContainer
                  center={initialPosition}
                  zoom={13}
                  style={{ height: '300px', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  {equipments.map((equipment, index) => (
                    equipment.coordinates && (
                      <Marker
                        key={index}
                        position={[equipment.coordinates.lat, equipment.coordinates.lon]}
                        icon={DefaultIcon}
                      >
                        <Popup>
                          <strong>{equipment.nome}</strong>
                          <br />
                          {equipment.logradouro}
                          <br />
                          Aberto até {equipment.horario}
                          <br />
                          <IonButton
                            size="small"
                            onClick={() => openInGoogleMaps(equipment.coordinates.lat, equipment.coordinates.lon)}
                          >
                            Ver no Google Maps
                          </IonButton>
                        </Popup>
                      </Marker>
                    )
                  ))}
                </MapContainer>
              </div>
            </IonCol>
          </IonRow>

          {/* Botão "Cadastre sua Feira Agroecológica" */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" className="ion-text-center">
              <IonButton
                expand="block"
                className="botao-personalizado"
                onClick={() => history.push('/cadastrofeira')}
              >
                Cadastre sua Feira Agroecológica
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Alerta de erro */}
        <IonAlert
          isOpen={!!alertMessage}
          onDidDismiss={() => setAlertMessage('')}
          header="Erro"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Mapa;
