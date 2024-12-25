import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Missão: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Missão</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae'}}>
        <div style={{ backgroundColor: 'lightgray', padding: '20px', margin: '20px', borderRadius: '10px' }}>
        <h1 style={{color:'blue'}}>MISSÃO
            
        Promover a agricultura urbana e desenvolvimento sustentável para a cidade, a partir da
articulação, capacitação, fomento e execução de ações agroecológicas que promovam
uma mudança de paradigmas e a melhoria da qualidade de vida das pessoas, com o
envolvimento da população e o aproveitamento de áreas propícias ao cultivo.
        </h1>
      </div>
      <div className="voltar-button">
          <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/info')}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Missão;