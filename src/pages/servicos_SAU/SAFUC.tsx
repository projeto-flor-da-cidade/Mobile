import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './SAFUC.css'; // Importação do arquivo CSS

const SAFUC: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SAFUC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes ion-content-custom">
        <div className="caixa-destaque">
          <h1>SAFUC</h1>
        </div>
        <div className="button-container">
          <IonButton expand="block" className="botao-personalizado">Fotos do SAFUC</IonButton>
          <IonButton expand="block" className="botao-personalizado">Agende sua visita ao SAFUC</IonButton>
        </div>
        <div className="voltar-button">
          <IonButton expand="block" className="botao-personalizado" onClick={() => history.goBack()}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SAFUC;
