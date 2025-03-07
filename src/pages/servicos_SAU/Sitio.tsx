import { 
    IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
    IonButton, IonModal, IonDatetime 
  } from '@ionic/react';
  import { useHistory } from 'react-router-dom';
  import { useState } from 'react';
  import './Sitio.css';
  
  const Sitio: React.FC = () => {
    const history = useHistory();
    const [showDatetimeModal, setShowDatetimeModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>();
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Sítio Natan Vale</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding centralizar-botoes ion-content-custom">
          <div className="caixa-destaque">
            <h1>Sítio Natan Vale</h1>
          </div>
          <div className="button-container">
            <IonButton expand="block" className="botao-personalizado">
              Fotos do Sítio
            </IonButton>
            <IonButton 
              expand="block" 
              className="botao-personalizado" 
              onClick={() => setShowDatetimeModal(true)}
            >
              Agende sua visita ao Sítio
            </IonButton>
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
  
          {/* Modal com IonDatetime */}
          <IonModal isOpen={showDatetimeModal} onDidDismiss={() => setShowDatetimeModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Selecione a Data e Horário</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonDatetime 
                locale="pt-BR"
                presentation="date-time"
                cancelText="Cancelar"
                doneText="Marcar visita"
                value={selectedDate}
                highlightedDates={[
                  { date: '2025-04-01', textColor: '#000000', backgroundColor: '#ffd700' },
                  { date: '2025-04-15', textColor: '#000000', backgroundColor: '#ffd700' },
                  { date: '2025-04-25', textColor: '#000000', backgroundColor: '#ffd700' },
                  { date: '2025-04-30', textColor: '#000000', backgroundColor: '#ffd700' }
                ]}
                onIonChange={(e) => {
                  let newValue = e.detail.value;
                  if (Array.isArray(newValue)) {
                    newValue = newValue[0];
                  }
                  setSelectedDate(newValue ?? undefined);
                }}
              />
              <div className="modal-buttons">
                <IonButton 
                  expand="block" 
                  className="botao-personalizado" 
                  onClick={() => setShowDatetimeModal(false)}
                >
                  Cancelar
                </IonButton>
                <IonButton 
                  expand="block" 
                  className="botao-personalizado" 
                  onClick={() => {
                    // Adicione aqui a lógica para confirmar a data escolhida
                    setShowDatetimeModal(false);
                  }}
                >
                  Marcar visita
                </IonButton>
              </div>
            </IonContent>
          </IonModal>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Sitio;
  