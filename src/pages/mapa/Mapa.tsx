import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  IonModal,
  IonAlert,
  IonToast,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  // IonMenuButton, // REMOVIDO: Ícone do menu
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonPage
} from '@ionic/react';
import { menuController } from '@ionic/core/components';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import L, { LatLngExpression, Map as LeafletMap, LatLngBoundsExpression } from 'leaflet';
import {
  compassOutline,
  warningOutline,
  closeOutline,
  informationCircleOutline,
  starOutline,
  bookmarkOutline,
  callOutline,
  shareSocialOutline,
  alertCircleOutline,
  storefrontOutline
} from 'ionicons/icons';

import noImageFound from '../../assets/ErroFotoEquipamento.jpg';

// Tipagem opcional para as novas props
interface MapaProps {
  isOpen?: boolean;   // controla abertura do modal externamente
  onClose?: () => void; // callback para fechar modal externamente
}

const DefaultIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Função para obter coordenadas via Nominatim
const getCoordinates = async (
  logradouro: string
): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        logradouro
      )}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } else {
      throw new Error('Endereço não encontrado.');
    }
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    return null;
  }
};

// Função para obter rota via API OSRM
const fetchRoute = async (
  start: { lat: number; lon: number },
  end: { lat: number; lon: number }
): Promise<[number, number][]> => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      // Converte cada par [lon, lat] para [lat, lon]
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0]
      ]);
    } else {
      throw new Error('Rota não encontrada.');
    }
  } catch (error) {
    console.error('Erro ao buscar rota:', error);
    return [];
  }
};

