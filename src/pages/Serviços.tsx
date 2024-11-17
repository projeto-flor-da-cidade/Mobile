import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Serviços.css';
import logoPrefeitura from '../assets/logo-prefeitura.jpg'; 
import logoProjeto from '../assets/logo-projeto.jpg';  

const Servicos: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Serviços</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes">
      <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
          <div className="button-container">  <div className="button-group">
          <IonButton expand="block" color="primary">
            Serviços da SEAU
          </IonButton>
          <IonButton expand="block" color="secondary">
            Mapa das feiras
          </IonButton>
        </div>
        </div>
        <div className="voltar-button">
          <IonButton expand="block" color="secondary" onClick={() => history.push('/home')}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Servicos;
