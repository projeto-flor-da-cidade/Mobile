import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar  , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import logoPrefeitura from '../assets/logo-prefeitura.jpg'; 
import logoProjeto from '../assets/logo-projeto.jpg';  
import bannerProjeto from '../assets/banner-projeto.jpg'

const Home: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes">
      <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
        <img src={bannerProjeto} alt="Banner Projeto" className="banner-projeto" />
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="container">  <p className="titulo">Secretaria Executiva de Agricultura Urbana 
          SEAU
         </p>
         <IonButton expand="block" color="primary">
            Sou membro da secretaria
          </IonButton>
          <IonButton expand="block" color="secondary" onClick={() => history.push('/serviços')}>
            Não sou membro da secretaria
          </IonButton>
         </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;