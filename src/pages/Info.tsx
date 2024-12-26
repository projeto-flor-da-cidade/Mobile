import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Info: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Informações SEAU</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae'}}>
        <div className="container">  <p className="titulo">sobre a secretaria-executiva de agricultura urbana-SEAU
        </p>
      </div>
      <div className="button-container">  <div className="button-group">
      <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/missão')}>Missão</IonButton>
      <IonButton expand="block"  className="botao-personalizado">Visão</IonButton>
      <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/agroeco')}>Plano de Agroecologia</IonButton>
        </div>
        </div>
      <div className="voltar-button">
          <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/home')}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Info;