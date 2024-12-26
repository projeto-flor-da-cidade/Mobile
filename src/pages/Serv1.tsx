import { IonContent, IonHeader, IonPage, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Serv1.css';
import { arrowBack } from 'ionicons/icons';

const Serv1: React.FC = () => {
    const history = useHistory();
    return (
        <IonPage className="Serv1">
          <IonHeader className="header-custom">
            <div className="header-container">
              <IonButton className="circle-button" onClick={() => history.push('/serviços')}>
                <IonIcon icon={arrowBack} />
              </IonButton>
              <div className="titulo">
                <p>SERVIÇOS SEAU</p>
              </div>
            </div>
          </IonHeader>
          <IonContent className="ion-padding centralizar-botoes BackgroundPagina">
            <div className="button-container">
              {/* Grade de botões com duas colunas */}
              <div className="grid-container">
                <IonButton expand="block" className="botao-personalizado">Acompanhamento de Hortas</IonButton>
                <IonButton expand="block" className="botao-personalizado">Curso Cultiva Recife</IonButton>
                <IonButton expand="block" className="botao-personalizado">Faça Sua Horta em Casa</IonButton>
                <IonButton expand="block" className="botao-personalizado">PANCS e suas Receitas</IonButton>
                <IonButton expand="block" className="botao-personalizado">Projeto Recolheita</IonButton>
                <IonButton expand="block" className="botao-personalizado" onClick={() => history.push('/espaço')}>
                  Nossos Espaços Produtivos
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonPage>
    );
};

export default Serv1;
