import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import logoPrefeitura from '../assets/logo-prefeitura.png'; 
import logoProjeto from '../assets/logo-projeto.png'; 
import SAFUC from '../assets/SAFUC.png';
import Sítio from '../assets/Sítio.png';

const Espaco: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recife Prefeitura</IonTitle> 
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes" style={{ '--background': '#316cae' }}>
        <div className="header-logos">
          <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          <img src={logoProjeto} alt="Logo Projeto" className="logo-projeto" />
        </div>
        <img
    src={SAFUC}
    alt="SAFUC"
    className="SAFUC"
    onClick={() => history.push('/safuc')} 
    style={{ cursor: 'pointer' }} 
  />
  <img
    src={Sítio}
    alt="Sítio"
    className="sítio"
    onClick={() => history.push('/sítio')} 
    style={{ cursor: 'pointer' }}
  />
        <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/serv1')}>Voltar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Espaco;
