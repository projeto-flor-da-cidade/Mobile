import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Serv1.css';
import logoPrefeitura from '../assets/logo-prefeitura.png'; 
import logoProjeto from '../assets/logo-projeto.png'; 


const Serv1: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Serviços SEAU Pagina 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae'}}>
      <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
          <div className="button-container">  <div className="button-group">
          <IonButton expand="block" className="botao-personalizado">Acompanhamento de Hortas</IonButton>
          <IonButton expand="block" className="botao-personalizado">Curso Cultiva Recife</IonButton>
          <IonButton expand="block" className="botao-personalizado">Faça Sua Horta em Casa</IonButton>
          <IonButton expand="block" className="botao-personalizado">PANCS e suas Receitas</IonButton>
          <IonButton expand="block" className="botao-personalizado">Projeto Recolheita</IonButton>
          <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/espaço')}>Nossos Espaços Produtivos</IonButton>
        </div>
        </div>
        <div className="footer">
          <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/serviços')}>
            Voltar
          </IonButton>
          <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/serv2')}>
            <span className="arrow">&rarr;</span>
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Serv1;
