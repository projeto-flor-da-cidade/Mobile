import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const SAFUC: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>SAFUC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae'}}>
        <div style={{ backgroundColor: 'lightgray', padding: '20px', margin: '20px', borderRadius: '10px' }}>
        <h1>SAFUC</h1>
      </div>
      <div className="button-container">  <div className="button-group">
      <IonButton expand="block"  className="botao-personalizado">Fotos do SAFUC</IonButton>
      <IonButton expand="block"  className="botao-personalizado">Agende sua visita ao SAFUC</IonButton>
        </div>
        </div>
      <div className="voltar-button">
          <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/espaço')}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SAFUC;
