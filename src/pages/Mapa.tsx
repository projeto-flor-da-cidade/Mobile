import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonButton, IonToast, IonAlert, IonModal, IonGrid, IonRow, IonCol, IonList 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L, { LatLngExpression, Map as LeafletMap, LatLngBoundsExpression } from 'leaflet';

const DefaultIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Função para obter coordenadas via Nominatim
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

// Função para obter rota real via API OSRM
const fetchRoute = async (
  start: { lat: number, lon: number },
  end: { lat: number, lon: number }
): Promise<[number, number][]> => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      // Converte cada par [lon, lat] para [lat, lon]
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    } else {
      throw new Error("Rota não encontrada.");
    }
  } catch (error) {
    console.error("Erro ao buscar rota:", error);
    return [];
  }
};

const Mapa: React.FC = () => {
  const history = useHistory();
  const initialPosition: LatLngExpression = [-8.0476, -34.8770]; // Recife

  // Estados dos equipamentos e seleção
  const [equipments, setEquipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showEquipmentList, setShowEquipmentList] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  // Estados para sugestões do campo de busca principal
  const [showSuggestions, setShowSuggestions] = useState(true);
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return equipments.filter(e =>
      e.nome.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery, equipments]);

  // Estados para o modal de rota
  const [currentLocation, setCurrentLocation] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [filteredEquipments, setFilteredEquipments] = useState<any[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [selectedRouteEquipment, setSelectedRouteEquipment] = useState<any>(null);

  // Estados para Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState(false);

  // Refs para os mapas
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

  // Atualiza sugestões para o modal de rota conforme usuário digita no campo equipmentName
  useEffect(() => {
    if (equipmentName.trim()) {
      const filtered = equipments.filter(e =>
        e.nome.toLowerCase().includes(equipmentName.trim().toLowerCase())
      );
      setFilteredEquipments(filtered);
    } else {
      setFilteredEquipments([]);
    }
  }, [equipmentName, equipments]);

  const handleSelectSuggestion = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    const found = equipments.find(e => e.nome.toLowerCase() === name.toLowerCase());
    if (found && found.coordinates) {
      setSelectedEquipment(found);
      mapRef.current?.flyTo([found.coordinates.lat, found.coordinates.lon], 18);
    }
  };

  const openInGoogleMaps = (lat: number, lon: number) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Função de busca principal
  const handleSearch = () => {
    const foundEquipment = equipments.find(
      e => e.nome.toLowerCase() === searchQuery.toLowerCase()
    );
    if (foundEquipment && foundEquipment.coordinates) {
      setSelectedEquipment(foundEquipment);
      mapRef.current?.flyTo([foundEquipment.coordinates.lat, foundEquipment.coordinates.lon], 18);
      setShowSuggestions(false);
    } else {
      setAlertMessage('Nome inválido ou equipamento não existe.');
    }
  };

  // Modal de rota: calcula e exibe a rota usando "Localização Atual" e "Nome do Equipamento"
  const handleDisplayRoute = async () => {
    let currentLoc = currentLocation.trim();
    if (!currentLoc) {
      currentLoc = "R. Joaquim Nabuco, Pernambuco";
    }
    if (!equipmentName.trim()){
      setAlertMessage("Por favor, informe o nome do equipamento desejado.");
      return;
    }
    const foundEquipment = equipments.find(
      e => e.nome.toLowerCase() === equipmentName.trim().toLowerCase()
    );
    if (!foundEquipment) {
      setAlertMessage("Equipamento não encontrado.");
      return;
    }
    setSelectedRouteEquipment(foundEquipment);
    const desiredCoords = await getCoordinates(foundEquipment.logradouro);
    const currentCoords = await getCoordinates(currentLoc);
    if (currentCoords && desiredCoords) {
      const route = await fetchRoute(currentCoords, desiredCoords);
      if (route.length > 0) {
        setRouteCoordinates(route);
        if (fullScreenMapRef.current) {
          const bounds: LatLngBoundsExpression = route;
          fullScreenMapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } else {
        setAlertMessage("Não foi possível obter a rota.");
      }
    } else {
      setAlertMessage("Não foi possível obter coordenadas para uma das localizações.");
    }
  };

  // Força o recálculo do mapa ao abrir o modal
  const handleModalDidPresent = () => {
    setTimeout(() => {
      fullScreenMapRef.current?.invalidateSize();
    }, 200);
  };

  // Hook para garantir que o mapa principal se redimensione corretamente
  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.invalidateSize();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Marcadores para o mapa principal: popup exibe nome e "Aberto até {horarioFechamento}"
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
            Aberto até {equipment.horarioFechamento ? equipment.horarioFechamento : 'N/D'}
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
          {/* Busca principal com autocomplete */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8">
              <IonItem>
                <IonLabel position="floating">Buscar pelo nome</IonLabel>
                <IonInput
                  value={searchQuery}
                  onIonChange={(e) => {
                    setSearchQuery(e.detail.value!);
                    setShowSuggestions(true);
                  }}
                  placeholder="Digite o nome do equipamento"
                />
              </IonItem>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <IonList>
                  {filteredSuggestions.map((item, idx) => (
                    <IonItem button key={idx} onClick={() => handleSelectSuggestion(item.nome)}>
                      <IonLabel>{item.nome} - {item.logradouro}</IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              )}
              <IonButton expand="block" className="botao-personalizado" onClick={handleSearch}>
                Buscar
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Botão para listar equipamentos */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" className="ion-text-center">
              <IonButton
                expand="block"
                className="botao-personalizado"
                onClick={() => setShowEquipmentList(true)}
              >
                Listar Feiras e Hortas Próximas
              </IonButton>
            </IonCol>
          </IonRow>

          {/* Mapa principal */}
          <IonRow className="ion-justify-content-center">
            <IonCol size="300" sizeMd="10">
              <div className="map-container">
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

        {/* Modal para listar equipamentos */}
        <IonModal isOpen={showEquipmentList}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Lista de Feiras e Hortas</IonTitle>
              <IonButton slot="end" onClick={() => setShowEquipmentList(false)}>
                Fechar
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {equipments.map((eq, idx) => (
                eq.coordinates && (
                  <IonItem key={idx} button onClick={() => {
                    setSelectedEquipment(eq);
                    mapRef.current?.flyTo([eq.coordinates.lat, eq.coordinates.lon], 18);
                    setShowEquipmentList(false);
                  }}>
                    <IonLabel>
                      <strong>{eq.nome}</strong>
                      <br />
                      {eq.logradouro}
                      <br />
                      Fechado às {eq.horarioFechamento ? eq.horarioFechamento : 'N/D'}
                    </IonLabel>
                  </IonItem>
                )
              ))}
            </IonList>
          </IonContent>
        </IonModal>

        {/* Modal para rota em tela cheia */}
        <IonModal isOpen={showFullScreenMap} onDidPresent={() => fullScreenMapRef.current?.invalidateSize()}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Mapa - Tela Cheia</IonTitle>
              <IonButton slot="end" onClick={() => setShowFullScreenMap(false)}>
                Fechar
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {/* Formulário para rota */}
            <IonItem>
              <IonLabel position="floating">Localização Atual</IonLabel>
              <IonInput
                value={currentLocation}
                onIonChange={(e) => setCurrentLocation(e.detail.value!)}
                placeholder="Digite sua localização atual (ou deixe vazio)"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Nome do Equipamento</IonLabel>
              <IonInput
                value={equipmentName}
                onIonChange={(e) => setEquipmentName(e.detail.value!)}
                placeholder="Digite o nome do equipamento"
              />
            </IonItem>
            {filteredEquipments.length > 0 && (
              <IonList>
                {filteredEquipments.map((eq: any, idx: number) => (
                  <IonItem button key={idx} onClick={() => {
                    setEquipmentName(eq.nome);
                    setFilteredEquipments([]);
                  }}>
                    <IonLabel>{eq.nome} - {eq.logradouro}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
            <IonButton expand="block" onClick={handleDisplayRoute}>
              Exibir Rota
            </IonButton>
            <MapContainer
              center={routeCoordinates.length > 0 ? routeCoordinates[0] : initialPosition}
              zoom={13}
              style={{ height: '70vh', width: '100%' }}
              ref={fullScreenMapRef}
            >
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {routeCoordinates.length > 0 && (
                <>
                  <Marker position={routeCoordinates[0]} icon={DefaultIcon}>
                    <Popup>Localização Atual</Popup>
                  </Marker>
                  {selectedEquipment && (
                    <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={DefaultIcon}>
                      <Popup>
                        <strong>{selectedEquipment.nome}</strong>
                        <br />
                        Fechado às {selectedEquipment.horarioFechamento ? selectedEquipment.horarioFechamento : 'N/D'}
                      </Popup>
                    </Marker>
                  )}
                  <Polyline positions={routeCoordinates} color="red" />
                </>
              )}
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