const Mapa: React.FC<MapaProps> = ({ isOpen, onClose }) => {
  // ========== States originais ==========
  const [equipments, setEquipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showEquipmentList, setShowEquipmentList] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(true);
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return equipments.filter((e) =>
      e.nome.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery, equipments]);

  // Modal de rota
  const [currentLocation, setCurrentLocation] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [filteredEquipments, setFilteredEquipments] = useState<any[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [selectedRouteEquipment, setSelectedRouteEquipment] = useState<any>(null);

  // Feedback
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState(false);
  const [showProblemAlert, setShowProblemAlert] = useState(false);

  // Foto do equipamento
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  // Referências do mapa
  const mapRef = useRef<LeafletMap | null>(null);
  const fullScreenMapRef = useRef<LeafletMap | null>(null);

  // ========== NOVO: localização do usuário ==========
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Ao montar, tentamos obter a localização do usuário
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Usuário não permitiu localização ou erro:', error);
        // Se der erro, mantemos userLocation = null e usamos default
      }
    );
  }, []);

  // ========== FUNÇÕES ORIGINAIS ==========

  const fetchEquipments = async () => {
    try {
      const response = await fetch('http://localhost:8081/equipamento');
      const data = await response.json();
      // Obter coordenadas para cada equipamento
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

  useEffect(() => {
    if (equipmentName.trim()) {
      const filtered = equipments.filter((e) =>
        e.nome.toLowerCase().includes(equipmentName.trim().toLowerCase())
      );
      setFilteredEquipments(filtered);
    } else {
      setFilteredEquipments([]);
    }
  }, [equipmentName, equipments]);

  useEffect(() => {
    if (selectedRouteEquipment && selectedRouteEquipment.photoLocalPath) {
      setPhotoSrc(`http://localhost:8081/uploads/${selectedRouteEquipment.photoLocalPath}`);
    } else {
      setPhotoSrc(null);
    }
  }, [selectedRouteEquipment]);

  const handleSelectSuggestion = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    const found = equipments.find((e) => e.nome.toLowerCase() === name.toLowerCase());
    if (found && found.coordinates) {
      setSelectedEquipment(found);
      mapRef.current?.flyTo([found.coordinates.lat, found.coordinates.lon], 18);
    }
  };

  const handleSearch = () => {
    const foundEquipment = equipments.find(
      (e) => e.nome.toLowerCase() === searchQuery.toLowerCase()
    );
    if (foundEquipment && foundEquipment.coordinates) {
      setSelectedEquipment(foundEquipment);
      mapRef.current?.flyTo([foundEquipment.coordinates.lat, foundEquipment.coordinates.lon], 18);
      setShowSuggestions(false);
    } else {
      setAlertMessage('Nome inválido ou equipamento não existe.');
    }
  };

  const handleDisplayRoute = async (nomeEquipamento?: string) => {
    const nome = nomeEquipamento ? nomeEquipamento : equipmentName;
    let currentLoc = currentLocation.trim();

    // Se o usuário não informou nada, mas temos userLocation, usamos a do device
    if (!currentLoc && userLocation) {
      currentLoc = `${userLocation[0]},${userLocation[1]}`; // "lat,lon"
    }
    // Caso não haja userLocation, fallback para algo
    if (!currentLoc) {
      currentLoc = 'R. Joaquim Nabuco, Pernambuco';
    }

    if (!nome.trim()) {
      setAlertMessage('Por favor, informe o nome do equipamento desejado.');
      return;
    }

    const foundEquipment = equipments.find(
      (e) => e.nome.toLowerCase() === nome.trim().toLowerCase()
    );
    if (!foundEquipment) {
      // ALERTA de equipamento não encontrado
      setAlertMessage('Equipamento não encontrado.');
      return;
    }
    setSelectedRouteEquipment(foundEquipment);

    // Pega coordenadas do equipamento
    const desiredCoords = await getCoordinates(foundEquipment.logradouro);

    // Pega coordenadas do currentLoc (pode ser userLocation ou um logradouro)
    let currentCoords: { lat: number; lon: number } | null = null;
    if (userLocation && currentLoc === `${userLocation[0]},${userLocation[1]}`) {
      // Se a string for "lat,lon" e bater com userLocation, usamos direto
      currentCoords = { lat: userLocation[0], lon: userLocation[1] };
    } else {
      // Tenta via Nominatim
      currentCoords = await getCoordinates(currentLoc);
    }

    if (currentCoords && desiredCoords) {
      const route = await fetchRoute(currentCoords, desiredCoords);
      if (route.length > 0) {
        setRouteCoordinates(route);
        if (fullScreenMapRef.current) {
          const bounds: LatLngBoundsExpression = route;
          fullScreenMapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } else {
        setAlertMessage('Não foi possível obter a rota.');
      }
    } else {
      setAlertMessage('Não foi possível obter coordenadas para uma das localizações.');
    }
  };

  const handleCenterFullMap = () => {
    // Se userLocation existe, centraliza nela; se não, exibe alerta
    if (!fullScreenMapRef.current) return;
    if (userLocation) {
      fullScreenMapRef.current.flyTo(userLocation, 14);
    } else {
      setAlertMessage('Não foi possível obter sua localização.');
    }
  };

  const handleModalDidPresent = () => {
    setTimeout(() => {
      fullScreenMapRef.current?.invalidateSize();
    }, 200);
  };

  // Agora exibiremos todos os equipamentos no mapa:
  const markers = useMemo(() => {
    return equipments
      .filter((equipment) => equipment.coordinates)
      .map((equipment, index) => (
        <Marker
          key={index}
          position={[equipment.coordinates.lat, equipment.coordinates.lon]}
          icon={DefaultIcon}
        >
          <Popup>
            <strong>{equipment.nome}</strong>
            <br />
            Fecha às {equipment.horarioFechamento ? equipment.horarioFechamento : 'N/D'}
          </Popup>
        </Marker>
      ));
  }, [equipments]);

  const renderEquipmentPhoto = () => {
    return (
      <img
        src={photoSrc || noImageFound}
        alt="Foto do estabelecimento"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = noImageFound;
        }}
        className="equipment-photo"
      />
    );
  };

  // Lógica para abrir/fechar via props ou state interno
  const effectiveModalState = isOpen !== undefined ? isOpen : showFullScreenMap;

  // Define a posição inicial do mapa:
  // 1) Se temos rota, usamos a primeira coordenada da rota
  // 2) Senão, se temos userLocation, usamos ela
  // 3) Senão, usamos o default
  const defaultCenter: [number, number] = [-8.0476, -34.8770]; // Recife
  const mapCenter = routeCoordinates.length > 0
    ? routeCoordinates[0]
    : (userLocation || defaultCenter);

  return (
    <>
      <IonModal
        isOpen={effectiveModalState}
        onDidPresent={handleModalDidPresent}
        onDidDismiss={() => {
          if (onClose) onClose();
          setShowFullScreenMap(false);
        }}
      >
        {/** IonMenu para exibir informações do equipamento */}
        <IonMenu menuId="modalMenu" contentId="modal-map-content" side="start" type="overlay">
          <IonContent>
            <div className="menu-content">
              {selectedRouteEquipment ? (
                <>
                  <div className="equipment-photo-container">
                    {renderEquipmentPhoto()}
                  </div>
                  <h2 className="equipment-name">{selectedRouteEquipment.nome}</h2>

                  <div className="stars-row">
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                  </div>

                  <div className="closing-time">
                    Fecha às {selectedRouteEquipment.horarioFechamento || 'N/D'}
                  </div>

                  <div className="address-info">
                    {selectedRouteEquipment.logradouro}, {selectedRouteEquipment.numero} -{' '}
                    {selectedRouteEquipment.compl}
                  </div>

                  <div className="observation-info">
                    {selectedRouteEquipment.observ}
                  </div>

                  <IonButton disabled className="ir-loja-button">
                    <IonIcon icon={storefrontOutline} size="small" />
                    <strong>Ir para a loja</strong>
                  </IonButton>

                  <div className="actions-row">
                    <div className="action-item">
                      <IonIcon icon={bookmarkOutline} size="small" />
                      <p>Salvar</p>
                    </div>
                    <div className="action-item">
                      <IonIcon icon={callOutline} size="small" />
                      <p>Ligar</p>
                    </div>
                    <div className="action-item">
                      <IonIcon icon={shareSocialOutline} size="small" />
                      <p>Compartilhar</p>
                    </div>
                    <div className="action-item">
                      <IonIcon icon={alertCircleOutline} size="small" />
                      <p>Denunciar</p>
                    </div>
                  </div>
                </>
              ) : (
                <p>Nenhum estabelecimento encontrado.</p>
              )}
            </div>
          </IonContent>
        </IonMenu>

        {/** IonPage que o menu sobrepõe */}
        <IonPage>
          <IonHeader>
            <IonToolbar>
              {/** REMOVIDO: IonButtons slot="start" com IonMenuButton */}
              <IonTitle className="ion-text-center">Mapa</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    if (onClose) onClose();
                    setShowFullScreenMap(false);
                  }}
                >
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent id="modal-map-content">
            <IonItem>
              <IonSearchbar
                value={currentLocation}
                onIonChange={(e) => setCurrentLocation(e.detail.value!)}
                placeholder="Localização atual"
                debounce={500}
              />
            </IonItem>
            <IonItem>
              <IonSearchbar
                value={equipmentName}
                onIonChange={(e) => setEquipmentName(e.detail.value!)}
                placeholder="Buscar equipamento"
                debounce={500}
              />
            </IonItem>
            {filteredEquipments.length > 0 && (
              <IonList>
                {filteredEquipments.map((eq: any, idx: number) => (
                  <IonItem
                    button
                    key={idx}
                    onClick={() => {
                      setEquipmentName(eq.nome);
                      setFilteredEquipments([]);
                    }}
                  >
                    <IonLabel>
                      {eq.nome} - {eq.logradouro}
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
            <IonButton expand="block" onClick={() => handleDisplayRoute(equipmentName)}>
              Exibir Rota
            </IonButton>

            {/** Mapa principal (agora exibindo todos os markers) */}
            <MapContainer
              center={mapCenter}
              zoom={13}
              className="full-screen-map"
              ref={fullScreenMapRef}
            >
              <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {/** Mostra todos os equipamentos */}
              {markers}

              {/** Se houver rota, mostra o trajeto e marcadores de início/fim */}
              {routeCoordinates.length > 0 && (
                <>
                  <Marker position={routeCoordinates[0]} icon={DefaultIcon}>
                    <Popup>Localização Atual</Popup>
                  </Marker>
                  {selectedRouteEquipment && (
                    <Marker
                      position={routeCoordinates[routeCoordinates.length - 1]}
                      icon={DefaultIcon}
                    >
                      <Popup>
                        <strong>{selectedRouteEquipment.nome}</strong>
                        &nbsp;
                        <IonIcon
                          icon={informationCircleOutline}
                          style={{ cursor: 'pointer' }}
                          size="medium"
                          data-open-menu
                          onClick={() => menuController.open('modalMenu')}
                        />
                        <br />
                        Fecha às{' '}
                        {selectedRouteEquipment.horarioFechamento
                          ? selectedRouteEquipment.horarioFechamento
                          : 'N/D'}
                      </Popup>
                    </Marker>
                  )}
                  <Polyline positions={routeCoordinates} color="red" />
                </>
              )}
            </MapContainer>

            {/** FAB para centralizar na localização do usuário */}
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton size="small" onClick={handleCenterFullMap}>
                <IonIcon icon={compassOutline} />
              </IonFabButton>
            </IonFab>

            {/** FAB para alertar problemas */}
            <IonFab
              vertical="bottom"
              horizontal="end"
              slot="fixed"
              style={{ marginBottom: '60px' }}
            >
              <IonFabButton size="small" onClick={() => setShowProblemAlert(true)}>
                <IonIcon icon={warningOutline} />
              </IonFabButton>
            </IonFab>
          </IonContent>
        </IonPage>
      </IonModal>

      {/* Alerta de Problema */}
      <IonAlert
        isOpen={showProblemAlert}
        onDidDismiss={() => setShowProblemAlert(false)}
        header="Informe um problema:"
        inputs={[
          {
            name: 'problemDescription',
            type: 'textarea',
            placeholder: 'Descreva o problema'
          }
        ]}
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Enviar',
            handler: (data) => {
              console.log('Problema enviado:', data.problemDescription);
              // Envie os dados para um endpoint se necessário
            }
          }
        ]}
      />

      {/* Alerta geral */}
      <IonAlert
        isOpen={!!alertMessage}
        onDidDismiss={() => setAlertMessage('')}
        header="Erro"
        message={alertMessage}
        buttons={['OK']}
      />

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        duration={1500}
        color={toastColor}
        onDidDismiss={() => setShowToast(false)}
      />
    </>
  );
};

export default Mapa;
