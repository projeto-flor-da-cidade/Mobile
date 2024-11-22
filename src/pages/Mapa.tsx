import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Mapa.css';
import logoPrefeitura from '../assets/logo-prefeitura.png'; 
import logoProjeto from '../assets/logo-projeto.png'; 
import mapa from '../assets/mapa.png'
const Mapa: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mapa</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes"
      style={{ '--background': '#316cae'}}
      >
      <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
          <div className="button-container">  <div className="button-group">
          <IonButton expand="block" className="botao-personalizado">
            Para onde você quer ir          </IonButton>
          <IonButton expand="block" className="botao-personalizado">
            Rotas
          </IonButton>
        </div>
        </div>
        <div>
        <img src={mapa} alt="Mapa" className="mapa" />
        <IonButton expand="block" className="botao-personalizado">
            Cadastre sua Feira Agroecológica
          </IonButton>
        </div>
        <div className="voltar-button">
          <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/serviços')}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Mapa;