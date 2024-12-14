import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Serviços.css';
import logoPrefeitura from '../assets/logo-prefeitura.png'; 
import logoProjeto from '../assets/logo-projeto.png'; 
import backgroundImage from '../assets/background-image.jpeg';



const Servicos: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Serviços</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="background-customizado ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae',
        background: `url(${backgroundImage}) no-repeat center center fixed`,
        backgroundSize: 'cover',
       }}>
      <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
          <div className="button-container">  <div className="button-group">
          <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/serv1')}>
            Serviços da SEAU
          </IonButton>
          <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/mapa')}>
            Mapa das feiras
          </IonButton>
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

export default Servicos;
