import { IonContent, IonHeader, IonPage, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons'; // Ícones para o botão voltar
import './Serviços.css';
import servicoIcon from '../assets/iconeServicosSeau.png'; 
import mapaIcon from '../assets/iconeMapaHortasFeira.png'; 
import cursosIcon from '../assets/iconeCursos.png'; 

const Servicos: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage className='Servicos'>
      <IonHeader className="header-custom">
        <div className="header-container">
          <IonButton className="circle-button" onClick={() => history.push('/home')}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="titulo">
            <p>SERVIÇOS</p>
          </div>
        </div>
      </IonHeader>
      
      <IonContent className="ion-padding centralizar-conteudo BackgroundPagina">
        {/* Grade de botões */}
        <div className="grid-container">
          <div className="card" onClick={() => history.push('/ServiçoSEAU')}>
            <img src={servicoIcon} alt="Serviços da SEAU" className="card-image" />
            <p className="card-caption">Serviços da SEAU</p>
          </div>
          <div className="card" onClick={() => history.push('/Mapa')}>
            <img src={mapaIcon} alt="Mapa das feiras" className="card-image" />
            <p className="card-caption">Mapa das feiras</p>
          </div>
          <div className="card" onClick={() => history.push('/serv1')}>
            <img src={cursosIcon} alt="Cursos" className="card-image" />
            <p className="card-caption">Cursos</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Servicos;

