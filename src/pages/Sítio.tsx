import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';


const Sítio: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sitío Natan Vale</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae'}}>
        <div style={{ backgroundColor: 'lightgray', padding: '20px', margin: '20px', borderRadius: '10px' }}>
        <h1>Sitío Natan Vale</h1>
      </div>
      <div className="button-container">  <div className="button-group">
      <IonButton expand="block"  className="botao-personalizado">Fotos do Sitío</IonButton>
      <IonButton expand="block"  className="botao-personalizado">Agende sua visita ao Sitío</IonButton>
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

export default Sítio;