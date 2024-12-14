import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Serv2.css';
import logoPrefeitura from '../assets/logo-prefeitura.png'; 
import logoProjeto from '../assets/logo-projeto.png'; 


const Serv2: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Serviços SEAU Pagina 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae'}}>
      <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
          <div className="button-container">  <div className="button-group">
          <IonButton expand="block" className="botao-personalizado"></IonButton>
          <IonButton expand="block" className="botao-personalizado"></IonButton>
          <IonButton expand="block" className="botao-personalizado"></IonButton>
          <IonButton expand="block" className="botao-personalizado"></IonButton>
          <IonButton expand="block" className="botao-personalizado"></IonButton>
          <IonButton expand="block" className="botao-personalizado"></IonButton>
        </div>
        </div>
        <div className="voltar-button">
          <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/serv1')}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Serv2;
