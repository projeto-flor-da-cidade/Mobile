import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonToast,
  IonAlert,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonSearchbar,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonMenu
} from '@ionic/react';
import { menuController } from '@ionic/core/components';
import { useHistory } from 'react-router-dom';
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

// Importe a imagem de fallback (verifique o caminho conforme sua estrutura)
import noImageFound from '../../assets/ErroFotoEquipamento.jpg';

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

const Mapa: React.FC = () => {
  const history = useHistory();
  const initialPosition: LatLngExpression = [-8.0476, -34.8770]; // Recife

  // Estados principais
  const [equipments, setEquipments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showEquipmentList, setShowEquipmentList] = useState(false);
  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  // Estados do campo de busca principal
  const [showSuggestions, setShowSuggestions] = useState(true);
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return equipments.filter((e) =>
      e.nome.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [searchQuery, equipments]);

  // Estados do modal/rota
  const [currentLocation, setCurrentLocation] = useState('');
  const [equipmentName, setEquipmentName] = useState('');
  const [filteredEquipments, setFilteredEquipments] = useState<any[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [selectedRouteEquipment, setSelectedRouteEquipment] = useState<any>(null);

  // Estados para Toast e Alertas
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [showToast, setShowToast] = useState(false);
  const [showProblemAlert, setShowProblemAlert] = useState(false);

  // Estado para armazenar a foto (URL) do equipamento
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  // Refs para os mapas
  const mapRef = useRef<LeafletMap | null>(null);
  const fullScreenMapRef = useRef<LeafletMap | null>(null);

  // Buscar equipamentos
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

  // Atualiza sugestões no modal de rota
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

  // Atualiza a URL da foto a partir do campo photoLocalPath
useEffect(() => {
  if (selectedRouteEquipment && selectedRouteEquipment.photoLocalPath) {
    // Constrói a URL usando a pasta de uploads, que deve estar configurada para servir arquivos estáticos
    setPhotoSrc(`http://localhost:8081/uploads/${selectedRouteEquipment.photoLocalPath}`);
  } else {
    setPhotoSrc(null);
  }
}, [selectedRouteEquipment]);

  // Seleciona sugestão no search principal
  const handleSelectSuggestion = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    const found = equipments.find((e) => e.nome.toLowerCase() === name.toLowerCase());
    if (found && found.coordinates) {
      setSelectedEquipment(found);
      mapRef.current?.flyTo([found.coordinates.lat, found.coordinates.lon], 18);
    }
  };

  // Dispara a busca ao pressionar Enter ou ao selecionar uma sugestão
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

  // Exibe a rota no modal de mapa expandido
  const handleDisplayRoute = async (nomeEquipamento?: string) => {
    const nome = nomeEquipamento ? nomeEquipamento : equipmentName;
    let currentLoc = currentLocation.trim();
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
      setAlertMessage('Equipamento não encontrado.');
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
        setAlertMessage('Não foi possível obter a rota.');
      }
    } else {
      setAlertMessage('Não foi possível obter coordenadas para uma das localizações.');
    }
  };

  // Centraliza o mapa do modal na localização atual
  const handleCenterFullMap = () => {
    if (!fullScreenMapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fullScreenMapRef.current?.flyTo([latitude, longitude], 14);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        setAlertMessage('Não foi possível obter sua localização.');
      }
    );
  };

  // Força recálculo do mapa ao abrir o modal
  const handleModalDidPresent = () => {
    setTimeout(() => {
      fullScreenMapRef.current?.invalidateSize();
    }, 200);
  };

  // Marcadores do mapa principal
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

  // Função para renderizar a foto do equipamento com fallback
  const renderEquipmentPhoto = () => {
    return (
      <img
        src={photoSrc || noImageFound}
        alt="Foto do estabelecimento"
        onError={(e) => {
          e.currentTarget.onerror = null; // Evita loop infinito
          e.currentTarget.src = noImageFound;
        }}
        className="equipment-photo"
      />
    );
  };

  return (
    <>
      {/* Página Principal */}
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Mapa</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding page-content">
          <IonGrid className="content-container">
            {/* Busca principal */}
            <IonRow className="ion-justify-content-center">
              <IonCol size="12" sizeMd="8">
                <IonSearchbar
                  value={searchQuery}
                  onIonChange={(e) => {
                    setSearchQuery(e.detail.value!);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                  placeholder="Buscar equipamento"
                  debounce={500}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <IonList>
                    {filteredSuggestions.map((item, idx) => (
                      <IonItem
                        button
                        key={idx}
                        onClick={() => {
                          handleSelectSuggestion(item.nome);
                          handleSearch();
                        }}
                      >
                        <div>
                          <strong>{item.nome}</strong>
                          <br />
                          {item.logradouro}
                          <br />
                        </div>
                      </IonItem>
                    ))}
                  </IonList>
                )}
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

            {/* Botões extras */}
            <IonRow className="ion-justify-content-center ion-margin-top">
              <IonCol size="12" sizeMd="20" className="ion-text-center">
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

          {/* Modal para listar equipamentos (na página principal) */}
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
                    <IonItem
                      key={idx}
                      button
                      onClick={() => {
                        setSelectedEquipment(eq);
                        mapRef.current?.flyTo([eq.coordinates.lat, eq.coordinates.lon], 18);
                        setShowEquipmentList(false);
                      }}
                    >
                      <div>
                        <strong>{eq.nome}</strong>
                        <br />
                        {eq.logradouro}
                        <br />
                        Fecha às {eq.horarioFechamento ? eq.horarioFechamento : 'N/D'}
                      </div>
                    </IonItem>
                  )
                ))}
              </IonList>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>

      {/* Modal de tela cheia + IonMenu */}
      <IonModal isOpen={showFullScreenMap} onDidPresent={handleModalDidPresent}>
        {/* IonMenu com contentId="modal-map-content" */}
        <IonMenu menuId="modalMenu" contentId="modal-map-content" side="start" type="overlay">
          <IonContent>
            <div className="menu-content">
              {selectedRouteEquipment ? (
                <>
                  {/* Imagem do equipamento ou fallback */}
                  <div className="equipment-photo-container">
                    {renderEquipmentPhoto()}
                  </div>

                  {/* Nome do equipamento */}
                  <h2 className="equipment-name">{selectedRouteEquipment.nome}</h2>

                  {/* Cinco estrelas */}
                  <div className="stars-row">
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                    <IonIcon icon={starOutline} className="star-icon" />
                  </div>

                  {/* Horário de fechamento */}
                  <div className="closing-time">
                    Fecha às {selectedRouteEquipment.horarioFechamento || 'N/D'}
                  </div>

                  {/* Endereço */}
                  <div className="address-info">
                    {selectedRouteEquipment.logradouro}, {selectedRouteEquipment.numero} -{' '}
                    {selectedRouteEquipment.compl}
                  </div>

                  {/* Observação */}
                  <div className="observation-info">
                    {selectedRouteEquipment.observ}
                  </div>

                  {/* Botão "Ir para a loja" (desativado) */}
                  <IonButton disabled className="ir-loja-button">
                    <IonIcon icon={storefrontOutline} size="small" />
                    <strong>Ir para a loja</strong>
                  </IonButton>

                  {/* Ícones de ação */}
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

        {/* IonPage que o menu sobrepõe */}
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle className="ion-text-center">Mapa</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowFullScreenMap(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          {/* Content que o IonMenu usa */}
          <IonContent id="modal-map-content">
            {/* Formulário para rota */}
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

            {/* Mapa dentro do modal */}
            <MapContainer
              center={routeCoordinates.length > 0 ? routeCoordinates[0] : initialPosition}
              zoom={13}
              className="full-screen-map"
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
                          onClick={() => menuController.open("modalMenu")}
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

            {/* FABs dentro do Modal */}
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
              <IonFabButton size="small" onClick={handleCenterFullMap}>
                <IonIcon icon={compassOutline} />
              </IonFabButton>
            </IonFab>
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
