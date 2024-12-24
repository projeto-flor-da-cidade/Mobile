import { IonContent, IonPage, IonButton, } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import logoPrefeitura from '../assets/logo-prefeitura.png';
import logoProjeto from '../assets/logo-projeto.png';
import bannerProjeto from '../assets/banner-pricipal.svg';

const Home: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage className="BakgroundPagina">
      <IonContent className="ion-padding centralizar-conteudo BakgroundPagina">
        <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
        <div className='borda-arredondada-banner'>
          <img src={bannerProjeto} alt="Banner Projeto" className="banner-projeto" />
        </div>
        <div className="borda-arredondada">
          <p className="titulo">
            Secretaria Executiva de Agricultura Urbana SEAU
          </p>
          <IonButton className="botao-personalizado">
            Sou membro da secretaria
          </IonButton>
          <IonButton
            className="botao-personalizado"
            onClick={() => history.push('/serviços')}
          >
            Não sou membro da secretaria
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

