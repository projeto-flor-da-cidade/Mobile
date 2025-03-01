import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Agroeco.css'; // Importando o CSS externo

const Agroeco: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Plano de Agroecologia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding centralizar-botoes agroeco-background">
        <div className="agroeco-container">
          <h1 className="agroeco-title">
            PLANO DE AGROECOLOGIA URBANA
          </h1>
          <p>
            • Implantação e apoio a 180 estruturas de produção, como hortas, pomares, roçados e hortas fitoterápicas e escolares;
            <br />• Desenvolvimento de parcerias com, no mínimo, 10 organizações sociais, acadêmicas e comunitárias por ano para projetos agroecológicos;
            <br />• Implantação da coleta de orgânicos e compostagem em 20 escolas municipais;
            <br />• Construção da política de agroecologia urbana do Recife.
          </p>
        </div>
        <div className="voltar-button">
          <IonButton expand="block" className="botao-personalizado" onClick={() => history.goBack()}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Agroeco;
