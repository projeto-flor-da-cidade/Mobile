import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Espaco.css'; // Importação do arquivo CSS
import logoPrefeitura from '../../assets/logo-prefeitura.png'; 
import logoProjeto from '../../assets/logo-projeto.png'; 
import SAFUC from '../../assets/SAFUC.png';
import Sitio from '../../assets/Sítio.png';

const Espaco: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recife Prefeitura</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes ion-content-custom">
        <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
        <img src={SAFUC} alt="SAFUC" className="imagem-clicavel" onClick={() => history.push('/safuc')} />
        <img src={Sitio} alt="Sítio" className="imagem-clicavel" onClick={() => history.push('/sitio')} />
        <IonButton expand="block" className="botao-personalizado" onClick={() => history.goBack()}>Voltar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Espaco;
