import { IonContent, IonHeader, IonPage, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons'; // Ícones para o botão voltar
import './Serviços.css';

const ServicoSEAU: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage className='Servico SEAU'>
      <IonHeader className="header-custom">
        <div className="header-container">
          <IonButton className="circle-button" onClick={() => history.goBack()}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="titulo">
            <p>SERVIÇO SEAU</p>
          </div>
        </div>
      </IonHeader>
      
      
      <IonContent className="ion-padding centralizar-conteudo BackgroundPagina">
        <IonButton expand="block" className="botao-personalizado">Curso Cultiva Recife</IonButton>
        <IonButton expand="block" className="botao-personalizado">Faça Sua Horta em Casa</IonButton>
        <IonButton expand="block" className="botao-personalizado">PANCS e suas Receitas</IonButton>
        <IonButton expand="block" className="botao-personalizado">Projeto Recolheita</IonButton>
        <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/espaço')}>Nossos Espaços Produtivos</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ServicoSEAU;


