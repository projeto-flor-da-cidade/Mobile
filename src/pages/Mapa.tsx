import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonSelect, IonSelectOption, IonButton, IonToast, IonCheckbox, IonText, IonAlert, IonModal, IonGrid, IonRow, IonCol 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L, { LatLngExpression, Map as LeafletMap } from 'leaflet';

const DefaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const getCoordinates = async (logradouro: string): Promise<{ lat: number, lon: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(logradouro)}&format=json`
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
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  // Estados para Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState(false);

  // Ref para o mapa principal e o mapa em tela cheia
  const mapRef = useRef<LeafletMap | null>(null);
  const fullScreenMapRef = useRef<LeafletMap | null>(null);

  const fetchEquipments = async () => {
    try {
      const response = await fetch('http://localhost:8081/equipamento');
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
    const foundEquipment = equipments.find(
      e => e.nome.toLowerCase() === searchQuery.toLowerCase()
    );
    if (foundEquipment && foundEquipment.coordinates) {
      setSelectedEquipment(foundEquipment);
      mapRef.current?.flyTo(
        [foundEquipment.coordinates.lat, foundEquipment.coordinates.lon],
        15
      );
    } else {
      setAlertMessage('Nome inválido ou equipamento não existe.');
    }
  };

  // Centraliza o mapa em tela cheia no equipamento selecionado, se houver
  const fullScreenCenter: LatLngExpression = selectedEquipment && selectedEquipment.coordinates
    ? [selectedEquipment.coordinates.lat, selectedEquipment.coordinates.lon]
    : initialPosition;

  // Forçar o Leaflet a recalcular o tamanho do mapa ao abrir o modal
  const handleModalDidPresent = () => {
    setTimeout(() => {
      fullScreenMapRef.current?.invalidateSize();
    }, 200);
  };

  const markers = useMemo(() => {
    return equipments
      .filter(equipment => equipment.coordinates)
      .map((equipment, index) => (
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
            {equipment.horario_abertura ? `Aberto até ${equipment.horario_abertura}` : ''}
            <br />
            {equipment.horario_fechamento ? `Fechado às ${equipment.horario_fechamento}` : ''}
            <br />
            <IonButton size="small" onClick={() => openInGoogleMaps(equipment.coordinates.lat, equipment.coordinates.lon)}>
              Ver no Google Maps
            </IonButton>
          </Popup>
        </Marker>
      ));
  }, [equipments]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': '#316cae' }}>
        <IonGrid className="content-container">
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

          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8">
              <IonItem>
                <IonLabel>Procurar feiras e hortas próximas</IonLabel>
                <IonSelect
                  placeholder="Selecione um equipamento"
                  value={selectedEquipment}
                  onIonChange={(e) => setSelectedEquipment(e.detail.value)}
                >
                  {equipments.map((equipment, index) =>
                    equipment.coordinates ? (
                      <IonSelectOption key={index} value={equipment}>
                        {equipment.nome}
                      </IonSelectOption>
                    ) : null
                  )}
                </IonSelect>
              </IonItem>
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

          {/* Mapa principal (pequeno) */}
<IonRow className="ion-justify-content-center">
  <IonCol size="300" sizeMd="8">
    <div className="map-container" style={{ margin: '0 auto' }}>
      <MapContainer
        center={initialPosition}
        zoom={10}
        style={{ height: '300px', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {markers}
      </MapContainer>
    </div>
  </IonCol>
</IonRow>


          {/* Botões */}
          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" className="ion-text-center">
              <IonButton
                expand="block"
                className="botao-personalizado"
                onClick={() => setShowFullScreenMap(true)}
              >
                Expandir Mapa
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center ion-margin-top">
            <IonCol size="12" sizeMd="8" className="ion-text-center">
              <IonButton
                expand="block"
                className="botao-personalizado"
                onClick={() => history.push('/cadastroequipamento')}
              >
                Cadastre sua Feira Agroecológica
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Modal para mapa em tela cheia */}
        <IonModal 
          isOpen={showFullScreenMap} 
          onDidPresent={handleModalDidPresent}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Mapa - Tela Cheia</IonTitle>
              <IonButton slot="end" onClick={() => setShowFullScreenMap(false)}>
                Fechar
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <MapContainer
              center={fullScreenCenter}
              zoom={13}
              style={{ height: '100vh', width: '100%' }}
              ref={fullScreenMapRef}
            >
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {markers}
            </MapContainer>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={!!alertMessage}
          onDidDismiss={() => setAlertMessage('')}
          header="Erro"
          message={alertMessage}
          buttons={['OK']}
        />

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={1500}
          color={toastColor}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Mapa;
